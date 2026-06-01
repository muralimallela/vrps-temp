import { NextRequest, NextResponse } from "next/server";
import Donation from "@/src/models/Donation";
import User from "@/src/models/User";
import { connectDB } from "@/src/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Get public donations from users who consented
    const donations = await Donation.aggregate([
      {
        $match: {
          paymentStatus: "success",
          showDonationPublicly: true,
          publicVisibility: { $in: ["public", "anonymous"] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.isDeleted": false,
        },
      },
      {
        $project: {
          _id: 1,
          displayName: {
            $cond: [
              { $eq: ["$publicVisibility", "anonymous"] },
              "Anonymous Supporter",
              { $ifNull: ["$publicDisplayName", "$user.name"] },
            ],
          },
          amount: 1,
          donationType: 1,
          supporterMessage: {
            $cond: [
              { $eq: ["$publicVisibility", "anonymous"] },
              null,
              "$supporterMessage",
            ],
          },
          donationDate: {
            $dateToString: {
              format: "%B %d, %Y",
              date: "$createdAt",
            },
          },
          createdAt: 1,
          publicVisibility: 1,
          isAnonymous: { $eq: ["$publicVisibility", "anonymous"] },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const total = await Donation.countDocuments({
      paymentStatus: "success",
      showDonationPublicly: true,
      publicVisibility: { $in: ["public", "anonymous"] },
    });

    return NextResponse.json({
      success: true,
      data: donations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching public donations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}
