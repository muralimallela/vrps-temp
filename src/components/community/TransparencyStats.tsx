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
      color: "from-[#e8f5e9] to-[#c8e6c9]",
      textColor: "[#0F5F54]",
      description: "Growing stronger",
    },
    {
      label: "Active Supporters",
      value: totalSupporters,
      isNumber: true,
      icon: "❤️",
      color: "from-[#fce4ec] to-[#f8bbd0]",
      textColor: "[#d32f2f]",
      description: "Making impact",
    },
    {
      label: "Community Fund",
      value: formatCurrency(totalDonationAmount),
      isNumber: false,
      icon: "🤝",
      color: "from-[#fff3e0] to-[#ffe0b2]",
      textColor: "[#e65100]",
      description: "Pooled strength",
    },
    {
      label: "New Joiners",
      value: newMembersThisMonth,
      isNumber: true,
      icon: "🌱",
      color: "from-[#f3e5f5] to-[#e1bee7]",
      textColor: "[#7b1fa2]",
      description: "This month",
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-3xl md:text-4xl font-bold text-[#5A1C16] mb-2">
        Our Community Impact
      </h2>
      <p className="text-[#8B6F47] mb-8">Real numbers, real impact, real people</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 md:p-8 border border-[#e8d4b8]/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="text-5xl mb-4">{stat.icon}</div>
            <p className="text-[#8B6F47] text-xs md:text-sm font-semibold uppercase tracking-wider mb-3">
              {stat.label}
            </p>
            <p className={`text-3xl md:text-4xl font-black text-${stat.textColor} mb-2`}>
              {stat.isNumber ? (
                <StatCounter target={stat.value as number} />
              ) : (
                stat.value
              )}
            </p>
            <p className="text-xs md:text-sm text-[#666] italic">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
