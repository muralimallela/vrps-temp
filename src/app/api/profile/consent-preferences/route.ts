import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import User from "@/src/models/User";
import { connectDB } from "@/src/lib/mongodb";

export async function PUT(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      publicVisibility,
      publicDisplayName,
      showMembershipPublically,
      showDonationPublicly,
    } = body;

    // Validate publicVisibility
    if (
      publicVisibility &&
      !["private", "public", "anonymous"].includes(publicVisibility)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid visibility setting" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by Clerk ID
    const user = await User.findOneAndUpdate(
      { clerkUserId },
      {
        ...(publicVisibility && { publicVisibility }),
        ...(publicDisplayName !== undefined && { publicDisplayName }),
        ...(showMembershipPublically !== undefined && {
          showMembershipPublically,
        }),
        ...(showDonationPublicly !== undefined && { showDonationPublicly }),
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Consent preferences updated successfully",
      data: {
        publicVisibility: user.publicVisibility,
        publicDisplayName: user.publicDisplayName,
        showMembershipPublically: user.showMembershipPublically,
        showDonationPublicly: user.showDonationPublicly,
      },
    });
  } catch (error) {
    console.error("Error updating consent preferences:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ clerkUserId }).select(
      "publicVisibility publicDisplayName showMembershipPublically showDonationPublicly"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        publicVisibility: user.publicVisibility,
        publicDisplayName: user.publicDisplayName,
        showMembershipPublically: user.showMembershipPublically,
        showDonationPublicly: user.showDonationPublicly,
      },
    });
  } catch (error) {
    console.error("Error fetching consent preferences:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}
