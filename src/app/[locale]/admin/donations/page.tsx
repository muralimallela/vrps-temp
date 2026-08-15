"use client";

import { useEffect, useState, useCallback } from "react";
import DataTable from "@/src/components/admin/DataTable";
import { HiOutlineHeart, HiOutlineBanknotes, HiOutlineArrowTrendingUp, HiOutlineArrowDownTray } from "react-icons/hi2";

interface DonationData {
  _id: string;
  donationId: string;
  userId: string;
  donorName: string;
  donorMobile: string;
  amount: number;
  donationType: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("success");

  const loadDonations = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("donationType", typeFilter);
      if (statusFilter !== "all") params.append("paymentStatus", statusFilter);

      const res = await fetch(`/api/admin/donations?${params.toString()}`);
      const body = await res.json();
      if (body.success) {
        setDonations(body.data);
      }
    } catch (error) {
      console.error("Failed to load donations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    loadDonations();
  }, [typeFilter, statusFilter, loadDonations]);

  const handleExport = async (format: "csv" | "xlsx") => {
    const params = new URLSearchParams();
    if (typeFilter !== "all") params.append("donationType", typeFilter);
    if (statusFilter !== "all") params.append("paymentStatus", statusFilter);
    params.append("format", format);

    window.location.href = `/api/admin/donations?${params.toString()}`;
  };

  const columns = [
    { key: "donationId" as const, label: "Donation ID", width: "140px" },
    { key: "donorName" as const, label: "Donor Name" },
    {
      key: "donorMobile" as const,
      label: "Mobile",
      render: (value: string) => value || "-",
    },
    {
      key: "amount" as const,
      label: "Amount",
      render: (_value: number, row: DonationData) =>
        row.paymentStatus === "success"
          ? `₹${row.amount.toLocaleString()}`
          : "—",
    },
    {
      key: "donationType" as const,
      label: "Type",
      render: (value: string) => (
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
            value === "monthly"
              ? "bg-[#e8f5e9] text-[#2e7d32] border border-emerald-200"
              : value === "one_time"
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          {value === "monthly"
            ? "💪 Monthly"
            : value === "one_time"
              ? "❤️ One-time"
              : value}
        </span>
      ),
    },
    {
      key: "paymentStatus" as const,
      label: "Status",
      render: (value: string) => (
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
            value === "success"
              ? "bg-[#e8f5e9] text-[#2e7d32] border border-emerald-200"
              : value === "pending"
                ? "bg-[#fff3e5] text-[#d32f2f] border border-amber-200"
                : value === "cancelled"
                  ? "bg-slate-100 text-slate-700 border border-slate-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {value === "success"
            ? "✓ Success"
            : value === "pending"
              ? "Pending"
              : value === "cancelled"
                ? "Cancelled"
                : "Failed"}
        </span>
      ),
    },
    {
      key: "createdAt" as const,
      label: "Date",
      render: (value: string) => new Date(value).toLocaleDateString("en-IN"),
    },
  ];

  const successfulDonations = donations.filter(
    (donation) => donation.paymentStatus === "success",
  );
  const stats = {
    total: successfulDonations.length,
    totalAmount: successfulDonations.reduce((sum, d) => sum + d.amount, 0),
    monthly: successfulDonations.filter((d) => d.donationType === "monthly")
      .length,
    oneTime: successfulDonations.filter((d) => d.donationType === "one_time")
      .length,
  };

  return (
    <main className="min-h-screen bg-[#fbf7f1] p-6 md:p-10">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#ead9c2] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#0F5F54]">Donations</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#36100B]">
            Donation Analytics & Ledger
          </h1>
          <p className="mt-1 text-sm text-[#7A6258]">
            Track voluntary contributions, recurring supporters, and collection ledgers.
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
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A6258]">Successful Contributions</p>
            <p className="text-3xl font-black text-[#36100B] mt-1">{stats.total}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#fff3e5] flex items-center justify-center text-[#6A160A] text-2xl">
            <HiOutlineHeart />
          </div>
        </div>

        <div className="rounded-2xl border border-[#ead9c2] bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A6258]">Total Amount Collected</p>
            <p className="text-3xl font-black text-[#0F5F54] mt-1">₹{stats.totalAmount.toLocaleString()}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#e8f5e9] flex items-center justify-center text-[#0F5F54] text-2xl">
            <HiOutlineBanknotes />
          </div>
        </div>

        <div className="rounded-2xl border border-[#ead9c2] bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A6258]">Recurring Monthly</p>
            <p className="text-3xl font-black text-[#0F5F54] mt-1">{stats.monthly}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#e8f5e9] flex items-center justify-center text-[#0F5F54] text-2xl">
            <HiOutlineArrowTrendingUp />
          </div>
        </div>

        <div className="rounded-2xl border border-[#ead9c2] bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A6258]">One-time Gifts</p>
            <p className="text-3xl font-black text-[#6A160A] mt-1">{stats.oneTime}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#fff3e5] flex items-center justify-center text-[#6A160A] text-2xl">
            <HiOutlineHeart />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-[#ead9c2] bg-[#fffdf7] p-5 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5A1C16] shrink-0">
              Type:
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              disabled={isLoading}
              className="w-full sm:w-48 px-3 py-2 border border-[#dcc9a8] rounded-xl text-xs font-bold text-[#36100B] focus:outline-none focus:ring-2 focus:ring-[#0F5F54] bg-white"
            >
              <option value="all">All Types</option>
              <option value="monthly">Monthly Recurring</option>
              <option value="one_time">One-time Gift</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5A1C16] shrink-0">
              Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={isLoading}
              className="w-full sm:w-48 px-3 py-2 border border-[#dcc9a8] rounded-xl text-xs font-bold text-[#36100B] focus:outline-none focus:ring-2 focus:ring-[#0F5F54] bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable<DonationData>
        columns={columns}
        data={donations}
        isLoading={isLoading}
        emptyMessage="No donations found"
      />
    </main>
  );
}
