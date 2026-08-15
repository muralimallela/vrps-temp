import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/User";
import Donation from "@/src/models/Donation";
import { connectDB } from "@/src/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get statistics
    const [
      totalMembers,
      activeSupport,
      totalDonations,
      monthlyMembers,
      monthlyDonations,
    ] = await Promise.all([
      // Total active members
      User.countDocuments({
        isMember: true,
        isDeleted: false,
      }),

      // Total unique donors
      Donation.aggregate([
        {
          $match: {
            paymentStatus: "success",
          },
        },
        {
          $group: {
            _id: "$userId",
          },
        },
        {
          $count: "count",
        },
      ]),

      // Total donation amount
      Donation.aggregate([
        {
          $match: {
            paymentStatus: "success",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),

      // New members this month
      User.countDocuments({
        isMember: true,
        memberSince: {
          $gte: currentMonth,
          $lt: new Date(currentMonth.getTime() + 31 * 24 * 60 * 60 * 1000),
        },
        isDeleted: false,
      }),

      // Total donations this month
      Donation.aggregate([
        {
          $match: {
            paymentStatus: "success",
            createdAt: {
              $gte: currentMonth,
              $lt: new Date(
                currentMonth.getTime() + 31 * 24 * 60 * 60 * 1000
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalMembers,
        totalSupporters: activeSupport[0]?.count || 0,
        totalDonationAmount: totalDonations[0]?.total || 0,
        newMembersThisMonth: monthlyMembers,
        monthlyDonationAmount: monthlyDonations[0]?.total || 0,
        monthlyDonationCount: monthlyDonations[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching community statistics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
