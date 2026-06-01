import { connectDB } from "@/src/lib/mongodb";
import { requireUser } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import { assertMinimumAmount, isAddressComplete } from "@/src/lib/validation";
import { generateMembershipId } from "@/src/lib/ids";
import { getRazorpayClient } from "@/src/lib/razorpay";
import Membership from "@/src/models/Membership";
import Address from "@/src/models/Address";
import { writeAuditLog } from "@/src/lib/audit";

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await requireUser();
    const body = await req.json();
    const amount = Number(body.amount ?? 99);
    assertMinimumAmount(amount);

    const address = await Address.findOne({ userId: user.userId });
    if (!isAddressComplete(address)) {
      return fail("Complete address is required for membership", 400);
    }

    const membershipId = await generateMembershipId();
    const receipt = `membership_${membershipId}`;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return fail(
        "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.",
        500
      );
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
      notes: { userId: user.userId, membershipId },
    });

    const membership = await Membership.create({
      membershipId,
      userId: user.userId,
      membershipFee: amount,
      status: "pending",
      paymentId: order.id,
    });

    await writeAuditLog({
      entityType: "membership",
      entityId: membershipId,
      action: "membership.pending_created",
      after: membership.toObject(),
      actorUserId: user.userId,
      source: "api",
    });

    return ok({
      keyId: process.env.RAZORPAY_KEY_ID ?? "",
      order,
      membershipId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    if (message === "Unauthorized") {
      return fail("Please sign in first.", 401);
    }
    return fail(error, 400);
  }
}
