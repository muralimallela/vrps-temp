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

    return ok({
      membershipId: officialMemId,
      name: user.name,
      status: "Verified Active Member",
      memberSince: user.memberSince || user.createdAt,
      location: addressText,
      isAuthentic,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    return fail("Verification failed", 500);
  }
}
