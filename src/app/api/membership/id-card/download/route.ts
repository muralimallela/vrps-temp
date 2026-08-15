import { connectDB } from "@/src/lib/mongodb";
import { requireMember } from "@/src/lib/auth";
import { fail } from "@/src/lib/http";
import Address from "@/src/models/Address";
import { createIdCardPdf } from "@/src/lib/idCard";

export async function GET() {
  try {
    await connectDB();
    const user = await requireMember();
    const address = await Address.findOne({ userId: user.userId });
    const addressText = address
      ? `${address.street}, ${address.village}, ${address.mandal}, ${address.district}, ${address.state} - ${address.pincode}`
      : "";

    const pdf = await createIdCardPdf({
      membershipId: user.membershipId || "",
      name: user.name,
      photoUrl: user.photoUrl,
      address: addressText,
      memberSince: user.memberSince || new Date(),
    });

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${user.membershipId || "id-card"}.pdf"`,
      },
    });
  } catch (error) {
    return fail(error, 403);
  }
}
