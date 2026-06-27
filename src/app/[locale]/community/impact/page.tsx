"use client";

import { useState, useEffect } from "react";
import TransparencyStats from "@/src/components/community/TransparencyStats";
import Link from "next/link";
import { HiOutlineChartBar, HiOutlineLockClosed } from "react-icons/hi2";

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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] px-4 py-8 md:px-8 md:py-12">
      <section className="mx-auto max-w-6xl">
        {/* Top Hero Card aligned with VRPS app theme */}
        <div className="mb-8 rounded-2xl border border-[#e4c69d] bg-white/85 p-6 shadow-[0_20px_40px_-24px_rgba(90,28,22,0.45)] backdrop-blur md:p-8">
          <p className="mb-2 inline-block rounded-full bg-[#6A160A] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Transparency & Impact
          </p>
          <h1 className="text-3xl font-black leading-tight text-[#3d120d] md:text-4xl">
            Community Impact & Transparency
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5a3a2e] md:text-base">
            Our commitment to total accountability. Explore real-time metrics demonstrating how collective participation creates meaningful opportunities.
          </p>
        </div>

        {/* Stats & Details Container */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-[#e4c69d] bg-white p-8 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0F5F54] border-t-transparent mb-3" />
            <p className="text-sm font-bold text-[#0F5F54]">Loading real-time statistics...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-base font-bold text-red-600">⚠️ Unable to Load Metrics</p>
            <p className="mt-1 text-xs text-gray-600">{error}</p>
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

            {/* Action Cards Grid */}
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {/* Join Community Card */}
              <div className="rounded-2xl border border-[#e4c69d] bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#3d120d] mb-2">
                  Become an Active Member
                </h3>
                <p className="text-sm text-[#6a4a3b] leading-relaxed mb-5">
                  Join hundreds of community members working together for empowerment, leadership, and shared growth. Receive your verified digital Member ID card.
                </p>
                <Link
                  href="/membership"
                  className="inline-block rounded-lg bg-[#6A160A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#561007]"
                >
                  Join Community Now →
                </Link>
              </div>

              {/* Support Mission Card */}
              <div className="rounded-2xl border border-[#e4c69d] bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#3d120d] mb-2">
                  Support Our Welfare Mission
                </h3>
                <p className="text-sm text-[#6a4a3b] leading-relaxed mb-5">
                  Your contributions directly fund student educational scholarships, community centers, and youth skill-building initiatives across regions.
                </p>
                <Link
                  href="/donations"
                  className="inline-block rounded-lg bg-[#0F5F54] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0D4A42]"
                >
                  Make a Contribution →
                </Link>
              </div>
            </div>

            {/* Privacy Guarantee Notice */}
            <div className="mt-8 rounded-2xl border border-[#eddcc8] bg-[#fffaf4] p-6 text-sm text-[#5a3a2e]">
              <div className="flex items-center gap-2 mb-3">
                <HiOutlineLockClosed className="h-5 w-5 text-[#0F5F54]" />
                <h3 className="font-bold text-[#3d120d]">
                  Your Privacy & Data Protection Guarantee
                </h3>
              </div>
              <div className="grid gap-2.5 text-xs md:text-sm text-[#6a4a3b] md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0F5F54]">✓</span>
                  <span>Public listing is <strong>100% opt-in</strong> and user-controlled.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0F5F54]">✓</span>
                  <span>Option to remain <strong>completely private</strong> or <strong>anonymous</strong>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0F5F54]">✓</span>
                  <span>Modify your public display preferences at any time.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0F5F54]">✓</span>
                  <span>Sensitive details (email, phone, address) are <strong>never exposed</strong>.</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
