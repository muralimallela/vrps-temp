import { connectDB } from "@/src/lib/mongodb";
import { requireUser } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import { assertMinimumAmount } from "@/src/lib/validation";
import { generateDonationId } from "@/src/lib/ids";
import { getRazorpayClient } from "@/src/lib/razorpay";
import Donation from "@/src/models/Donation";
import { writeAuditLog } from "@/src/lib/audit";

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await requireUser();
    const body = await req.json();
    const donationId = await generateDonationId();
    const razorpay = getRazorpayClient();
    const planId = process.env.RAZORPAY_MONTHLY_PLAN_ID;
    if (!planId) {
      return fail("Missing RAZORPAY_MONTHLY_PLAN_ID", 500);
    }

    const plan = await razorpay.plans.fetch(planId);
    const amount = Number(plan.item.amount) / 100;
    assertMinimumAmount(amount);

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
      total_count: Number(body.totalCount ?? 12),
      notes: { userId: user.userId, donationId },
    });

    const donation = await Donation.create({
      donationId,
      userId: user.userId,
      amount,
      donationType: "monthly",
      paymentStatus: "pending",
      transactionId: "",
      subscriptionId: subscription.id,
    });

    await writeAuditLog({
      entityType: "donation",
      entityId: donationId,
      action: "donation.subscription_created",
      after: donation.toObject(),
      actorUserId: user.userId,
      source: "api",
    });

    return ok({ keyId: process.env.RAZORPAY_KEY_ID ?? "", subscription, donationId, amount });
  } catch (error) {
    return fail(error, 400);
  }
}
