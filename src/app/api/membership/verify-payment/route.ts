import { connectDB } from "@/src/lib/mongodb";
import { requireUser } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import { activateMembershipByOrderId } from "@/src/lib/membershipActivation";

export async function POST(req: Request) {
  try {
    await connectDB();
    await requireUser();

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return fail("Missing payment credentials", 400);
    }

    await activateMembershipByOrderId(razorpay_order_id, razorpay_payment_id);

    return ok({ success: true, message: "Membership activated successfully" });
  } catch (error) {
    return fail(error, 400);
  }
}
