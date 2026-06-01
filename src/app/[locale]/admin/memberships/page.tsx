"use client";

import { useEffect, useState, useCallback } from "react";
import DataTable from "@/src/components/admin/DataTable";

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
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : value === "expired"
                ? "bg-slate-100 text-slate-700"
                : value === "suspended"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value === "active"
            ? "Active"
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
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-slate-900 mb-2">
          Membership Management
        </h1>
        <p className="text-slate-600">
          Monitor and manage all membership records
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Total Memberships</p>
          <p className="text-3xl font-semibold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Active</p>
          <p className="text-3xl font-semibold text-slate-900">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Inactive</p>
          <p className="text-3xl font-semibold text-slate-900">{stats.inactive}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Revenue Collected</p>
          <p className="text-3xl font-semibold text-slate-900">
            ₹{stats.revenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter and Export */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100"
          >
            <option value="all">All Memberships</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
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
      <DataTable<MembershipData>
        columns={columns}
        data={memberships}
        isLoading={isLoading}
        emptyMessage="No memberships found"
      />
    </main>
  );
}
