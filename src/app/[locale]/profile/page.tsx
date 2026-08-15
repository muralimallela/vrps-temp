"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

export default function ProfilePage() {
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
    const nextMobileError = validateMobile(profile.mobile || "");
    setMobileError(nextMobileError);
    if (nextMobileError) return;

    setSaving(true);
    setMessage("");
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    setSaving(false);
    setMessage(data.success ? "Profile updated successfully." : data.error || "Failed to update.");
  };

  const joinedDate = useMemo(() => {
    if (!profile?.createdAt) return "-";
    return new Date(profile.createdAt).toLocaleDateString("en-IN");
  }, [profile?.createdAt]);

  const memberSince = useMemo(() => {
    if (!profile?.memberSince) return "-";
    return new Date(profile.memberSince).toLocaleDateString("en-IN");
  }, [profile?.memberSince]);

  if (!isLoaded || loading) return <LogoLoader message="Loading profile..." />;

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-amber-50 p-6 md:p-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#e4c69d] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black text-[#3d120d]">Profile Access</h1>
          <p className="mt-2 text-sm text-[#5a3a2e]">Please sign in to view your profile details.</p>
          <SignInButton mode="modal">
            <button className="mt-4 rounded-lg bg-[#6A160A] px-4 py-2 text-sm font-semibold text-white">
              Sign In
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-amber-50 p-6 md:p-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#e4c69d] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black text-[#3d120d]">Could Not Load Profile</h1>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  if (!profile) return <main className="p-8">Profile not found.</main>;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] px-4 py-8 md:px-8 md:py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl border border-[#e4c69d] bg-white/80 p-6 shadow-[0_20px_40px_-24px_rgba(90,28,22,0.45)] backdrop-blur md:p-8">
          <p className="mb-2 inline-block rounded-full bg-[#6A160A] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Account
          </p>
          <h1 className="text-3xl font-black text-[#3d120d] md:text-4xl">My Profile</h1>
          <p className="mt-2 text-sm text-[#5a3a2e] md:text-base">
            Manage your personal details, membership identity, and readiness for member benefits.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <aside className="rounded-2xl border border-[#e4c69d] bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="h-14 w-14 rounded-full border border-[#e4c69d] object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e4c69d] bg-[#fff3e5] text-xl font-bold text-[#6A160A]">
                  {profile.name?.[0] || "U"}
                </div>
              )}
              <div>
                <p className="text-sm text-[#7c5a46]">Account ID</p>
                <p className="text-sm font-bold text-[#3d120d]">{profile.userId}</p>
                <p className="text-[11px] text-[#8a5b3a]">
                  Used for support and account reference (not membership ID).
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-[#eddcc8] bg-[#fffaf4] p-3">
              <p className="text-xs uppercase tracking-wide text-[#8a5b3a]">Membership status</p>
              <p
                className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                  profile.isMember
                    ? "bg-[#e8f7f0] text-[#0f5f54]"
                    : "bg-[#fff1df] text-[#8a4b22]"
                }`}
              >
                {profile.isMember ? "Active Member" : "Ready to join"}
              </p>
              <p className="mt-2 text-xs text-[#5a3a2e]">
                Membership ID: {profile.isMember ? profile.membershipId || "-" : "Not assigned yet"}
              </p>
              <p className="text-xs text-[#5a3a2e]">Member Since: {memberSince}</p>
              {!profile.isMember && (
                <Link
                  href="/membership"
                  className="mt-3 inline-block rounded-md bg-[#6A160A] px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Become a Member
                </Link>
              )}
              {profile.isMember && (
                <Link
                  href="/id-card"
                  className="mt-3 inline-block rounded-md bg-[#0F5F54] px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Get Your Member ID Card
                </Link>
              )}
            </div>

            <div className="mt-4 rounded-lg border border-[#eddcc8] p-3">
              <p className="text-xs uppercase tracking-wide text-[#8a5b3a]">Account info</p>
              <p className="mt-1 text-xs text-[#5a3a2e]">Joined: {joinedDate}</p>
              <Link
                href="/address"
                className="mt-3 inline-block rounded-md bg-[#fff3e5] px-3 py-1.5 text-xs font-semibold text-[#6A160A] border border-[#eddcc8] hover:bg-[#fde7cf]"
              >
                Manage Address
              </Link>
            </div>
          </aside>

          <section className="rounded-2xl border border-[#e7d1ba] bg-white p-5 shadow-sm lg:col-span-3">
            <h2 className="text-xl font-bold text-[#3d120d]">Personal Details</h2>
            <p className="mt-1 text-sm text-[#6a4a3b]">Keep your profile information updated.</p>

            <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a5b3a]">
                  Full Name
                </label>
                <input
                  className="w-full rounded-lg border border-[#d9b892] px-3 py-2 text-[#34120e] outline-none ring-[#6A160A] focus:ring-2"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a5b3a]">
                  Mobile Number
                </label>
                <input
                  className="w-full rounded-lg border border-[#d9b892] px-3 py-2 text-[#34120e] outline-none ring-[#6A160A] focus:ring-2"
                  value={profile.mobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    setProfile({ ...profile, mobile: value });
                    setMobileError(validateMobile(value));
                  }}
                  placeholder="9876543210 or +919876543210"
                />
                {mobileError && <p className="mt-1 text-xs text-red-700">{mobileError}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a5b3a]">
                  Email Address
                </label>
                <input
                  className="w-full rounded-lg border border-[#d9b892] px-3 py-2 text-[#34120e] outline-none ring-[#6A160A] focus:ring-2"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>

              <div className="md:col-span-2">
                <div className="rounded-lg border border-[#eddcc8] bg-[#fffaf4] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a5b3a]">
                    Profile Photo & Account Settings
                  </p>
                  <p className="mt-1 text-xs text-[#5a3a2e]">
                    Manage your profile photo, sign-in methods, and account settings in Clerk.
                  </p>
                  <Link
                    href="/user-profile"
                    className="mt-2 inline-block rounded-md bg-[#fff3e5] px-3 py-1.5 text-xs font-semibold text-[#6A160A] border border-[#eddcc8] hover:bg-[#fde7cf]"
                  >
                    Open Clerk Profile Settings
                  </Link>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#6A160A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#561007] disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
                {message && <p className="text-sm text-[#5b2a1f]">{message}</p>}
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
