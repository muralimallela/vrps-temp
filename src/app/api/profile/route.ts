import { requireUser } from "@/src/lib/auth";
import { connectDB } from "@/src/lib/mongodb";
import { fail, ok } from "@/src/lib/http";
import { writeAuditLog } from "@/src/lib/audit";

function isValidMobile(value: string) {
  if (!value) return true;
  return /^(\+91)?[6-9]\d{9}$/.test(value.trim());
}

export async function GET() {
  try {
    await connectDB();
    const user = await requireUser();
    return ok(user);
  } catch (error) {
    return fail(error, 401);
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const user = await requireUser();
    const body = await req.json();

    const nextMobile = String(body.mobile ?? user.mobile ?? "").trim();
    if (!isValidMobile(nextMobile)) {
      return fail(
        "Invalid mobile number. Use 10 digits starting with 6-9, optionally prefixed with +91.",
        400
      );
    }

    const before = user.toObject();
    user.name = body.name ?? user.name;
    user.mobile = nextMobile;
    user.email = body.email ?? user.email;
    user.photoUrl = body.photoUrl ?? user.photoUrl;
    await user.save();

    await writeAuditLog({
      entityType: "user",
      entityId: user.userId,
      action: "profile.updated",
      before,
      after: user.toObject(),
      actorUserId: user.userId,
      source: "api",
    });

    return ok(user);
  } catch (error) {
    return fail(error, 400);
  }
}
