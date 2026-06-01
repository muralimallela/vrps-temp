"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoLoader from "@/src/components/loading/LogoLoader";

type Donation = {
  donationId: string;
  amount: number;
  donationType: string;
  paymentStatus: string;
  createdAt: string;
};

export default function DonationHistoryPage() {
  const [items, setItems] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/donations/history");
      const data = await res.json();
      if (data.success) setItems(data.data.items);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-amber-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-[#6A160A] mb-1">My Contributions</h1>
        <p className="mb-4 text-sm text-gray-600">Thank you for supporting VRPS community initiatives.</p>
        {loading ? (
          <LogoLoader message="Loading donation history..." compact />
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-[#eddcc8] bg-[#fffaf4] p-4">
            <p className="text-sm text-[#5a3a2e]">You have not made a contribution yet. Giving is always optional.</p>
            <Link href="/donations" className="mt-3 inline-block rounded-md bg-[#6A160A] px-3 py-2 text-xs font-semibold text-white">
              See how you can support VRPS
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Donation ID</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.donationId}>
                    <td className="p-2 border">{item.donationId}</td>
                    <td className="p-2 border">Rs. {item.amount}</td>
                    <td className="p-2 border">{item.donationType}</td>
                    <td className="p-2 border">{item.paymentStatus}</td>
                    <td className="p-2 border">
                      {new Date(item.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
