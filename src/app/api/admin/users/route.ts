import { connectDB } from "@/src/lib/mongodb";
import { requireAdmin } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import User from "@/src/models/User";
import Address from "@/src/models/Address";
import { rowsToCsvBuffer, rowsToXlsxBuffer } from "@/src/lib/export";

export async function GET(req: Request) {
  try {
    await connectDB();
    await requireAdmin();
    const { searchParams } = new URL(req.url);

    const state = searchParams.get("state");
    const district = searchParams.get("district");
    const mandal = searchParams.get("mandal");
    const village = searchParams.get("village");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const format = searchParams.get("format");

    const userQuery: Record<string, unknown> = { isDeleted: { $ne: true } };
    if (category === "members") userQuery.isMember = true;
    if (category === "non-members") userQuery.isMember = false;
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { userId: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(userQuery).lean();
    const userIds = users.map((user) => user.userId);
    const addressQuery: Record<string, unknown> = { userId: { $in: userIds } };
    if (state) addressQuery.state = state;
    if (district) addressQuery.district = district;
    if (mandal) addressQuery.mandal = mandal;
    if (village) addressQuery.village = village;

    const addresses = await Address.find(addressQuery).lean();
    const addressMap = new Map(addresses.map((item) => [item.userId, item]));

    const filtered = users
      .filter((user) => {
        if (!state && !district && !mandal && !village) return true;
        return addressMap.has(user.userId);
      })
      .map((user) => ({ ...user, address: addressMap.get(user.userId) ?? null }));

    if (format === "csv") {
      const rows = filtered.map((user: any) => ({
        userId: user.userId,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        membershipStatus: user.isMember ? "Member" : "Non-Member",
        state: user.address?.state || "-",
        district: user.address?.district || "-",
        mandal: user.address?.mandal || "-",
        village: user.address?.village || "-",
      }));

      const buffer = rowsToCsvBuffer(rows);
      return new Response(buffer, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="users.csv"',
        },
      });
    }

    if (format === "xlsx") {
      const rows = filtered.map((user: any) => ({
        userId: user.userId,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        membershipStatus: user.isMember ? "Member" : "Non-Member",
        state: user.address?.state || "-",
        district: user.address?.district || "-",
        mandal: user.address?.mandal || "-",
        village: user.address?.village || "-",
      }));

      const buffer = rowsToXlsxBuffer(rows);
      return new Response(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="users.xlsx"',
        },
      });
    }

    return ok(filtered);
  } catch (error) {
    return fail(error, 403);
  }
}

