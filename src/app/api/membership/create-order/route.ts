import { connectDB } from "@/src/lib/mongodb";
import { requireUser } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import { assertMinimumAmount, isAddressComplete } from "@/src/lib/validation";
import { getRazorpayClient } from "@/src/lib/razorpay";
import Membership from "@/src/models/Membership";
import Address from "@/src/models/Address";
import { writeAuditLog } from "@/src/lib/audit";

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await requireUser();

    if (user.isMember) {
      return fail("You are already an active VRPS member.", 400);
    }

    const activeMembership = await Membership.findOne({ userId: user.userId, status: "active" });
    if (activeMembership) {
      return fail("You are already an active VRPS member.", 400);
    }

    const body = await req.json();
    const amount = Number(body.amount ?? 99);
    assertMinimumAmount(amount);

    const publicVisibility = body.publicVisibility || "public";
    const publicDisplayName = body.publicDisplayName || "";
    const showMembershipPublically = publicVisibility !== "private";

    // Update user consent preferences immediately
    user.publicVisibility = publicVisibility;
    user.publicDisplayName = publicDisplayName;
    user.showMembershipPublically = showMembershipPublically;
    await user.save();

    const address = await Address.findOne({ userId: user.userId });
    if (!isAddressComplete(address)) {
      return fail("Complete address is required for membership", 400);
    }

    // Temporary pending ID ref (Real Member ID will only generate on successful payment)
    const tempMembershipId = `PENDING_${user.userId}_${Date.now().toString().slice(-4)}`;
    const receipt = `mem_ord_${Date.now()}`;

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
      notes: { userId: user.userId },
    });

    const membership = await Membership.create({
      membershipId: tempMembershipId,
      userId: user.userId,
      membershipFee: amount,
      status: "pending",
      paymentId: order.id,
    });

    await writeAuditLog({
      entityType: "membership",
      entityId: tempMembershipId,
      action: "membership.pending_created",
      after: membership.toObject(),
      actorUserId: user.userId,
      source: "api",
    });

    return ok({
      keyId: process.env.RAZORPAY_KEY_ID ?? "",
      order,
    });
  } catch (error) {
    const message = typeof error === "string" ? error : (error as any)?.message || "Request failed";
    if (message === "Unauthorized") {
      return fail("Please sign in first.", 401);
    }
    return fail(error, 400);
  }
}
