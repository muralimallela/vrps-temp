import {
  HiOutlineCalendarDays,
  HiOutlineIdentification,
  HiOutlineMapPin,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

interface MemberCardProps {
  displayName: string;
  membershipId?: string;
  joinDate: string;
  city?: string;
  district?: string;
  isAnonymous: boolean;
}

export default function MemberCard({
  displayName,
  membershipId,
  joinDate,
  city,
  district,
  isAnonymous,
}: MemberCardProps) {
  const nameStr = displayName || "Member";
  const initials =
    nameStr
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "M";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(joinDate);
  const formattedDate = !isNaN(date.getTime())
    ? `${months[date.getMonth()]} ${date.getFullYear()}`
    : "Active Member";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#e4c69d] bg-white/90 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#0F5F54] hover:shadow-xl">
      {/* Top Accent Gradient Bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6A160A] via-[#0F5F54] to-[#2BC5B8] opacity-80 transition group-hover:opacity-100" />

      <div className="mb-4 flex items-center gap-3.5">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F5F54] to-[#1A9984] text-base font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-105">
          {isAnonymous ? "🔒" : initials}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-black text-[#3d120d] transition group-hover:text-[#0F5F54]">
            {displayName || "Member"}
          </h3>
          <span
            className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
              isAnonymous
                ? "border border-amber-200 bg-amber-50 text-amber-800"
                : "border border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            {isAnonymous ? "Anonymous Member" : "Verified Member"}
          </span>
        </div>
      </div>

      {/* Details Card Block */}
      <div className="space-y-2 rounded-xl border border-[#eddcc8] bg-[#fffaf4] p-3 text-xs text-[#5a3a2e]">
        <div className="flex items-center gap-2">
          <HiOutlineCalendarDays className="h-4 w-4 shrink-0 text-[#0F5F54]" />
          <span className="font-semibold">Joined {formattedDate}</span>
        </div>

        {(city || district) && (
          <div className="flex items-center gap-2">
            <HiOutlineMapPin className="h-4 w-4 shrink-0 text-[#0F5F54]" />
            <span className="truncate font-semibold">
              {[city, district].filter(Boolean).join(", ")}
            </span>
          </div>
        )}

        {!isAnonymous && membershipId && (
          <div className="flex items-center justify-between border-t border-[#eddcc8] pt-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#8a5b3a]">
              <HiOutlineIdentification className="h-4 w-4 text-[#6A160A]" />
              Member ID
            </span>
            <code className="rounded border border-[#d9b892] bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-[#6A160A]">
              {membershipId}
            </code>
          </div>
        )}
      </div>

      {/* Footer Verified Seal */}
      <div className="mt-3.5 flex items-center justify-between border-t border-[#f0e0cc] pt-2.5 text-xs">
        <span className="inline-flex items-center gap-1 font-bold text-[#0F5F54]">
          <HiOutlineShieldCheck className="h-4 w-4 text-[#0F5F54]" />
          VRPS Verified Identity
        </span>
      </div>
    </div>
  );
}
