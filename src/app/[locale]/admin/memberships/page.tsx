"use client";

import { useEffect, useState, useCallback } from "react";
import DataTable from "@/src/components/admin/DataTable";
import { HiOutlineCreditCard, HiOutlineShieldCheck, HiOutlineBanknotes, HiOutlineArrowDownTray } from "react-icons/hi2";

interface MembershipData {
  _id: string;
  membershipId: string;
  userId: string;
  name: string;
  mobile: string;
  email: string;
  membershipFee: number | null;
  status: string;
  startDate: string;
  createdAt: string;
}

export default function AdminMembershipsPage() {
  const [memberships, setMemberships] = useState<MembershipData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const loadMemberships = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await fetch(`/api/admin/memberships?${params.toString()}`);
      const body = await res.json();
      if (body.success) {
        setMemberships(body.data);
      }
    } catch (error) {
      console.error("Failed to load memberships:", error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadMemberships();
  }, [statusFilter, loadMemberships]);

  const handleExport = async (format: "csv" | "xlsx") => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.append("status", statusFilter);
    params.append("format", format);

    window.location.href = `/api/admin/memberships?${params.toString()}`;
  };

  const columns = [
    { key: "membershipId" as const, label: "Membership ID", width: "140px" },
    { key: "userId" as const, label: "User ID", width: "120px" },
    { key: "name" as const, label: "Member Name" },
    {
      key: "mobile" as const,
      label: "Mobile",
      render: (value: string) => value || "-",
    },
    {
      key: "membershipFee" as const,
      label: "Fee",
      render: (_value: number | null, row: MembershipData) =>
        row.status === "active" && row.membershipFee
          ? `₹${row.membershipFee.toLocaleString()}`
          : "—",
    },
    {
      key: "status" as const,
      label: "Status",
      render: (value: string) => (
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
            value === "active"
              ? "bg-[#e8f5e9] text-[#2e7d32] border border-emerald-200"
              : value === "expired"
                ? "bg-slate-100 text-slate-700 border border-slate-200"
                : value === "suspended"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "bg-[#fff3e5] text-[#d32f2f] border border-amber-200"
          }`}
        >
          {value === "active"
            ? "✓ Active"
            : value === "expired"
              ? "Expired"
              : value === "suspended"
                ? "Suspended"
                : "Pending"}
        </span>
      ),
    },
    {
      key: "startDate" as const,
      label: "Start Date",
      render: (value: string) => new Date(value).toLocaleDateString("en-IN"),
    },
  ];

  const activeMemberships = memberships.filter((m) => m.status === "active");
  const stats = {
    total: memberships.length,
    active: activeMemberships.length,
    inactive: memberships.filter((m) => m.status !== "active").length,
    revenue: activeMemberships.reduce(
      (sum, m) => sum + (m.membershipFee ?? 0),
      0,
    ),
  };

  return (
    <main className="min-h-screen bg-[#fbf7f1] p-6 md:p-10">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#ead9c2] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#0F5F54]">Memberships</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#36100B]">
            Membership Records
          </h1>
          <p className="mt-1 text-sm text-[#7A6258]">
            Monitor active memberships, status activations, and fee collections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("csv")}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#6A160A] hover:bg-[#521006] text-white font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-50"
          >
            <HiOutlineArrowDownTray className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={() => handleExport("xlsx")}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0F5F54] hover:bg-[#0D4A42] text-white font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-50"
          >
            <HiOutlineArrowDownTray className="h-4 w-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-[#ead9c2] bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A6258]">Total Records</p>
            <p className="text-3xl font-black text-[#36100B] mt-1">{stats.total}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#fff3e5] flex items-center justify-center text-[#6A160A] text-2xl">
            <HiOutlineCreditCard />
          </div>
        </div>

        <div className="rounded-2xl border border-[#ead9c2] bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A6258]">Active Members</p>
            <p className="text-3xl font-black text-[#0F5F54] mt-1">{stats.active}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#e8f5e9] flex items-center justify-center text-[#0F5F54] text-2xl">
            <HiOutlineShieldCheck />
          </div>
        </div>

        <div className="rounded-2xl border border-[#ead9c2] bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A6258]">Inactive / Pending</p>
            <p className="text-3xl font-black text-[#d32f2f] mt-1">{stats.inactive}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 text-2xl">
            <HiOutlineCreditCard />
          </div>
        </div>

        <div className="rounded-2xl border border-[#ead9c2] bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A6258]">Fees Revenue</p>
            <p className="text-3xl font-black text-[#6A160A] mt-1">₹{stats.revenue.toLocaleString()}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#fff3e5] flex items-center justify-center text-[#6A160A] text-2xl">
            <HiOutlineBanknotes />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-[#ead9c2] bg-[#fffdf7] p-5 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold uppercase tracking-wider text-[#5A1C16] shrink-0">
            Filter Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={isLoading}
            className="w-full sm:w-64 px-3 py-2 border border-[#dcc9a8] rounded-xl text-xs font-bold text-[#36100B] focus:outline-none focus:ring-2 focus:ring-[#0F5F54] bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable<MembershipData>
        columns={columns}
        data={memberships}
        isLoading={isLoading}
        emptyMessage="No memberships found"
      />
    </main>
  );
}
