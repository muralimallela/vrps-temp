import { NextRequest, NextResponse } from "next/server";
import Donation from "@/src/models/Donation";
import User from "@/src/models/User";

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const allDonations = await Donation.find({ paymentStatus: "success" });
    
    const visibleDonations = allDonations.filter((d) => {
      const vis = d.publicVisibility || "public";
      return vis === "public" || vis === "anonymous";
    });

    const userIds = [...new Set(visibleDonations.map((d) => d.userId))];
    const users = userIds.length > 0 ? await User.find({ userId: { $in: userIds } }) : [];
    const userMap = new Map(users.map((u) => [u.userId, u]));

    const validDonations = visibleDonations.filter((d) => {
      const u = userMap.get(d.userId);
      return u && !u.isDeleted;
    });

    const total = validDonations.length;
    const paginated = validDonations.slice(skip, skip + limit);

    const data = paginated.map((d) => {
      const u = userMap.get(d.userId);
      const isAnon = d.publicVisibility === "anonymous";

      let displayName = "Generous Supporter";
      if (isAnon) {
        displayName = "Anonymous Supporter";
      } else if (d.publicDisplayName && d.publicDisplayName.trim()) {
        displayName = d.publicDisplayName.trim();
      } else if (u?.name) {
        displayName = u.name;
      }

      return {
        _id: d._id || d.$id,
        displayName,
        amount: d.amount,
        donationType: d.donationType || "one_time",
        supporterMessage: isAnon ? null : (d.supporterMessage || null),
        donationDate: d.createdAt || new Date().toISOString(),
        createdAt: d.createdAt || new Date().toISOString(),
        publicVisibility: d.publicVisibility || "public",
        isAnonymous: isAnon,
      };
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
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
