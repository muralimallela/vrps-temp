import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/User";
import Address from "@/src/models/Address";

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Fetch active members who opted for public or anonymous visibility
    const allUsers = await User.find({ isMember: true, isDeleted: false });
    
    const visibleUsers = allUsers.filter((u) => {
      const vis = u.publicVisibility || "public"; // default to public if active member
      return vis === "public" || vis === "anonymous";
    });

    const total = visibleUsers.length;
    const paginatedUsers = visibleUsers.slice(skip, skip + limit);

    // Fetch addresses for location details
    const userIds = paginatedUsers.map((u) => u.userId);
    const addresses = userIds.length > 0 ? await Address.find({ userId: { $in: userIds } }) : [];
    const addressMap = new Map(addresses.map((a) => [a.userId, a]));

    const data = paginatedUsers.map((u) => {
      const isAnon = u.publicVisibility === "anonymous";
      const addr = addressMap.get(u.userId);

      let displayName = "Active Member";
      if (isAnon) {
        displayName = "Anonymous Member";
      } else if (u.publicDisplayName && u.publicDisplayName.trim()) {
        displayName = u.publicDisplayName.trim();
      } else if (u.name) {
        displayName = u.name;
      }

      let formattedId = u.membershipId || u.userId || "-";
      if (isAnon && formattedId !== "-") {
        formattedId = "VRPS****";
      }

      const joinDate = u.memberSince || u.createdAt || new Date().toISOString();

      return {
        _id: u._id || u.$id,
        displayName,
        membershipId: formattedId,
        joinDate,
        city: addr?.village || addr?.mandal || "",
        district: addr?.district || addr?.state || "",
        isAnonymous: isAnon,
        publicVisibility: u.publicVisibility || "public",
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
    console.error("Error fetching public members:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
