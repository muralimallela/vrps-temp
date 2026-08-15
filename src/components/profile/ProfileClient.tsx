"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogoLoader from "@/src/components/loading/LogoLoader";

type Profile = {
  name: string;
  mobile: string;
  email: string;
  photoUrl: string;
  userId: string;
  isMember: boolean;
  membershipId?: string;
  memberSince?: string;
  createdAt?: string;
};

export default function ProfileClient() {
  const { isLoaded, isSignedIn } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mobileError, setMobileError] = useState("");

  const validateMobile = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const valid = /^(\+91)?[6-9]\d{9}$/.test(trimmed);
    return valid
      ? ""
      : "Use 10 digits starting with 6-9, optionally with +91 prefix.";
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setError("");
      } else {
        setError(data.error || "Unable to load profile");
      }
      setLoading(false);
    };
    load();
  }, [isLoaded, isSignedIn]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    const validation = validateMobile(profile.mobile);
    if (validation) {
      setMobileError(validation);
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profile.name,
        mobile: profile.mobile,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Profile saved");
    } else {
      setError(data.error || "Unable to save profile");
    }
    setSaving(false);
  };

  if (!isLoaded || loading) {
    return <LogoLoader message="Loading your profile..." />;
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] p-6 md:p-12">
        <div className="mx-auto max-w-md rounded-2xl border border-[#e4c69d] bg-white p-6 shadow-sm text-center">
          <h1 className="text-xl font-bold text-[#4a160f]">
            Sign in to view your profile
          </h1>
          <p className="mt-2 text-sm text-[#7a5b4c]">
            Please sign in with your phone or email to manage your member account details.
          </p>
          <div className="mt-4">
            <SignInButton>
              <button className="w-full rounded-lg bg-[#6A160A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#541007] transition">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] p-6 md:p-12">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#e4c69d] bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-[#4a160f]">Your VRPS Profile</h1>
        <p className="mt-1 text-sm text-[#7a5b4c]">
          Manage your personal details, membership status, and address.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-xs text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-4 rounded-md bg-emerald-50 p-3 text-xs text-emerald-800">
            {message}
          </p>
        )}

        {profile && (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A160A]">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-[#e4c69d] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A160A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A160A]">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile.email || ""}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A160A]">
                Mobile Number
              </label>
              <input
                type="text"
                value={profile.mobile || ""}
                onChange={(e) => {
                  setProfile({ ...profile, mobile: e.target.value });
                  setMobileError(validateMobile(e.target.value));
                }}
                className="mt-1 w-full rounded-lg border border-[#e4c69d] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A160A]"
              />
              {mobileError && (
                <p className="mt-1 text-xs text-red-600">{mobileError}</p>
              )}
            </div>

            <div className="pt-4 border-t border-[#eddcc8] flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#6A160A] px-5 py-2 text-sm font-semibold text-white hover:bg-[#541007] transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>

              <div className="flex gap-2">
                <Link
                  href="/address"
                  className="rounded-lg border border-[#e4c69d] bg-[#fffaf4] px-4 py-2 text-xs font-semibold text-[#6A160A] hover:bg-[#fff3e5]"
                >
                  Manage Address
                </Link>
                {profile.isMember && (
                  <Link
                    href="/id-card"
                    className="rounded-lg bg-[#0F5F54] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0D4A42]"
                  >
                    View ID Card
                  </Link>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
