import { connectDB } from "@/src/lib/mongodb";
import { requireAdmin } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import Membership from "@/src/models/Membership";
import User from "@/src/models/User";
import { rowsToCsvBuffer, rowsToXlsxBuffer } from "@/src/lib/export";

export async function GET(req: Request) {
  try {
    await connectDB();
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const format = searchParams.get("format");

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    const memberships = await Membership.find(query).sort({ createdAt: -1 }).lean();
    const users = await User.find({ userId: { $in: memberships.map((m) => m.userId) } }).lean();
    const userMap = new Map(users.map((user) => [user.userId, user]));

    const rows = memberships.map((membership) => ({
      membershipId: membership.membershipId,
      userId: membership.userId,
      name: userMap.get(membership.userId)?.name ?? "",
      mobile: userMap.get(membership.userId)?.mobile ?? "",
      email: userMap.get(membership.userId)?.email ?? "",
      membershipFee:
        membership.status === "active" ? membership.membershipFee : null,
      status: membership.status,
      startDate: membership.startDate,
      createdAt: membership.createdAt,
    }));

    if (format === "csv") {
      const buffer = rowsToCsvBuffer(rows);
      return new Response(buffer, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="memberships.csv"',
        },
      });
    }

    if (format === "xlsx") {
      const buffer = rowsToXlsxBuffer(rows);
      return new Response(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="memberships.xlsx"',
        },
      });
    }

    return ok(rows);
  } catch (error) {
    return fail(error, 403);
  }
}
