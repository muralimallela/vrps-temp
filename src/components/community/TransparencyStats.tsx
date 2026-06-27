"use client";

import { useState, useEffect } from "react";

interface TransparencyStatsProps {
  totalMembers: number;
  totalSupporters: number;
  totalDonationAmount: number;
  newMembersThisMonth: number;
  monthlyDonationAmount: number;
}

function StatCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function TransparencyStats({
  totalMembers,
  totalSupporters,
  totalDonationAmount,
  newMembersThisMonth,
  monthlyDonationAmount,
}: TransparencyStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      label: "Community Members",
      value: totalMembers,
      isNumber: true,
      icon: "👥",
      gradient: "from-[#e8f5e9] via-[#f1f8e9] to-white",
      borderColor: "border-emerald-200",
      textColor: "text-[#0F5F54]",
      description: "Verified active community",
    },
    {
      label: "Active Supporters",
      value: totalSupporters,
      isNumber: true,
      icon: "❤️",
      gradient: "from-[#fce4ec] via-[#fff0f5] to-white",
      borderColor: "border-rose-200",
      textColor: "text-[#d32f2f]",
      description: "Generous contributors",
    },
    {
      label: "Community Fund",
      value: formatCurrency(totalDonationAmount),
      isNumber: false,
      icon: "🤝",
      gradient: "from-[#fff3e0] via-[#fff8e7] to-white",
      borderColor: "border-amber-200",
      textColor: "text-[#6A160A]",
      description: "Pooled empowerment fund",
    },
    {
      label: "New Joiners",
      value: newMembersThisMonth,
      isNumber: true,
      icon: "🌱",
      gradient: "from-[#f3e5f5] via-[#fbf5fc] to-white",
      borderColor: "border-purple-200",
      textColor: "text-[#7b1fa2]",
      description: "Joined this month",
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-black text-[#3d120d] md:text-4xl">
          Live Community Metrics
        </h2>
        <p className="mt-2 text-sm text-[#6a4a3b] md:text-base">
          Real numbers reflecting collective participation, transparency, and ongoing progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-3xl border ${stat.borderColor} bg-gradient-to-br ${stat.gradient} p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-2xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8a5b3a]">
                Live Verified
              </span>
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-[#6a4a3b] mb-1">
              {stat.label}
            </p>

            <p className={`text-3xl md:text-4xl font-black ${stat.textColor} tracking-tight mb-2`}>
              {stat.isNumber ? (
                <StatCounter target={stat.value as number} />
              ) : (
                stat.value
              )}
            </p>

            <p className="text-xs text-[#7a5b4c] font-medium border-t border-black/5 pt-2 mt-2">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
