"use client";

import { useEffect, useState } from "react";
import StatSection from "@/src/components/admin/StatSection";
import TrendChart from "@/src/components/admin/TrendChart";
import LogoLoader from "@/src/components/loading/LogoLoader";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineCreditCard,
  HiOutlineHeart,
  HiOutlineShieldCheck,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineUserMinus,
  HiOutlineUsers,
} from "react-icons/hi2";

type Dashboard = {
  userDashboard: Record<string, number>;
  membershipDashboard: Record<string, number>;
  donationDashboard: Record<string, unknown>;
};

type TrendData = {
  _id: {
    year: number;
    month: number;
  };
  total: number;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const body = await res.json();
        if (body.success) setData(body.data);
        else setError(body.error || "Forbidden");
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return <LogoLoader message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="flex items-center justify-center h-96">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md text-center shadow-sm">
            <p className="text-slate-800 font-semibold">⚠️ {error}</p>
            <p className="text-slate-500 text-sm mt-2">
              Please ensure you have admin access to view this dashboard.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const userStats = [
    {
      title: "Total Users",
      value: data.userDashboard.totalUsers,
      icon: <HiOutlineUsers />,
      accent: "blue" as const,
    },
    {
      title: "Active Members",
      value: data.userDashboard.membersCount,
      icon: <HiOutlineShieldCheck />,
      accent: "teal" as const,
    },
    {
      title: "Non-Members",
      value: data.userDashboard.nonMembersCount,
      icon: <HiOutlineUserMinus />,
      accent: "amber" as const,
    },
    {
      title: "New This Month",
      value: data.userDashboard.newUsersThisMonth,
      icon: <HiOutlineArrowTrendingUp />,
      accent: "maroon" as const,
    },
    {
      title: "Soft Deleted",
      value: data.userDashboard.softDeletedUsersCount,
      icon: <HiOutlineTrash />,
      accent: "slate" as const,
    },
    {
      title: "Deleted This Month",
      value: data.userDashboard.softDeletedThisMonth,
      icon: <HiOutlineCalendarDays />,
      accent: "rose" as const,
    },
  ];

  const membershipStats = [
    {
      title: "Active Memberships",
      value: data.membershipDashboard.activeMemberships,
      icon: <HiOutlineCreditCard />,
      accent: "teal" as const,
    },
    {
      title: "New Memberships",
      value: data.membershipDashboard.newMemberships,
      icon: <HiOutlineShieldCheck />,
      accent: "blue" as const,
    },
    {
      title: "Revenue Collected",
      icon: <HiOutlineBanknotes />,
      accent: "amber" as const,
      value: `₹${data.membershipDashboard.totalMembershipRevenue?.toLocaleString() || 0}`,
    },
  ];

  const donationDashboard = data.donationDashboard as {
    totalDonations: number;
    monthlyDonations: number;
    recurringDonations: number;
    donationGrowthTrends: TrendData[];
  };

  const donationStats = [
    {
      title: "Total Collected",
      icon: <HiOutlineHeart />,
      accent: "rose" as const,
      value: `₹${donationDashboard.totalDonations?.toLocaleString() || 0}`,
    },
    {
      title: "Collected This Month",
      icon: <HiOutlineCalendarDays />,
      accent: "teal" as const,
      value: `₹${donationDashboard.monthlyDonations?.toLocaleString() || 0}`,
    },
    {
      title: "Recurring Donors",
      value: donationDashboard.recurringDonations,
      icon: <HiOutlineArrowTrendingUp />,
      accent: "blue" as const,
    },
  ];

  return (
    <main className="min-h-screen bg-[#fbf7f1]">
      <div className="p-6 md:p-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-[#ead9c2] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0F5F54]">Overview</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#36100B] md:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-[#7A6258]">
            Overview of users, memberships, and donations
          </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#E4F5F1] px-3 py-2 text-xs font-bold text-[#0F5F54]">
            <HiOutlineUserGroup className="h-5 w-5" />
            Live community overview
          </div>
        </div>

        {/* User Statistics */}
        <StatSection
          title="User Management"
          description="Track user growth, membership status, and account activity"
          stats={userStats}
        />

        {/* Membership Statistics */}
        <StatSection
          title="Membership Overview"
          description="Monitor active memberships and revenue"
          stats={membershipStats}
        />

        {/* Donation Statistics */}
        <StatSection
          title="Donation Analytics"
          description="Track donation performance and donor engagement"
          stats={donationStats}
        />

        {/* Trends Chart */}
        {donationDashboard.donationGrowthTrends &&
          donationDashboard.donationGrowthTrends.length > 0 && (
            <div className="mb-8">
              <TrendChart
                title="Donation Growth Trends"
                data={donationDashboard.donationGrowthTrends}
              />
            </div>
          )}
      </div>
    </main>
  );
}
