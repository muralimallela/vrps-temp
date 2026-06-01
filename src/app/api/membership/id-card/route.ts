import { connectDB } from "@/src/lib/mongodb";
import { requireMember } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import Address from "@/src/models/Address";

export async function GET() {
  try {
    await connectDB();
    const user = await requireMember();
    const address = await Address.findOne({ userId: user.userId });

    return ok({
      membershipId: user.membershipId,
      name: user.name,
      photoUrl: user.photoUrl,
      memberSince: user.memberSince,
      address: address
        ? `${address.street}, ${address.village}, ${address.mandal}, ${address.district}, ${address.state} - ${address.pincode}`
        : "",
    });
  } catch (error) {
    return fail(error, 403);
  }
}

