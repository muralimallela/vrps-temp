import { connectDB } from "@/src/lib/mongodb";
import { fail, ok } from "@/src/lib/http";
import User from "@/src/models/User";
import Address from "@/src/models/Address";
import { verifyVerificationSignature } from "@/src/lib/security";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const memberId = resolvedParams.id;
    const { searchParams } = new URL(req.url);
    const sig = searchParams.get("sig");

    if (!memberId) {
      return fail("Membership ID is required", 400);
    }

    const user = await User.findOne({
      $or: [{ membershipId: memberId }, { userId: memberId }],
    });

    if (!user || !user.isMember) {
      return fail("Member verification failed or invalid membership ID", 444);
    }

    const officialMemId = user.membershipId || user.userId;
    const isAuthentic = verifyVerificationSignature(officialMemId, sig);

    const address = await Address.findOne({ userId: user.userId });
    const addressText = address
      ? `${address.district}, ${address.state}`
      : "Verified Member";

    // Privacy Protection: Mask name and exact location if cryptographic signature is missing or invalid
    let displayName = user.name;
    let displayLocation = addressText;

    if (!isAuthentic) {
      // Partial masking to prevent automated scraping of member database
      const parts = user.name.split(" ");
      displayName = parts
        .map((p) => (p.length > 2 ? `${p[0]}${"*".repeat(p.length - 2)}${p[p.length - 1]}` : `${p[0]}*`))
        .join(" ");
      displayLocation = address?.state || "India";
    }

    return ok({
      membershipId: isAuthentic ? officialMemId : `${officialMemId.slice(0, 4)}****`,
      name: displayName,
      status: "Verified Active Member",
      memberSince: user.memberSince || user.createdAt,
      location: displayLocation,
      isAuthentic,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    return fail("Verification failed", 500);
  }
}
