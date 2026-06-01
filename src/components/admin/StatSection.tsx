import DashboardCard from "./DashboardCard";

interface StatItem {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  accent?: "teal" | "maroon" | "amber" | "blue" | "rose" | "slate";
}

interface StatSectionProps {
  title: string;
  description?: string;
  stats: StatItem[];
}

export default function StatSection({
  title,
  description,
  stats,
}: StatSectionProps) {
  return (
    <div className="mb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#5A1C16] mb-1">{title}</h2>
        {description && <p className="text-sm text-[#8B6F47]">{description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <DashboardCard key={idx} bgColor="bg-[#fffdf7]" {...stat} />
        ))}
      </div>
    </div>
  );
}
