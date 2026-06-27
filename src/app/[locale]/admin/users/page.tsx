"use client";

import { useEffect, useState, useCallback } from "react";
import FilterPanel, { FilterState } from "@/src/components/admin/FilterPanel";
import DataTable from "@/src/components/admin/DataTable";
import { HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineUserMinus, HiOutlineArrowDownTray } from "react-icons/hi2";

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
    { key: "userId" as const, label: "User ID", width: "130px" },
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
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
            value ? "bg-[#e8f5e9] text-[#2e7d32] border border-emerald-200" : "bg-[#fff3e5] text-[#d32f2f] border border-amber-200"
          }`}
        >
          {value ? "✓ Active Member" : "○ Registered User"}
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
    <main className="min-h-screen bg-[#fbf7f1] p-6 md:p-10">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#ead9c2] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#0F5F54]">Directory</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#36100B]">
            User Directory Management
          </h1>
          <p className="mt-1 text-sm text-[#7A6258]">
            Search, filter, and export registered community users and membership records.
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-[#ead9c2] bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A6258]">Total Registered</p>
            <p className="text-3xl font-black text-[#36100B] mt-1">{stats.total}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#fff3e5] flex items-center justify-center text-[#6A160A] text-2xl">
            <HiOutlineUserGroup />
          </div>
        </div>

        <div className="rounded-2xl border border-[#ead9c2] bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A6258]">Active Members</p>
            <p className="text-3xl font-black text-[#0F5F54] mt-1">{stats.members}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#e8f5e9] flex items-center justify-center text-[#0F5F54] text-2xl">
            <HiOutlineShieldCheck />
          </div>
        </div>

        <div className="rounded-2xl border border-[#ead9c2] bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A6258]">Registered Non-Members</p>
            <p className="text-3xl font-black text-[#d32f2f] mt-1">{stats.nonMembers}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 text-2xl">
            <HiOutlineUserMinus />
          </div>
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
