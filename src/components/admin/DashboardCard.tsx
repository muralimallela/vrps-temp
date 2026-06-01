interface DashboardCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  accent?: "teal" | "maroon" | "amber" | "blue" | "rose" | "slate";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  bgColor = "bg-white",
  textColor = "text-slate-900",
  accent = "teal",
  trend,
}: DashboardCardProps) {
  const accentStyles = {
    teal: "bg-[#E4F5F1] text-[#0F5F54]",
    maroon: "bg-[#F9E8E3] text-[#7A271A]",
    amber: "bg-[#FFF1D7] text-[#A25D00]",
    blue: "bg-[#E7F0FF] text-[#24599A]",
    rose: "bg-[#FCE8EC] text-[#A03B52]",
    slate: "bg-[#EDF1F5] text-[#52606D]",
  };

  return (
    <div
      className={`${bgColor} group rounded-2xl border border-[#ead9c2] p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#6A160A]/5`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-[#8B6F47]">{title}</p>
          <p className={`text-3xl font-bold tracking-tight ${textColor || "text-[#5A1C16]"}`}>
            {value.toLocaleString()}
          </p>
          {subtitle && (
            <p className="text-xs text-[#9D8B72] mt-2">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl transition group-hover:scale-105 ${accentStyles[accent]}`}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div
          className={`mt-4 text-xs font-semibold ${trend.isPositive ? "text-[#0F5F54]" : "text-red-600"}`}
        >
          {trend.isPositive ? "↑" : "↓"} {trend.value}% from last month
        </div>
      )}
    </div>
  );
}
