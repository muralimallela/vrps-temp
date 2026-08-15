import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import DataRightsRequest, { DataRightsRequestType } from "@/src/models/DataRightsRequest";
import User from "@/src/models/User";
import { connectDB } from "@/src/lib/mongodb";
import { writeAuditLog } from "@/src/lib/audit";

const VALID_REQUEST_TYPES: DataRightsRequestType[] = [
  "access",
  "correction",
  "erasure",
  "withdrawal",
  "nomination",
  "grievance",
];

function generateTrackingId(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VRPS-DRR-${datePart}-${randomPart}`;
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    const body = await request.json();
    const {
      name,
      email,
      phone,
      membershipId,
      requestType,
      details,
      correctionData,
      nomineeDetails,
    } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Full Name is required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json({ success: false, error: "A valid email address is required." }, { status: 400 });
    }

    if (!requestType || !VALID_REQUEST_TYPES.includes(requestType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid request type. Must be one of: ${VALID_REQUEST_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!details || details.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Please provide detailed instructions (at least 10 characters)." },
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

    const requestId = generateTrackingId();
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";
    const userAgent = request.headers.get("user-agent") || "";

    const doc = await DataRightsRequest.create({
      requestId,
      userId: appUserId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      membershipId: membershipId?.trim() || "",
      requestType,
      status: "submitted",
      details: details.trim(),
      correctionData: typeof correctionData === "object" ? JSON.stringify(correctionData) : correctionData || "",
      nomineeDetails: typeof nomineeDetails === "object" ? JSON.stringify(nomineeDetails) : nomineeDetails || "",
      ipAddress,
      userAgent,
      requestedAt: new Date().toISOString(),
    });

    await writeAuditLog({
      entityType: "data_rights_request",
      entityId: requestId,
      action: `data_rights.${requestType}_submitted`,
      after: {
        requestId,
        userId: appUserId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        requestType,
        status: "submitted",
      },
      actorUserId: appUserId,
      source: "api",
    });

    return NextResponse.json({
      success: true,
      message:
        "Your data protection request has been received. Our Data Protection & Grievance Officer will review and respond within 30 days as mandated under the DPDP Act 2023.",
      data: {
        requestId,
        requestType,
        status: "submitted",
        slaDays: 30,
        grievanceEmail: "vaddera@gmail.com",
        submittedAt: doc.requestedAt,
      },
    });
  } catch (error: any) {
    console.error("Error submitting data rights request:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestId");
    const email = searchParams.get("email");
    const { userId: clerkUserId } = await auth();

    await connectDB();

    // Query by specific requestId + email for public lookups
    if (requestId && email) {
      const doc = await DataRightsRequest.findOne({
        requestId: requestId.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
      });

      if (!doc) {
        return NextResponse.json(
          { success: false, error: "No matching request found for provided Request ID and Email." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          requestId: doc.requestId,
          requestType: doc.requestType,
          status: doc.status,
          requestedAt: doc.requestedAt,
          resolvedAt: doc.resolvedAt,
          resolutionNotes: doc.resolutionNotes || "Request is under review by the Grievance Officer.",
        },
      });
    }

    // Otherwise require authentication
    if (!clerkUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const requests = await DataRightsRequest.find({ userId: user.userId }, { limit: 50 });

    return NextResponse.json({
      success: true,
      data: requests,
    });
  } catch (error: any) {
    console.error("Error querying data rights request:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to query request" },
      { status: 500 }
    );
  }
}
