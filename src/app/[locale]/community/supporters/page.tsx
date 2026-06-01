"use client";

import { useState, useEffect } from "react";
import DonorCard from "@/src/components/community/DonorCard";

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
  const [totalAmount, setTotalAmount] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);

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
        const total = data.data.reduce(
          (sum: number, d: Donation) => sum + d.amount,
          0
        );
        const monthly = data.data
          .filter((d: Donation) => d.donationType === "monthly")
          .reduce((sum: number, d: Donation) => sum + d.amount, 0);
        setTotalAmount(total);
        setMonthlyAmount(monthly);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#d32f2f] via-[#e91e63] to-[#f06292] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur mb-6">
            <span className="text-3xl">❤️</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Our Community Heroes
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Meet the generous supporters who believe in our mission. Every contribution—no matter the size—fuels our collective impact and makes dreams a reality.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Impact Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          <div className="bg-gradient-to-br from-[#fff3e0] to-[#ffe0b2] rounded-2xl p-6 md:p-8 text-center border border-[#e8c547]/20">
            <div className="text-4xl md:text-5xl font-black text-[#e65100] mb-2">
              {pagination.total}
            </div>
            <p className="text-[#e65100] font-semibold">Supporters</p>
            <p className="text-sm text-[#e65100]/70 mt-1">Changing lives</p>
          </div>

          <div className="bg-gradient-to-br from-[#f3e5f5] to-[#e1bee7] rounded-2xl p-6 md:p-8 text-center border border-[#7b1fa2]/20">
            <div className="text-4xl md:text-5xl font-black text-[#7b1fa2] mb-2">
              💝
            </div>
            <p className="text-[#7b1fa2] font-semibold">Total Given</p>
            <p className="text-sm text-[#7b1fa2]/70 mt-1">{formatCurrency(totalAmount)}</p>
          </div>

          <div className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-2xl p-6 md:p-8 text-center border border-[#0F5F54]/20">
            <div className="text-4xl md:text-5xl font-black text-[#0F5F54] mb-2">
              {donations.filter(d => d.donationType === "monthly").length}
            </div>
            <p className="text-[#0F5F54] font-semibold">Monthly</p>
            <p className="text-sm text-[#0F5F54]/70 mt-1">Recurring support</p>
          </div>

          <div className="bg-gradient-to-br from-[#cce3dc] to-[#a5d6d0] rounded-2xl p-6 md:p-8 text-center border border-[#00695c]/20">
            <div className="text-4xl md:text-5xl font-black text-[#00695c] mb-2">
              ✨
            </div>
            <p className="text-[#00695c] font-semibold">Moving Forward</p>
            <p className="text-sm text-[#00695c]/70 mt-1">Together</p>
          </div>
        </div>

        {/* Loading / Error / Empty States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-[#e8d4b8]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0F5F54] animate-spin"></div>
            </div>
            <p className="text-[#8B6F47] font-semibold">Loading supporters...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-semibold text-lg mb-2">⚠️ Unable to Load</p>
            <p className="text-red-500">{error}</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="bg-gradient-to-br from-[#ffe6bf] to-[#ffccb3] rounded-2xl p-12 text-center border-2 border-[#e8c547]/50">
            <p className="text-2xl md:text-3xl font-bold text-[#5A1C16] mb-3">
              Be Our First Supporter
            </p>
            <p className="text-[#8B6F47] mb-6 max-w-xl mx-auto">
              No donations have been shared publicly yet. Your contribution could be the first step in showing the world what's possible when communities unite!
            </p>
          </div>
        ) : (
          <>
            {/* Donations Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
              {donations.map((donation) => (
                <DonorCard
                  key={donation._id}
                  displayName={donation.displayName}
                  amount={donation.amount}
                  donationType={donation.donationType}
                  donationDate={donation.donationDate}
                  supporterMessage={donation.supporterMessage}
                  isAnonymous={donation.isAnonymous}
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
                      Math.min(pagination.pages, pagination.page + 1)
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
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-[#8B6F47] mb-8 max-w-2xl mx-auto">
            Every contribution—no matter the size—matters. Join our supporters in creating real change in the community.
          </p>
          <a
            href="/donations"
            className="inline-block px-8 py-4 bg-[#0F5F54] hover:bg-[#0D4A42] text-white font-bold rounded-xl transition-all transform hover:scale-105"
          >
            Make a Contribution →
          </a>
        </div>
      </div>
    </main>
  );
}
