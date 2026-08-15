import { connectDB } from "@/src/lib/mongodb";
import { requireUser } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import Donation from "@/src/models/Donation";

export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 20);

    const [items, total] = await Promise.all([
      Donation.find({ userId: user.userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      Donation.countDocuments({ userId: user.userId }),
    ]);

    return ok({ items, total, page, pageSize });
  } catch (error) {
    return fail(error, 401);
  }
}

