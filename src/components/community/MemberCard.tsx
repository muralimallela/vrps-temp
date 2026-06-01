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
  // Extract initials for avatar
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(joinDate);
  const formattedDate = `${months[date.getMonth()]} ${date.getFullYear()}`;

  return (
    <div className="bg-white rounded-2xl p-6 md:p-7 border-2 border-[#e8d4b8]/50 hover:border-[#0F5F54] hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start gap-4 mb-5">
        {/* Avatar */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-[#0F5F54] to-[#1A9984] flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-md group-hover:shadow-lg transition">
          {isAnonymous ? "🔒" : initials}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-[#5A1C16] truncate">
            {displayName}
          </h3>
          <p className="text-xs md:text-sm text-[#0F5F54] font-semibold uppercase tracking-wide">
            {isAnonymous ? "Anonymous Member" : "Active Member"}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 md:space-y-2.5">
        <div className="flex items-center gap-2 text-sm text-[#2B0904]">
          <span className="text-lg">📅</span>
          <span>Joined {formattedDate}</span>
        </div>

        {(city || district) && (
          <div className="flex items-center gap-2 text-sm text-[#2B0904]">
            <span className="text-lg">📍</span>
            <span className="truncate">{[city, district].filter(Boolean).join(", ")}</span>
          </div>
        )}

        {!isAnonymous && membershipId && (
          <div className="flex items-center gap-2 text-sm text-[#8B6F47]">
            <span className="text-lg">🆔</span>
            <code className="font-mono text-xs bg-[#f5e6cf] px-2 py-1 rounded">{membershipId}</code>
          </div>
        )}
      </div>

      {/* Badge */}
      <div className="mt-4 pt-4 border-t border-[#f0e0cc]">
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5e6cf] rounded-full text-xs font-semibold text-[#0F5F54]">
          <span>✓</span>
          <span>Community Member</span>
        </div>
      </div>
    </div>
  );
}
