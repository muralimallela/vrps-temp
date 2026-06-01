import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/User";
import Membership from "@/src/models/Membership";
import { connectDB } from "@/src/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Get public members who have opted in for visibility
    const members = await User.aggregate([
      {
        $match: {
          isMember: true,
          showMembershipPublically: true,
          publicVisibility: { $in: ["public", "anonymous"] },
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "memberships",
          localField: "membershipId",
          foreignField: "membershipId",
          as: "membership",
        },
      },
      {
        $unwind: { path: "$membership", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "addressId",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $unwind: { path: "$address", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          displayName: {
            $cond: [
              { $eq: ["$publicVisibility", "anonymous"] },
              "Anonymous",
              {
                $concat: [
                  { $substr: ["$name", 0, 1] },
                  ". ",
                  {
                    $substr: [
                      { $arrayElemAt: [{ $split: ["$name", " "] }, -1] },
                      0,
                      1,
                    ],
                  },
                ],
              },
            ],
          },
          membershipId: {
            $cond: [
              { $eq: ["$publicVisibility", "anonymous"] },
              null,
              {
                $concat: [
                  { $substr: ["$membershipId", 0, 8] },
                  "****",
                ],
              },
            ],
          },
          joinDate: {
            $dateToString: {
              format: "%B %Y",
              date: { $ifNull: ["$memberSince", "$membership.startDate"] },
            },
          },
          city: "$address.city",
          district: "$address.district",
          memberSince: { $ifNull: ["$memberSince", "$membership.startDate"] },
          publicVisibility: 1,
          isAnonymous: { $eq: ["$publicVisibility", "anonymous"] },
        },
      },
      {
        $sort: { memberSince: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const total = await User.countDocuments({
      isMember: true,
      showMembershipPublically: true,
      publicVisibility: { $in: ["public", "anonymous"] },
      isDeleted: false,
    });

    return NextResponse.json({
      success: true,
      data: members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching public members:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
