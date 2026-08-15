"use client";

import { useCallback, useState, useRef, useEffect } from "react";

export interface FilterState {
  search: string;
  category: "all" | "members" | "non-members";
  state: string;
  district: string;
  mandal: string;
  village: string;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  states?: string[];
  districts?: string[];
  mandals?: string[];
  villages?: string[];
  isLoading?: boolean;
}

export default function FilterPanel({
  onFilterChange,
  states = [],
  districts = [],
  mandals = [],
  villages = [],
  isLoading = false,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    state: "",
    district: "",
    mandal: "",
    village: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const newFilters = { ...filtersRef.current, search: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }, 300);
  };

  const handleChange = useCallback(
    (field: keyof FilterState, value: string) => {
      const newFilters = { ...filtersRef.current, [field]: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [onFilterChange],
  );

  const handleReset = useCallback(() => {
    const resetFilters: FilterState = {
      search: "",
      category: "all",
      state: "",
      district: "",
      mandal: "",
      village: "",
    };
    setSearchInput("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  }, [onFilterChange]);

  return (
    <div className="bg-[#fffdf7] rounded-xl shadow-sm p-6 border border-[#e8d4b8] mb-6">
      <h3 className="text-lg font-semibold text-[#5A1C16] mb-4">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-[#5A1C16] mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Name, User ID, Mobile, Email, Location"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-[#dcc9a8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F54] text-[#2B0904]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-[#5A1C16] mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-[#dcc9a8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F54] disabled:bg-[#f5e6cf] text-[#2B0904]"
          >
            <option value="all">All Users</option>
            <option value="members">Members Only</option>
            <option value="non-members">Non-Members Only</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-[#5A1C16] mb-2">
            State
          </label>
          <select
            value={filters.state}
            onChange={(e) => handleChange("state", e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-[#dcc9a8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F54] disabled:bg-[#f5e6cf] text-[#2B0904]"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-[#5A1C16] mb-2">
            District
          </label>
          <select
            value={filters.district}
            onChange={(e) => handleChange("district", e.target.value)}
            disabled={isLoading || !filters.state}
            className="w-full px-3 py-2 border border-[#dcc9a8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F54] disabled:bg-[#f5e6cf] text-[#2B0904]"
          >
            <option value="">All Districts</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-4">
        {/* Mandal */}
        <div>
          <label className="block text-sm font-medium text-[#5A1C16] mb-2">
            Mandal
          </label>
          <select
            value={filters.mandal}
            onChange={(e) => handleChange("mandal", e.target.value)}
            disabled={isLoading || !filters.district}
            className="w-full px-3 py-2 border border-[#dcc9a8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F54] disabled:bg-[#f5e6cf] text-[#2B0904]"
          >
            <option value="">All Mandals</option>
            {mandals.map((mandal) => (
              <option key={mandal} value={mandal}>
                {mandal}
              </option>
            ))}
          </select>
        </div>

        {/* Village */}
        <div>
          <label className="block text-sm font-medium text-[#5A1C16] mb-2">
            Village
          </label>
          <select
            value={filters.village}
            onChange={(e) => handleChange("village", e.target.value)}
            disabled={isLoading || !filters.mandal}
            className="w-full px-3 py-2 border border-[#dcc9a8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F54] disabled:bg-[#f5e6cf] text-[#2B0904]"
          >
            <option value="">All Villages</option>
            {villages.map((village) => (
              <option key={village} value={village}>
                {village}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end lg:col-span-4">
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-[#ffe6bf] hover:bg-[#ffd699] text-[#5A1C16] font-semibold rounded-lg transition disabled:opacity-50"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
