import { connectDB } from "@/src/lib/mongodb";
import { requireAdmin } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";
import Donation from "@/src/models/Donation";
import User from "@/src/models/User";
import { rowsToCsvBuffer, rowsToXlsxBuffer } from "@/src/lib/export";

export async function GET(req: Request) {
  try {
    await connectDB();
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const donationType = searchParams.get("donationType");
    const paymentStatus = searchParams.get("paymentStatus");
    const format = searchParams.get("format");

    const query: Record<string, unknown> = {};
    if (donationType) query.donationType = donationType;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    const donations = await Donation.find(query).sort({ createdAt: -1 }).lean();

    const users = await User.find({ userId: { $in: donations.map((d) => d.userId) } }).lean();
    const userMap = new Map(users.map((user) => [user.userId, user]));

    const enrichedDonations = donations.map((donation: any) => ({
      ...donation,
      donorName: userMap.get(donation.userId)?.name || "",
      donorMobile: userMap.get(donation.userId)?.mobile || "",
      donorEmail: userMap.get(donation.userId)?.email || "",
    }));

    if (format === "csv") {
      const rows = enrichedDonations.map((donation: any) => ({
        donationId: donation.donationId,
        donorName: donation.donorName,
        donorMobile: donation.donorMobile,
        donorEmail: donation.donorEmail,
        amount: donation.paymentStatus === "success" ? donation.amount : "",
        donationType: donation.donationType,
        paymentStatus: donation.paymentStatus,
        createdAt: new Date(donation.createdAt).toLocaleDateString("en-IN"),
      }));

      const buffer = rowsToCsvBuffer(rows);
      return new Response(buffer, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="donations.csv"',
        },
      });
    }

    if (format === "xlsx") {
      const rows = enrichedDonations.map((donation: any) => ({
        donationId: donation.donationId,
        donorName: donation.donorName,
        donorMobile: donation.donorMobile,
        donorEmail: donation.donorEmail,
        amount: donation.paymentStatus === "success" ? donation.amount : "",
        donationType: donation.donationType,
        paymentStatus: donation.paymentStatus,
        createdAt: new Date(donation.createdAt).toLocaleDateString("en-IN"),
      }));

      const buffer = rowsToXlsxBuffer(rows);
      return new Response(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="donations.xlsx"',
        },
      });
    }

    return ok(enrichedDonations);
  } catch (error) {
    return fail(error, 403);
  }
}
