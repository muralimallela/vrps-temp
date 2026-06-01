interface DonorCardProps {
  displayName: string;
  amount: number;
  donationDate: string;
  supporterMessage?: string;
  donationType: "one_time" | "monthly";
  isAnonymous: boolean;
}

export default function DonorCard({
  displayName,
  amount,
  donationDate,
  supporterMessage,
  donationType,
  isAnonymous,
}: DonorCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const date = new Date(donationDate);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  return (
    <div className="bg-white rounded-2xl border-2 border-[#e8d4b8]/50 hover:border-[#d32f2f] overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Timeline line */}
      <div className="h-1 bg-gradient-to-r from-[#0F5F54] to-[#d32f2f]"></div>

      <div className="p-6 md:p-7">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs md:text-sm text-[#0F5F54] font-semibold uppercase tracking-wide mb-1">
              {donationType === "monthly" ? "💪 Monthly Supporter" : "❤️ One-time Supporter"}
            </p>
            <h3 className="text-lg md:text-xl font-bold text-[#5A1C16]">
              {displayName}
            </h3>
          </div>
          <div className="text-4xl">💝</div>
        </div>

        {/* Amount highlight */}
        <div className="bg-gradient-to-r from-[#fff3e0] to-[#ffe0b2] rounded-xl p-4 md:p-5 mb-4 border border-[#e8c547]/30">
          <p className="text-[#8B6F47] text-xs md:text-sm font-semibold mb-1 uppercase">
            Contributing
          </p>
          <p className="text-3xl md:text-4xl font-black text-[#e65100]">
            {formatCurrency(amount)}
          </p>
          <p className="text-xs text-[#9D8B72] mt-2">
            {donationType === "monthly" ? "Every month" : "One-time gift"}
          </p>
        </div>

        {/* Message (if exists) */}
        {supporterMessage && !isAnonymous && (
          <div className="bg-[#f5e6cf] rounded-lg p-4 mb-4 border-l-4 border-[#0F5F54]">
            <p className="text-xs text-[#8B6F47] font-semibold mb-2 uppercase">💬 Their Message</p>
            <p className="text-sm text-[#2B0904] italic">"{supporterMessage}"</p>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-[#2B0904]">
          <span className="text-lg">📅</span>
          <span>{formattedDate}</span>
        </div>

        {/* Footer badge */}
        <div className="mt-4 pt-4 border-t border-[#f0e0cc]">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#e8f5e9] rounded-full text-xs font-semibold text-[#0F5F54]">
            <span>🙏</span>
            <span>{isAnonymous ? "Anonymous Supporter" : "Thank You!"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
