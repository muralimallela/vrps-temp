import { connectDB } from "@/src/lib/mongodb";
import { requireAdmin } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import User from "@/src/models/User";
import Membership from "@/src/models/Membership";
import Donation from "@/src/models/Donation";

function getMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function GET() {
  try {
    await connectDB();
    await requireAdmin();

    const monthStart = getMonthStart();
    const [totalUsers, membersCount, nonMembersCount, newUsersThisMonth, softDeletedUsersCount, softDeletedThisMonth] =
      await Promise.all([
        User.countDocuments({ isDeleted: { $ne: true } }),
        User.countDocuments({ isMember: true }),
        User.countDocuments({ isMember: false, isDeleted: { $ne: true } }),
        User.countDocuments({ createdAt: { $gte: monthStart }, isDeleted: { $ne: true } }),
        User.countDocuments({ isDeleted: true }),
        User.countDocuments({ isDeleted: true, deletedAt: { $gte: monthStart } }),
      ]);

    const [newMemberships, totalMembershipRevenue, activeMemberships] =
      await Promise.all([
        Membership.countDocuments({
          createdAt: { $gte: monthStart },
          status: "active",
        }),
        Membership.aggregate([
          { $match: { status: "active" } },
          { $group: { _id: null, total: { $sum: "$membershipFee" } } },
        ]),
        Membership.countDocuments({ status: "active" }),
      ]);

    const donationStats = await Donation.aggregate([
      { $match: { paymentStatus: "success" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          recurringCount: {
            $sum: { $cond: [{ $eq: ["$donationType", "monthly"] }, 1, 0] },
          },
        },
      },
    ]);

    const monthlyDonationStats = await Donation.aggregate([
      { $match: { createdAt: { $gte: monthStart }, paymentStatus: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const donationGrowthTrends = await Donation.aggregate([
      { $match: { paymentStatus: "success" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return ok({
      userDashboard: {
        totalUsers,
        activeUsers: totalUsers,
        monthlyActiveUsers: totalUsers,
        newUsersThisMonth,
        membersCount,
        nonMembersCount,
        softDeletedUsersCount,
        softDeletedThisMonth,
      },
      membershipDashboard: {
        newMemberships,
        totalMembershipRevenue: totalMembershipRevenue[0]?.total ?? 0,
        activeMemberships,
      },
      donationDashboard: {
        totalDonations: donationStats[0]?.total ?? 0,
        monthlyDonations: monthlyDonationStats[0]?.total ?? 0,
        recurringDonations: donationStats[0]?.recurringCount ?? 0,
        donationGrowthTrends,
      },
    });
  } catch (error) {
    return fail(error, 403);
  }
}
