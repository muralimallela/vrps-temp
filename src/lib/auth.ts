import { auth, clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/src/lib/mongodb";
import User from "@/src/models/User";
import { generateUserId } from "@/src/lib/ids";
import Address from "@/src/models/Address";
import Donation from "@/src/models/Donation";
import Membership from "@/src/models/Membership";

type Role = "user" | "admin";

async function syncUserFromClerk(clerkUserId: string) {
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkUserId);
  const primaryPhone = clerkUser.phoneNumbers.find(
    (item) => item.id === clerkUser.primaryPhoneNumberId
  )?.phoneNumber;
  const primaryEmail = clerkUser.emailAddresses.find(
    (item) => item.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  const normalizedEmail = (primaryEmail ?? "").trim().toLowerCase();
  const normalizedMobile = (primaryPhone ?? "").trim();
  const computedName =
    `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "User";

  // Re-link an existing account when Clerk account is recreated with same email/phone.
  const existingByIdentity = await User.findOne({
    isDeleted: { $ne: true },
    $or: [
      ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
      ...(normalizedMobile ? [{ mobile: normalizedMobile }] : []),
    ],
  });

  if (existingByIdentity) {
    existingByIdentity.clerkUserId = clerkUserId;
    existingByIdentity.name = computedName;
    existingByIdentity.mobile = normalizedMobile || existingByIdentity.mobile;
    existingByIdentity.email = normalizedEmail || existingByIdentity.email;
    existingByIdentity.photoUrl = clerkUser.imageUrl ?? existingByIdentity.photoUrl;
    await existingByIdentity.save();
    return existingByIdentity;
  }

  const userId = await generateUserId();

  try {
    return await User.create({
      clerkUserId,
      userId,
      name: computedName,
      mobile: normalizedMobile,
      email: normalizedEmail,
      photoUrl: clerkUser.imageUrl ?? "",
      roles: ["user"],
    });
  } catch (error: unknown) {
    // Handle unique index races by reloading and re-linking.
    const duplicateKeyError = error as { code?: number };
    if (duplicateKeyError?.code === 11000) {
      const conflicted = await User.findOne({
        isDeleted: { $ne: true },
        $or: [
          ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
          ...(normalizedMobile ? [{ mobile: normalizedMobile }] : []),
        ],
      });
      if (conflicted) {
        conflicted.clerkUserId = clerkUserId;
        conflicted.name = computedName;
        conflicted.mobile = normalizedMobile || conflicted.mobile;
        conflicted.email = normalizedEmail || conflicted.email;
        conflicted.photoUrl = clerkUser.imageUrl ?? conflicted.photoUrl;
        await conflicted.save();
        return conflicted;
      }
    }
    throw error;
  }
}

async function migrateLegacyNonMemberId(user: any) {
  if (user.isMember) return user;
  if (!String(user.userId || "").startsWith("VRPSU")) return user;

  const oldUserId = user.userId;
  const newUserId = await generateUserId();

  user.userId = newUserId;
  await user.save();

  await Promise.all([
    Address.updateMany({ userId: oldUserId }, { $set: { userId: newUserId } }),
    Donation.updateMany({ userId: oldUserId }, { $set: { userId: newUserId } }),
    Membership.updateMany({ userId: oldUserId }, { $set: { userId: newUserId } }),
  ]);

  return user;
}

export async function getCurrentAppUser() {
  const { userId } = await auth();
  if (!userId) return null;

  await connectDB();
  let user = await User.findOne({ clerkUserId: userId, isDeleted: { $ne: true } });
  if (!user) {
    user = await syncUserFromClerk(userId);
  }
  return migrateLegacyNonMemberId(user);
}

export async function requireUser() {
  const user = await getCurrentAppUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role: Role) {
  const user = await requireUser();
  if (!user.roles.includes(role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function requireAdmin() {
  return requireRole("admin");
}

export async function requireMember() {
  const user = await requireUser();
  if (!user.isMember) {
    throw new Error("Membership required");
  }
  return user;
}
