import { NextRequest, NextResponse } from "next/server";
import ConsentRecord from "@/src/models/ConsentRecord";
import { connectDB } from "@/src/lib/mongodb";
import { writeAuditLog } from "@/src/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, email, message, consentGranted } = body;

    if (!firstName || !firstName.trim()) {
      return NextResponse.json({ success: false, error: "First Name is required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json({ success: false, error: "Valid email address is required." }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: "Message content cannot be empty." }, { status: 400 });
    }

    if (!consentGranted) {
      return NextResponse.json(
        {
          success: false,
          error: "You must consent to the processing of your contact information to submit an inquiry.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";
    const userAgent = request.headers.get("user-agent") || "";

    // Record opt-in consent for contact processing
    await ConsentRecord.create({
      userId: `contact_${email.trim().toLowerCase()}`,
      purposeKey: "footer_contact_inquiry",
      status: "granted",
      consentTextVersion: "v1.0-2026-08",
      ipAddress,
      userAgent,
      notes: `Contact inquiry from ${firstName.trim()} (${email.trim()})`,
      grantedAt: new Date(),
    });

    await writeAuditLog({
      entityType: "contact_inquiry",
      entityId: `contact_${Date.now()}`,
      action: "contact.inquiry_received",
      after: {
        firstName: firstName.trim(),
        email: email.trim().toLowerCase(),
        messageLength: message.trim().length,
      },
      actorUserId: `guest_${email.trim()}`,
      source: "api",
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message and consent have been recorded. Our team will get back to you.",
    });
  } catch (error: any) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit message." },
      { status: 500 }
    );
  }
}
