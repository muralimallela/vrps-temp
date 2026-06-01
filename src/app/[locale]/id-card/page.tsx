"use client";

import { useEffect, useState } from "react";
import LogoLoader from "@/src/components/loading/LogoLoader";

type IdCardData = {
  membershipId: string;
  name: string;
  photoUrl: string;
  address: string;
  memberSince: string;
};

export default function IdCardPage() {
  const [card, setCard] = useState<IdCardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/membership/id-card");
      const data = await res.json();
      if (data.success) setCard(data.data);
      else setError(data.error || "Access denied");
    };
    load();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-amber-50 p-8">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-[#6A160A] mb-2">ID Card Access</h1>
          <p>{error}</p>
          <p className="mt-2 text-sm text-gray-600">
            Only active members can view and download an ID card.
          </p>
        </div>
      </main>
    );
  }

  if (!card) return <LogoLoader message="Loading ID card..." />;

  return (
    <main className="min-h-screen bg-amber-50 p-6 md:p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-[#6A160A] mb-4">Membership ID Card</h1>
        <div className="border rounded-lg p-4 bg-[#fdf4e8]">
          <p><strong>Membership ID:</strong> {card.membershipId}</p>
          <p><strong>Name:</strong> {card.name}</p>
          <p><strong>Address:</strong> {card.address}</p>
          <p><strong>Member Since:</strong> {new Date(card.memberSince).toLocaleDateString("en-IN")}</p>
        </div>
        <a
          href="/api/membership/id-card/download"
          className="inline-block mt-4 bg-[#6A160A] text-white px-5 py-2 rounded"
        >
          Download My Member ID Card
        </a>
      </div>
    </main>
  );
}
