"use client";

interface TrendData {
  _id: {
    year: number;
    month: number;
  };
  total: number;
}

interface TrendChartProps {
  title: string;
  data: TrendData[];
}

export default function TrendChart({ title, data }: TrendChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map((d) => d.total));
  const monthNames = [
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

  return (
    <div className="bg-[#fffdf7] rounded-xl shadow-sm p-6 border border-[#e8d4b8]">
      <h3 className="text-lg font-semibold text-[#5A1C16] mb-6">{title}</h3>
      <div className="flex items-end justify-center gap-1 h-48">
        {data.map((item, idx) => {
          const height = (item.total / maxValue) * 100;
          const month = monthNames[item._id.month - 1];
          return (
            <div key={idx} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-gradient-to-t from-[#0F5F54] to-[#1A9984] rounded-t hover:opacity-80 transition-opacity group relative"
                style={{ height: `${height}%`, minHeight: "10px" }}
                title={`${month} ${item._id.year}: ₹${item.total.toLocaleString()}`}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#5A1C16] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ₹{item.total.toLocaleString()}
                </div>
              </div>
              <p className="text-xs text-[#8B6F47] mt-2 text-center">
                {month}
                <br />
                {item._id.year}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
