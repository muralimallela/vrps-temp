"use client";

import { useState, useEffect } from "react";
import TransparencyStats from "@/src/components/community/TransparencyStats";
import Link from "next/link";

interface Stats {
  totalMembers: number;
  totalSupporters: number;
  totalDonationAmount: number;
  newMembersThisMonth: number;
  monthlyDonationAmount: number;
}

export default function CommunityImpactPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/public/stats");
      const data = await res.json();

      if (data.success) {
        setStats(data.data);
        setError(null);
      } else {
        setError("Failed to load statistics");
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("An error occurred while loading statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6cf] to-[#fffdf7] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-[#0F5F54] hover:text-[#0D4A42] transition mb-4 inline-block"
          >
            ← Back
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[#5A1C16] mb-4">
            Community Impact & Transparency
          </h1>
          <p className="text-lg text-[#8B6F47] max-w-2xl">
            Our commitment to transparency and accountability. See the real
            impact of our community's collective efforts toward strengthening
            the Vaddera community.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5F54] mb-4"></div>
            <p className="text-[#8B6F47]">Loading community data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : stats ? (
          <>
            <TransparencyStats
              totalMembers={stats.totalMembers}
              totalSupporters={stats.totalSupporters}
              totalDonationAmount={stats.totalDonationAmount}
              newMembersThisMonth={stats.newMembersThisMonth}
              monthlyDonationAmount={stats.monthlyDonationAmount}
            />

            {/* Additional Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Join Community */}
              <div className="bg-white rounded-xl p-8 border border-[#e8d4b8]">
                <h3 className="text-2xl font-bold text-[#5A1C16] mb-4">
                  Join Our Community
                </h3>
                <p className="text-[#8B6F47] mb-6">
                  Become a member and be part of our growing Vaddera community.
                  Your participation helps strengthen our collective efforts.
                </p>
                <Link
                  href="/membership"
                  className="inline-block px-6 py-3 bg-[#0F5F54] hover:bg-[#0D4A42] text-white font-semibold rounded-lg transition"
                >
                  Become a Member
                </Link>
              </div>

              {/* Support Mission */}
              <div className="bg-[#ffe6bf] rounded-xl p-8 border border-[#e8d4b8]">
                <h3 className="text-2xl font-bold text-[#5A1C16] mb-4">
                  Support Our Mission
                </h3>
                <p className="text-[#8B6F47] mb-6">
                  Your donation, no matter the amount, makes a real difference.
                  Support causes that matter to our community.
                </p>
                <Link
                  href="/donations"
                  className="inline-block px-6 py-3 bg-[#0F5F54] hover:bg-[#0D4A42] text-white font-semibold rounded-lg transition"
                >
                  Make a Donation
                </Link>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mt-12 bg-[#f5e6cf] rounded-xl p-8 border border-[#e8d4b8]">
              <h3 className="text-xl font-bold text-[#5A1C16] mb-4">
                🔒 Your Privacy Matters
              </h3>
              <div className="space-y-3 text-[#2B0904]">
                <p>
                  ✓ All information displayed here is{" "}
                  <strong>opt-in only</strong>
                </p>
                <p>
                  ✓ You can choose to remain <strong>completely private</strong>
                </p>
                <p>
                  ✓ You can contribute as <strong>anonymous</strong> while still
                  supporting our mission
                </p>
                <p>
                  ✓ You have full control over your{" "}
                  <strong>public visibility settings</strong>
                </p>
                <p>
                  ✓ Personal information like email, phone, and government IDs
                  are <strong>never displayed</strong>
                </p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
