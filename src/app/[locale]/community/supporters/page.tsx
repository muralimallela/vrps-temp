"use client";

import { useState, useEffect } from "react";
import DonorCard from "@/src/components/community/DonorCard";
import { HiOutlineHeart, HiOutlineSparkles } from "react-icons/hi2";

interface Donation {
  _id: string;
  displayName: string;
  amount: number;
  donationType: "one_time" | "monthly";
  donationDate: string;
  supporterMessage?: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function CommunitySupportersPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations(pagination.page);
  }, []);

  const fetchDonations = async (page: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/public/donations?page=${page}&limit=${pagination.limit}`
      );
      const data = await res.json();

      if (data.success) {
        setDonations(data.data);
        setPagination(data.pagination);
        setError(null);
      } else {
        setError("Failed to load supporters");
      }
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError("An error occurred while loading supporters");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchDonations(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] px-4 py-8 md:px-8 md:py-12">
      <section className="mx-auto max-w-6xl">
        {/* Top Hero Card aligned with VRPS app theme */}
        <div className="mb-8 rounded-2xl border border-[#e4c69d] bg-white/85 p-6 shadow-[0_20px_40px_-24px_rgba(90,28,22,0.45)] backdrop-blur md:p-8">
          <p className="mb-2 inline-block rounded-full bg-[#6A160A] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Supporters Roll
          </p>
          <h1 className="text-3xl font-black leading-tight text-[#3d120d] md:text-4xl">
            Our Community Heroes
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5a3a2e] md:text-base">
            Honoring the generous supporters whose voluntary contributions power outreach, welfare programs, and student support.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#eddcc8] bg-[#fffaf4] px-4 py-2 text-sm font-bold text-[#3d120d]">
              <HiOutlineHeart className="h-5 w-5 text-[#6A160A]" />
              <span><strong className="text-[#6A160A]">{pagination.total}</strong> Generous Contributors</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[#eddcc8] bg-[#fffaf4] px-4 py-2 text-sm font-semibold text-[#6a4a3b]">
              <HiOutlineSparkles className="h-5 w-5 text-[#0F5F54]" />
              <span>Voluntary Empowerment</span>
            </div>
          </div>
        </div>

        {/* Supporters Grid Container */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-[#e4c69d] bg-white p-8 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6A160A] border-t-transparent mb-3" />
            <p className="text-sm font-bold text-[#6A160A]">Loading supporters roll...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-base font-bold text-red-600">⚠️ Unable to Load Supporters</p>
            <p className="mt-1 text-xs text-gray-600">{error}</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="rounded-2xl border border-[#e4c69d] bg-white p-12 text-center shadow-sm">
            <p className="text-xl font-bold text-[#3d120d]">Be the First Supporter</p>
            <p className="mt-2 text-sm text-[#6a4a3b]">
              No contributions listed publicly yet. Make a donation today and inspire others!
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
              {donations.map((donation) => (
                <DonorCard
                  key={donation._id}
                  displayName={donation.displayName}
                  amount={donation.amount}
                  donationDate={donation.donationDate}
                  supporterMessage={donation.supporterMessage}
                  donationType={donation.donationType}
                  isAnonymous={donation.isAnonymous}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-6 border-t border-[#e4c69d]">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-5 py-2 bg-[#6A160A] hover:bg-[#561007] disabled:bg-gray-300 text-white font-bold text-xs rounded-lg transition disabled:cursor-not-allowed"
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          page === pagination.page
                            ? "bg-[#6A160A] text-white"
                            : "bg-white border border-[#e7d1ba] text-[#3d120d] hover:bg-[#fff3e5]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-5 py-2 bg-[#6A160A] hover:bg-[#561007] disabled:bg-gray-300 text-white font-bold text-xs rounded-lg transition disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
