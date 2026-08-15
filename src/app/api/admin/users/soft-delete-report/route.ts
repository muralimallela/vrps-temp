import { connectDB } from "@/src/lib/mongodb";
import { requireAdmin } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import User from "@/src/models/User";

function getMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function GET() {
  try {
    await connectDB();
    await requireAdmin();

    const monthStart = getMonthStart();
    const [softDeletedUsersCount, softDeletedThisMonth] = await Promise.all([
      User.countDocuments({ isDeleted: true }),
      User.countDocuments({ isDeleted: true, deletedAt: { $gte: monthStart } }),
    ]);

    return ok({
      softDeletedUsersCount,
      softDeletedThisMonth,
    });
  } catch (error) {
    return fail(error, 403);
  }
}

