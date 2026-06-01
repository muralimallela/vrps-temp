"use client";

import { useEffect, useState, useCallback } from "react";
import DataTable from "@/src/components/admin/DataTable";

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
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === "monthly"
              ? "bg-blue-100 text-blue-800"
              : value === "one_time"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          {value === "monthly"
            ? "Monthly"
            : value === "one_time"
              ? "One-time"
              : value}
        </span>
      ),
    },
    {
      key: "paymentStatus" as const,
      label: "Status",
      render: (value: string) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === "success"
              ? "bg-green-100 text-green-800"
              : value === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : value === "cancelled"
                  ? "bg-slate-100 text-slate-700"
                  : "bg-red-100 text-red-800"
          }`}
        >
          {value === "success"
            ? "Success"
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
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-slate-900 mb-2">
          Donation Management
        </h1>
        <p className="text-slate-600">Track and analyze all donation records</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Successful Donations</p>
          <p className="text-3xl font-semibold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Amount Collected</p>
          <p className="text-3xl font-semibold text-slate-900">
            ₹{stats.totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Recurring (Monthly)</p>
          <p className="text-3xl font-semibold text-slate-900">
            {stats.monthly}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">One-time Donations</p>
          <p className="text-3xl font-semibold text-slate-900">
            {stats.oneTime}
          </p>
        </div>
      </div>

      {/* Filter and Export */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 mb-6 flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Filter by Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100"
          >
            <option value="all">All Types</option>
            <option value="monthly">Monthly</option>
            <option value="one_time">One-time</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Payment Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleExport("csv")}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport("xlsx")}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            Export Excel
          </button>
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
