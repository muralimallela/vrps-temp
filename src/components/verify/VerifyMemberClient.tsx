"use client";

import { useEffect, useState } from "react";
import LogoLoader from "@/src/components/loading/LogoLoader";
import { HiOutlineCheckBadge, HiOutlineExclamationTriangle, HiOutlineShieldCheck, HiOutlineLockClosed } from "react-icons/hi2";

type VerificationData = {
  membershipId: string;
  name: string;
  status: string;
  memberSince: string;
  location: string;
  isAuthentic?: boolean;
  verifiedAt: string;
};

export default function VerifyMemberClient({ memberId }: { memberId: string }) {
  const [data, setData] = useState<VerificationData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const search = typeof window !== "undefined" ? window.location.search : "";
        const res = await fetch(`/api/verify/${memberId}${search}`);
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || "Member verification failed.");
        }
      } catch (e) {
        setError("Unable to connect to verification servers.");
      } finally {
        setLoading(false);
      }
    }
    if (memberId) verify();
  }, [memberId]);

  if (loading) {
    return <LogoLoader message="Verifying member authenticity..." />;
  }

  if (error || !data) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] p-6">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
            <HiOutlineExclamationTriangle className="h-12 w-12" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-gray-900">Verification Unsuccessful</h1>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {error || "We could not find an active membership for this ID. Please check the ID number or try again."}
          </p>
        </div>
      </main>
    );
  }

  const formattedDate = data.memberSince
    ? new Date(data.memberSince).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Active Member";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-lg">
        <div className="overflow-hidden rounded-3xl border border-[#e4c69d] bg-white p-8 shadow-2xl text-center">
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-inner ${
            data.isAuthentic ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          }`}>
            {data.isAuthentic ? (
              <HiOutlineShieldCheck className="h-12 w-12" />
            ) : (
              <HiOutlineExclamationTriangle className="h-12 w-12" />
            )}
          </div>

          <span className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
            data.isAuthentic ? "bg-emerald-600" : "bg-amber-600"
          }`}>
            <HiOutlineCheckBadge className="h-4 w-4" /> {data.isAuthentic ? "Official VRPS Member" : "Unverified Identity"}
          </span>

          <h1 className="mt-4 text-3xl font-black text-[#3d120d]">
            {data.name}
          </h1>
          <p className="text-sm font-extrabold text-[#0080D2] uppercase tracking-wider mt-1">
            Member ID: {data.membershipId}
          </p>

          <div className={`mt-4 rounded-xl p-3 text-xs font-bold flex items-center justify-center gap-2 border ${
            data.isAuthentic 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>
            <HiOutlineLockClosed className="h-4 w-4 shrink-0" />
            <span>
              {data.isAuthentic 
                ? "✓ Official Authenticated Digital ID Card" 
                : "⚠️ Unverified or Custom QR Code"}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/60 p-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-sky-100 pb-2.5">
              <span className="text-xs font-bold text-gray-500 uppercase">Membership Status</span>
              <span className="text-sm font-black text-emerald-700 bg-emerald-100/80 px-3 py-0.5 rounded-full">
                Active Member
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-sky-100 pb-2.5">
              <span className="text-xs font-bold text-gray-500 uppercase">Member Since</span>
              <span className="text-sm font-bold text-gray-800">{formattedDate}</span>
            </div>

            <div className="flex items-center justify-between border-b border-sky-100 pb-2.5">
              <span className="text-xs font-bold text-gray-500 uppercase">District / State</span>
              <span className="text-sm font-bold text-gray-800">{data.location}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-gray-500 uppercase">Organization</span>
              <span className="text-xs font-bold text-[#0080D2]">VRPS</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-500 font-medium leading-relaxed">
            This identity record is verified directly against the live database of Vaddera Reservation Porata Samithi (VRPS).
          </p>
        </div>
      </div>
    </main>
  );
}
