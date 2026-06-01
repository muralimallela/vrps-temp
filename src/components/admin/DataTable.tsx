"use client";

import LogoLoader from "@/src/components/loading/LogoLoader";

interface DataTableProps<T> {
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
    width?: string;
  }>;
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T extends { _id?: string }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-[#fffdf7] rounded-xl shadow-sm p-8 text-center border border-[#e8d4b8]">
        <LogoLoader message="Loading data..." compact />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#fffdf7] rounded-xl shadow-sm p-8 text-center border border-[#e8d4b8]">
        <p className="text-[#8B6F47] text-lg">ℹ️ {emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fffdf7] rounded-xl shadow-sm border border-[#e8d4b8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f5e6cf] border-b border-[#e8d4b8]">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-6 py-3 text-left font-semibold text-[#5A1C16]"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row._id || idx}
                className="border-b border-[#f0e0cc] hover:bg-[#ffe6bf] transition"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-6 py-4 text-[#2B0904]"
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] || "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
