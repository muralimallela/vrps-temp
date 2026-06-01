"use client";

import { useEffect, useState, useCallback } from "react";
import FilterPanel, { FilterState } from "@/src/components/admin/FilterPanel";
import DataTable from "@/src/components/admin/DataTable";

interface UserData {
  _id: string;
  userId: string;
  name: string;
  mobile: string;
  email: string;
  isMember: boolean;
  address?: {
    state: string;
    district: string;
    mandal: string;
    village: string;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    state: "",
    district: "",
    mandal: "",
    village: "",
  });
  const [locations, setLocations] = useState({
    states: [] as string[],
    districts: [] as string[],
    mandals: [] as string[],
    villages: [] as string[],
  });

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category !== "all")
        params.append("category", filters.category);
      if (filters.state) params.append("state", filters.state);
      if (filters.district) params.append("district", filters.district);
      if (filters.mandal) params.append("mandal", filters.mandal);
      if (filters.village) params.append("village", filters.village);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const body = await res.json();
      if (body.success) {
        setUsers(body.data);
        // Extract unique locations
        const allAddresses = body.data
          .map((u: UserData) => u.address)
          .filter(Boolean);
        setLocations({
          states: [...new Set(allAddresses.map((a: any) => a.state))]
            .filter(Boolean)
            .sort() as string[],
          districts: [
            ...new Set(
              allAddresses
                .filter((a: any) => !filters.state || a.state === filters.state)
                .map((a: any) => a.district),
            ),
          ]
            .filter(Boolean)
            .sort() as string[],
          mandals: [
            ...new Set(
              allAddresses
                .filter(
                  (a: any) =>
                    !filters.district || a.district === filters.district,
                )
                .map((a: any) => a.mandal),
            ),
          ]
            .filter(Boolean)
            .sort() as string[],
          villages: [
            ...new Set(
              allAddresses
                .filter(
                  (a: any) => !filters.mandal || a.mandal === filters.mandal,
                )
                .map((a: any) => a.village),
            ),
          ]
            .filter(Boolean)
            .sort() as string[],
        });
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [filters, loadUsers]);

  const handleExport = async (format: "csv" | "xlsx") => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.category !== "all") params.append("category", filters.category);
    if (filters.state) params.append("state", filters.state);
    if (filters.district) params.append("district", filters.district);
    if (filters.mandal) params.append("mandal", filters.mandal);
    if (filters.village) params.append("village", filters.village);
    params.append("format", format);

    window.location.href = `/api/admin/users?${params.toString()}`;
  };

  const columns = [
    { key: "userId" as const, label: "User ID", width: "120px" },
    { key: "name" as const, label: "Name" },
    {
      key: "mobile" as const,
      label: "Mobile",
      render: (value: string) => value || "-",
    },
    {
      key: "isMember" as const,
      label: "Status",
      render: (value: boolean) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${value ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
        >
          {value ? "✓ Member" : "○ Non-Member"}
        </span>
      ),
    },
    {
      key: "address" as const,
      label: "Location",
      render: (value: any) => {
        if (!value) return "-";
        return `${value.village || "-"}, ${value.mandal || "-"}, ${value.district || "-"}, ${value.state || "-"}`;
      },
    },
  ];

  const stats = {
    total: users.length,
    members: users.filter((u) => u.isMember).length,
    nonMembers: users.filter((u) => !u.isMember).length,
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-slate-900 mb-2">
          User Management
        </h1>
        <p className="text-slate-600">
          View and manage all registered users with advanced filtering
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Total Users</p>
          <p className="text-3xl font-semibold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Active Members</p>
          <p className="text-3xl font-semibold text-slate-900">
            {stats.members}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Non-Members</p>
          <p className="text-3xl font-semibold text-slate-900">
            {stats.nonMembers}
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterPanel
        onFilterChange={setFilters}
        states={locations.states}
        districts={locations.districts}
        mandals={locations.mandals}
        villages={locations.villages}
        isLoading={isLoading}
      />

      {/* Export Buttons */}
      <div className="flex gap-2 mb-6">
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

      {/* Data Table */}
      <DataTable<UserData>
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="No users found matching your filters"
      />
    </main>
  );
}
