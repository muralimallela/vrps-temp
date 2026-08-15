import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ConsentRecord from "@/src/models/ConsentRecord";
import User from "@/src/models/User";
import { connectDB } from "@/src/lib/mongodb";
import { writeAuditLog } from "@/src/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    const body = await request.json();
    const { purposeKey, status, consentTextVersion, notes } = body;

    if (!purposeKey || !["granted", "withdrawn"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid purposeKey or status ('granted' | 'withdrawn' required)" },
        { status: 400 }
      );
    }

    await connectDB();

    let appUserId = "anonymous";
    if (clerkUserId) {
      const user = await User.findOne({ clerkUserId });
      if (user) {
        appUserId = user.userId;
      }
    }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";
    const userAgent = request.headers.get("user-agent") || "";

    const record = await ConsentRecord.create({
      userId: appUserId,
      purposeKey,
      status,
      consentTextVersion: consentTextVersion || "v1.0-2026-08",
      ipAddress,
      userAgent,
      notes: notes || `Consent ${status} for ${purposeKey}`,
      grantedAt: status === "granted" ? new Date() : null,
      withdrawnAt: status === "withdrawn" ? new Date() : null,
    });

    // Write audit log for consent modification
    await writeAuditLog({
      entityType: "consent_record",
      entityId: record.consentId || record.$id || record._id,
      action: `consent.${status}`,
      after: {
        userId: appUserId,
        purposeKey,
        status,
        consentTextVersion: record.consentTextVersion,
      },
      actorUserId: appUserId,
      source: "api",
    });

    return NextResponse.json({
      success: true,
      data: {
        consentId: record.consentId || record.$id,
        userId: appUserId,
        purposeKey,
        status,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error recording consent:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to record consent" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const records = await ConsentRecord.find({ userId: user.userId }, { limit: 50 });

    return NextResponse.json({
      success: true,
      data: records,
    });
  } catch (error: any) {
    console.error("Error fetching consent records:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch consent records" },
      { status: 500 }
    );
  }
}
