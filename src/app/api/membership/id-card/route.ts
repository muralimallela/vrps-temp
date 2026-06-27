import { connectDB } from "@/src/lib/mongodb";
import { requireMember } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import Address from "@/src/models/Address";
import { generateVerificationSignature } from "@/src/lib/security";

export async function GET() {
  try {
    await connectDB();
    const user = await requireMember();
    const address = await Address.findOne({ userId: user.userId });

    const memId = user.membershipId || user.userId;
    const sig = generateVerificationSignature(memId);

    const fullAddress = address
      ? `${address.street ? address.street + ", " : ""}${address.village ? address.village + ", " : ""}${address.mandal ? address.mandal + ", " : ""}${address.district}, ${address.state} - ${address.pincode}`
      : "Address details updated in profile";

    return ok({
      membershipId: memId,
      sig,
      userId: user.userId,
      name: user.name,
      mobile: user.mobile || "-",
      email: user.email || "-",
      photoUrl: user.photoUrl,
      memberSince: user.memberSince || user.createdAt,
      addressObj: address ? {
        street: address.street || "",
        village: address.village || "",
        mandal: address.mandal || "",
        district: address.district || "",
        state: address.state || "",
        pincode: address.pincode || "",
      } : null,
      address: fullAddress,
    });
  } catch (error) {
    return fail(error, 403);
  }
}
