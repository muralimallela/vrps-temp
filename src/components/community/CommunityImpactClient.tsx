"use client";

import { useState, useEffect } from "react";
import TransparencyStats from "@/src/components/community/TransparencyStats";

interface Stats {
  totalMembers: number;
  totalSupporters: number;
  totalDonationAmount: number;
  newMembersThisMonth: number;
  monthlyDonationAmount: number;
}

export default function CommunityImpactClient({ isTelugu = false }: { isTelugu?: boolean }) {
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
        {/* Top Hero Card */}
        <header className="mb-8 rounded-2xl border border-[#e4c69d] bg-white/85 p-6 shadow-[0_20px_40px_-24px_rgba(90,28,22,0.45)] backdrop-blur md:p-8">
          <p className="mb-2 inline-block rounded-full bg-[#6A160A] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            {isTelugu ? "పారదర్శకత & సామాజిక ప్రభావం" : "Transparency & Impact"}
          </p>
          <h1 className="text-3xl font-black leading-tight text-[#3d120d] md:text-4xl">
            {isTelugu ? "సామాజిక ప్రభావం & పారదర్శకత గణాంకాలు" : "Community Impact & Transparency"}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5a3a2e] md:text-base">
            {isTelugu
              ? "పూర్తి జవాబుదారీతనం మా నిబద్ధత. సమితి సాధించిన ప్రగతి, సభ్యుల భాగస్వామ్యం మరియు సంక్షేమ కార్యక్రమాల వాస్తవ గణాంకాలు."
              : "Our commitment to total accountability. Explore real-time metrics demonstrating how collective participation creates meaningful opportunities."}
          </p>
        </header>

        {/* Stats Grid Container */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-[#e4c69d] bg-white p-8 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6A160A] border-t-transparent mb-3" />
            <p className="text-sm font-bold text-[#6A160A]">Loading verified impact data...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-base font-bold text-red-600">⚠️ Unable to Load Metrics</p>
            <p className="mt-1 text-xs text-gray-600">{error}</p>
          </div>
        ) : stats ? (
          <TransparencyStats {...stats} />
        ) : null}
      </section>
    </main>
  );
}
