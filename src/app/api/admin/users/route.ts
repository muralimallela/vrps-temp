import { connectDB } from "@/src/lib/mongodb";
import { requireAdmin } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import User from "@/src/models/User";
import Address from "@/src/models/Address";
import { rowsToCsvBuffer, rowsToXlsxBuffer } from "@/src/lib/export";

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

    // Build optimized Address filter first if location parameters exist
    let allowedUserIds: string[] | null = null;
    if (state || district || mandal || village) {
      const addressQuery: Record<string, unknown> = {};
      if (state) addressQuery.state = state;
      if (district) addressQuery.district = district;
      if (mandal) addressQuery.mandal = mandal;
      if (village) addressQuery.village = village;

      const matchingAddresses = await Address.find(addressQuery).select("userId").lean();
      allowedUserIds = matchingAddresses.map((a) => a.userId);
    }

    // Build User query
    const userQuery: Record<string, unknown> = { isDeleted: { $ne: true } };
    if (category === "members") userQuery.isMember = true;
    if (category === "non-members") userQuery.isMember = false;
    if (allowedUserIds !== null) {
      userQuery.userId = { $in: allowedUserIds };
    }

    if (search && search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      const searchRegex = new RegExp(safeSearch, "i");

      // Also search addresses matching search term if user search is performed
      const matchingAddr = await Address.find({
        $or: [
          { state: searchRegex },
          { district: searchRegex },
          { mandal: searchRegex },
          { village: searchRegex },
        ],
      }).select("userId").lean();

      const addrUserIds = matchingAddr.map((a) => a.userId);

      userQuery.$or = [
        { name: searchRegex },
        { userId: searchRegex },
        { membershipId: searchRegex },
        { mobile: searchRegex },
        { email: searchRegex },
        { userId: { $in: addrUserIds } },
      ];
    }

    // Fetch matching users efficiently
    const users = await User.find(userQuery).lean();
    const userIds = users.map((user) => user.userId);

    // Fetch addresses for matched users
    const addresses = userIds.length > 0 
      ? await Address.find({ userId: { $in: userIds } }).lean() 
      : [];
    const addressMap = new Map(addresses.map((item) => [item.userId, item]));

    const filtered = users.map((user) => ({
      ...user,
      address: addressMap.get(user.userId) ?? null,
    }));

    if (format === "csv") {
      const rows = filtered.map((user: any) => ({
        userId: user.userId,
        membershipId: user.membershipId || "-",
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
        membershipId: user.membershipId || "-",
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
