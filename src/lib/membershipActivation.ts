import Membership from "@/src/models/Membership";
import Donation from "@/src/models/Donation";
import User from "@/src/models/User";
import { writeAuditLog } from "@/src/lib/audit";
import { generateMembershipId } from "@/src/lib/ids";

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
    if (!user.publicVisibility) user.publicVisibility = "public";
    user.showMembershipPublically = user.publicVisibility !== "private";
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
