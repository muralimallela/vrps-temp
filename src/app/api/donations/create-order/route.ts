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
    const amount = Number(body.amount ?? 99);
    assertMinimumAmount(amount);

    const donationId = await generateDonationId();
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `donation_${donationId}`,
      notes: { userId: user.userId, donationId },
    });

    const donation = await Donation.create({
      donationId,
      userId: user.userId,
      amount,
      donationType: "one_time",
      paymentStatus: "pending",
      transactionId: order.id,
    });

    await writeAuditLog({
      entityType: "donation",
      entityId: donationId,
      action: "donation.pending_created",
      after: donation.toObject(),
      actorUserId: user.userId,
      source: "api",
    });

    return ok({ keyId: process.env.RAZORPAY_KEY_ID ?? "", order, donationId });
  } catch (error) {
    return fail(error, 400);
  }
}

