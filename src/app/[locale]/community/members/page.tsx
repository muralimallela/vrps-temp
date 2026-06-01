"use client";

import { useState, useEffect } from "react";
import MemberCard from "@/src/components/community/MemberCard";

interface Member {
  _id: string;
  displayName: string;
  membershipId?: string;
  joinDate: string;
  city?: string;
  district?: string;
  isAnonymous: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function CommunityMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers(pagination.page);
  }, []);

  const fetchMembers = async (page: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/public/members?page=${page}&limit=${pagination.limit}`,
      );
      const data = await res.json();

      if (data.success) {
        setMembers(data.data);
        setPagination(data.pagination);
        setError(null);
      } else {
        setError("Failed to load members");
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("An error occurred while loading members");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchMembers(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0F5F54] via-[#1A9984] to-[#2BC5B8] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur mb-6">
            <span className="text-3xl">👥</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Our Growing Community
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Meet the vibrant members building the future of the Vaddera community. These are individuals who believe in collective growth, shared values, and making a real difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex -space-x-3">
              {members.slice(0, 5).map((member) => (
                <div
                  key={member._id}
                  className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-bold text-white backdrop-blur"
                >
                  {member.displayName.charAt(0)}
                </div>
              ))}
            </div>
            <p className="text-white/80 text-sm">
              <strong className="text-white">{pagination.total}</strong> members strong
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-16">
          <div className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-2xl p-6 md:p-8 text-center border border-[#0F5F54]/20">
            <div className="text-4xl md:text-5xl font-black text-[#0F5F54] mb-2">
              {pagination.total}
            </div>
            <p className="text-[#0F5F54] font-semibold">Active Members</p>
            <p className="text-sm text-[#0F5F54]/70 mt-1">All in, all committed</p>
          </div>

          <div className="bg-gradient-to-br from-[#fce4ec] to-[#f8bbd0] rounded-2xl p-6 md:p-8 text-center border border-[#d32f2f]/20">
            <div className="text-4xl md:text-5xl font-black text-[#d32f2f] mb-2">
              🌱
            </div>
            <p className="text-[#d32f2f] font-semibold">Growing Together</p>
            <p className="text-sm text-[#d32f2f]/70 mt-1">Each day, stronger</p>
          </div>

          <div className="bg-gradient-to-br from-[#fff3e0] to-[#ffe0b2] rounded-2xl p-6 md:p-8 text-center border border-[#e65100]/20">
            <div className="text-4xl md:text-5xl font-black text-[#e65100] mb-2">
              ✨
            </div>
            <p className="text-[#e65100] font-semibold">Making Impact</p>
            <p className="text-sm text-[#e65100]/70 mt-1">Real change, real people</p>
          </div>
        </div>

        {/* Loading / Error / Empty States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-[#e8d4b8]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0F5F54] animate-spin"></div>
            </div>
            <p className="text-[#8B6F47] font-semibold">Loading members...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-semibold text-lg mb-2">⚠️ Unable to Load</p>
            <p className="text-red-500">{error}</p>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-gradient-to-br from-[#ffe6bf] to-[#ffccb3] rounded-2xl p-12 text-center border-2 border-[#e8c547]/50">
            <p className="text-2xl md:text-3xl font-bold text-[#5A1C16] mb-3">
              Be Part of Something Special
            </p>
            <p className="text-[#8B6F47] mb-6 max-w-xl mx-auto">
              No members have chosen to list publicly yet. Your membership could be the first step toward an even stronger community!
            </p>
          </div>
        ) : (
          <>
            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
              {members.map((member) => (
                <MemberCard
                  key={member._id}
                  displayName={member.displayName}
                  membershipId={member.membershipId}
                  joinDate={member.joinDate}
                  city={member.city}
                  district={member.district}
                  isAnonymous={member.isAnonymous}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-6 py-3 bg-[#0F5F54] hover:bg-[#0D4A42] disabled:bg-[#ccc] text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, pagination.page - 2),
                      Math.min(pagination.pages, pagination.page + 1),
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-bold transition ${
                          page === pagination.page
                            ? "bg-[#0F5F54] text-white shadow-lg"
                            : "bg-[#f5e6cf] text-[#5A1C16] hover:bg-[#ffe6bf]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-6 py-3 bg-[#0F5F54] hover:bg-[#0D4A42] disabled:bg-[#ccc] text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#f5e6cf] to-[#fffaf4] py-16 md:py-20 border-t-2 border-[#e8d4b8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#5A1C16] mb-4">
            Ready to Join This Community?
          </h2>
          <p className="text-lg text-[#8B6F47] mb-8 max-w-2xl mx-auto">
            Become part of our movement. Your voice, your passion, and your commitment matter.
          </p>
          <a
            href="/membership"
            className="inline-block px-8 py-4 bg-[#0F5F54] hover:bg-[#0D4A42] text-white font-bold rounded-xl transition-all transform hover:scale-105"
          >
            Become a Member →
          </a>
        </div>
      </div>
    </main>
  );
}
