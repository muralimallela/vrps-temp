import { connectDB } from "@/src/lib/mongodb";
import { fail, ok } from "@/src/lib/http";
import { verifyRazorpayWebhookSignature } from "@/src/lib/razorpay";
import Membership from "@/src/models/Membership";
import Donation from "@/src/models/Donation";
import User from "@/src/models/User";
import { writeAuditLog } from "@/src/lib/audit";
import { generateMembershipId } from "@/src/lib/ids";

type RazorpayEvent = {
  event: string;
  payload: {
    payment?: { entity?: { id?: string; order_id?: string; subscription_id?: string } };
    subscription?: { entity?: { id?: string; status?: string } };
  };
};

export async function activateMembershipByOrderId(orderId: string, paymentId: string) {
  const membership = await Membership.findOne({ paymentId: orderId });
  if (!membership) return;
  const before = membership.toObject();

  // Only generate official Member ID on successful payment!
  if (!membership.membershipId || membership.membershipId.startsWith("PENDING")) {
    membership.membershipId = await generateMembershipId();
  }

  membership.status = "active";
  membership.startDate = new Date();
  await membership.save();

  const user = await User.findOne({ userId: membership.userId });
  if (user) {
    user.isMember = true;
    user.memberSince = membership.startDate;
    user.membershipId = membership.membershipId;
    await user.save();
  }

  await writeAuditLog({
    entityType: "membership",
    entityId: membership.membershipId,
    action: "membership.activated",
    before,
    after: membership.toObject(),
    actorUserId: membership.userId,
    source: "webhook",
  });

  const donation = await Donation.findOne({ transactionId: orderId });
  if (donation) {
    const donationBefore = donation.toObject();
    donation.paymentStatus = "success";
    donation.transactionId = paymentId;
    await donation.save();
    await writeAuditLog({
      entityType: "donation",
      entityId: donation.donationId,
      action: "donation.success",
      before: donationBefore,
      after: donation.toObject(),
      actorUserId: donation.userId,
      source: "webhook",
    });
  }
}

async function updateDonation(orderId: string, paymentId: string) {
  const donation = await Donation.findOne({ transactionId: orderId });
  if (!donation) return;
  const before = donation.toObject();
  donation.paymentStatus = "success";
  donation.transactionId = paymentId;
  await donation.save();
  await writeAuditLog({
    entityType: "donation",
    entityId: donation.donationId,
    action: "donation.success",
    before,
    after: donation.toObject(),
    actorUserId: donation.userId,
    source: "webhook",
  });
}

async function updateSubscription(subscriptionId: string, status: string) {
  const donation = await Donation.findOne({ subscriptionId });
  if (!donation) return;
  const before = donation.toObject();
  donation.paymentStatus = status === "active" ? "success" : "pending";
  await donation.save();
  await writeAuditLog({
    entityType: "donation",
    entityId: donation.donationId,
    action: "donation.subscription_updated",
    before,
    after: donation.toObject(),
    actorUserId: donation.userId,
    source: "webhook",
  });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const payloadText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature || !verifyRazorpayWebhookSignature(payloadText, signature)) {
      return fail("Invalid signature", 401);
    }

    const event = JSON.parse(payloadText) as RazorpayEvent;
    const payment = event.payload.payment?.entity;
    const subscription = event.payload.subscription?.entity;

    if (event.event === "payment.captured" && payment?.order_id && payment.id) {
      await activateMembershipByOrderId(payment.order_id, payment.id);
      await updateDonation(payment.order_id, payment.id);
    }

    if (event.event.startsWith("subscription.") && subscription?.id && subscription.status) {
      await updateSubscription(subscription.id, subscription.status);
    }

    return ok({ received: true });
  } catch (error) {
    return fail(error, 500);
  }
}
