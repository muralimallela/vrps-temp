import {
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineHeart,
  HiOutlineSparkles,
} from "react-icons/hi2";

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
  const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#e4c69d] bg-white/90 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#6A160A] hover:shadow-xl">
      {/* Accent Bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6A160A] via-[#d32f2f] to-[#e91e63] opacity-80 transition group-hover:opacity-100" />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <span
            className={`mb-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
              donationType === "monthly"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {donationType === "monthly" ? (
              <>
                <HiOutlineSparkles className="h-3 w-3 text-emerald-600" /> Monthly Supporter
              </>
            ) : (
              <>
                <HiOutlineHeart className="h-3 w-3 text-rose-600" /> Contribution
              </>
            )}
          </span>
          <h3 className="truncate text-base font-black text-[#3d120d]">
            {displayName || "Generous Supporter"}
          </h3>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff3e5] text-xl text-[#6A160A] shadow-sm">
          💝
        </div>
      </div>

      {/* Amount Display */}
      <div className="mb-4 rounded-xl border border-[#eddcc8] bg-gradient-to-br from-[#fff8ef] to-[#fff3e5] p-3.5 text-center">
        <p className="mb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#8a5b3a]">
          Contribution Amount
        </p>
        <p className="text-3xl font-black tracking-tight text-[#6A160A]">
          {formatCurrency(amount)}
        </p>
        <p className="mt-1 text-[11px] font-medium text-[#7a5b4c]">
          {donationType === "monthly"
            ? "Recurring monthly support"
            : "Voluntary gift"}
        </p>
      </div>

      {/* Supporter Message */}
      {supporterMessage && !isAnonymous && (
        <div className="mb-4 rounded-xl border-l-4 border-[#0F5F54] bg-[#f0f7f5] p-3 text-xs">
          <p className="mb-1 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#0F5F54]">
            <HiOutlineChatBubbleLeftRight className="h-3.5 w-3.5" /> Supporter Note
          </p>
          <p className="italic text-[#34120e] leading-relaxed">"{supporterMessage}"</p>
        </div>
      )}

      {/* Date & Thank You Footer */}
      <div className="flex items-center justify-between border-t border-[#eddcc8] pt-3 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-[#6a4a3b]">
          <HiOutlineCalendarDays className="h-4 w-4 text-[#0F5F54]" />
          <span>{formattedDate}</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#eddcc8] bg-[#fff3e5] px-2.5 py-0.5 font-bold text-[#6A160A]">
          <span>🙏</span> {isAnonymous ? "Anonymous" : "Thank You!"}
        </span>
      </div>
    </div>
  );
}
