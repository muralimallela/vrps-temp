import { NextResponse } from "next/server";
import CommitteeMember from "@/src/models/CommitteeMember";

export async function GET() {
  try {
    const members = await CommitteeMember.find({}, { sort: { order: 1 } });
    return NextResponse.json({
      success: true,
      data: members,
    });
  } catch (error: any) {
    console.error("Error in GET /api/public/committee:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch executive committee members" },
      { status: 500 }
    );
  }
}
