import { connectDB } from "@/src/lib/mongodb";
import { requireUser } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import Address from "@/src/models/Address";
import { writeAuditLog } from "@/src/lib/audit";

export async function GET() {
  try {
    await connectDB();
    const user = await requireUser();
    const address = await Address.findOne({ userId: user.userId });
    return ok(address);
  } catch (error) {
    return fail(error, 401);
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const user = await requireUser();
    const body = await req.json();

    const before = await Address.findOne({ userId: user.userId });
    const address = await Address.findOneAndUpdate(
      { userId: user.userId },
      {
        state: body.state ?? "",
        district: body.district ?? "",
        mandal: body.mandal ?? "",
        village: body.village ?? "",
        street: body.street ?? "",
        pincode: body.pincode ?? "",
      },
      { upsert: true, new: true }
    );

    user.addressId = address._id;
    await user.save();

    await writeAuditLog({
      entityType: "address",
      entityId: String(address._id),
      action: "address.updated",
      before: before?.toObject() ?? null,
      after: address.toObject(),
      actorUserId: user.userId,
      source: "api",
    });

    return ok(address);
  } catch (error) {
    return fail(error, 400);
  }
}

