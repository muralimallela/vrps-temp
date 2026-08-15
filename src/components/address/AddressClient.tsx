"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LogoLoader from "@/src/components/loading/LogoLoader";

type Address = {
  state: string;
  district: string;
  mandal: string;
  village: string;
  street: string;
  pincode: string;
};

const emptyAddress: Address = {
  state: "",
  district: "",
  mandal: "",
  village: "",
  street: "",
  pincode: "",
};

const fields: Array<keyof Address> = [
  "state",
  "district",
  "mandal",
  "village",
  "street",
  "pincode",
];

export default function AddressClient() {
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [consentAddress, setConsentAddress] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/profile/address");
      const data = await res.json();
      if (data.success && data.data) {
        setAddress({
          state: data.data.state || "",
          district: data.data.district || "",
          mandal: data.data.mandal || "",
          village: data.data.village || "",
          street: data.data.street || "",
          pincode: data.data.pincode || "",
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const filledCount = useMemo(() => {
    return fields.filter((field) => Boolean(address[field]?.trim())).length;
  }, [address]);

  const isComplete = filledCount === fields.length;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consentAddress) {
      setMessage("Affirmative consent is required: Please check the consent box below to save your address.");
      return;
    }

    setSaving(true);
    setMessage("Saving address...");

    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purposeKey: "address_verification_and_storage",
          status: "granted",
          consentTextVersion: "v1.0-2026-08",
          notes: "User consented to residential address processing for Member ID Card",
        }),
      });
    } catch (e) {
      console.warn("Consent log warning:", e);
    }

    const res = await fetch("/api/profile/address", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    const data = await res.json();
    setSaving(false);
    setMessage(data.success ? "Address saved successfully." : data.error || "Failed to save address.");
  };

  if (loading) return <LogoLoader message="Loading address..." />;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] px-4 py-8 md:px-8 md:py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl border border-[#e4c69d] bg-white/80 p-6 shadow-[0_20px_40px_-24px_rgba(90,28,22,0.45)] backdrop-blur md:p-8">
          <p className="mb-2 inline-block rounded-full bg-[#6A160A] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Address
          </p>
          <h1 className="text-3xl font-black text-[#3d120d] md:text-4xl">Address Details</h1>
          <p className="mt-2 text-sm text-[#5a3a2e] md:text-base">
            Keep your location details updated so we can prepare your Member ID Card accurately.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <aside className="rounded-2xl border border-[#e4c69d] bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold text-[#4a160f]">Completion Status</h2>
            <p className="mt-1 text-sm text-[#6a4a3b]">
              {filledCount} of {fields.length} fields completed
            </p>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#f2e2ce]">
              <div
                className={`h-full rounded-full transition-all ${
                  isComplete ? "bg-[#0f5f54]" : "bg-[#6A160A]"
                }`}
                style={{ width: `${(filledCount / fields.length) * 100}%` }}
              />
            </div>

            <p
              className={`mt-4 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                isComplete ? "bg-[#e8f7f0] text-[#0f5f54]" : "bg-[#fff1df] text-[#8a4b22]"
              }`}
            >
              {isComplete ? "Ready to join" : "A few details left"}
            </p>

            <div className="mt-4 rounded-lg border border-[#eddcc8] bg-[#fffaf4] p-3 text-xs text-[#5a3a2e]">
              <p className="font-semibold">Details for your Member ID Card</p>
              <ul className="mt-2 list-disc pl-4 space-y-1">
                <li>State</li>
                <li>District</li>
                <li>Mandal</li>
                <li>Village</li>
                <li>Street Address</li>
                <li>Pincode</li>
              </ul>
            </div>

            <Link
              href="/membership"
              className="mt-4 inline-block rounded-md bg-[#6A160A] px-3 py-2 text-xs font-semibold text-white"
            >
              Continue to membership
            </Link>
          </aside>

          <section className="rounded-2xl border border-[#e7d1ba] bg-white p-5 shadow-sm lg:col-span-3">
            <h3 className="text-xl font-bold text-[#3d120d]">Edit Address</h3>
            <p className="mt-1 text-sm text-[#6a4a3b]">
              Please enter accurate details for verification and member ID generation.
            </p>

            <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a5b3a]">
                  State
                </label>
                <input
                  className="w-full rounded-lg border border-[#d9b892] px-3 py-2 text-[#34120e] outline-none ring-[#6A160A] focus:ring-2"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a5b3a]">
                  District
                </label>
                <input
                  className="w-full rounded-lg border border-[#d9b892] px-3 py-2 text-[#34120e] outline-none ring-[#6A160A] focus:ring-2"
                  value={address.district}
                  onChange={(e) => setAddress({ ...address, district: e.target.value })}
                  placeholder="Enter district"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a5b3a]">
                  Mandal
                </label>
                <input
                  className="w-full rounded-lg border border-[#d9b892] px-3 py-2 text-[#34120e] outline-none ring-[#6A160A] focus:ring-2"
                  value={address.mandal}
                  onChange={(e) => setAddress({ ...address, mandal: e.target.value })}
                  placeholder="Enter mandal"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a5b3a]">
                  Village
                </label>
                <input
                  className="w-full rounded-lg border border-[#d9b892] px-3 py-2 text-[#34120e] outline-none ring-[#6A160A] focus:ring-2"
                  value={address.village}
                  onChange={(e) => setAddress({ ...address, village: e.target.value })}
                  placeholder="Enter village"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a5b3a]">
                  Street Address
                </label>
                <input
                  className="w-full rounded-lg border border-[#d9b892] px-3 py-2 text-[#34120e] outline-none ring-[#6A160A] focus:ring-2"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="House no, street, landmark"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a5b3a]">
                  Pincode
                </label>
                <input
                  className="w-full rounded-lg border border-[#d9b892] px-3 py-2 text-[#34120e] outline-none ring-[#6A160A] focus:ring-2"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  placeholder="Enter pincode"
                />
              </div>

              <div className="md:col-span-2 rounded-xl border border-[#EECDA3] bg-[#FFFDF9] p-3 text-xs text-[#5A3A2E]">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAddress}
                    onChange={(e) => setConsentAddress(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#d9b892] text-[#6A160A] focus:ring-[#6A160A]"
                  />
                  <span className="leading-relaxed">
                    <strong className="text-[#3D120D]">* Required:</strong> I consent to VRPS collecting and storing my residential address for regional community verification and digital Member ID generation as detailed in the{" "}
                    <Link href="/privacy" target="_blank" className="font-semibold text-[#6A160A] underline">
                      Privacy Notice
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <div className="md:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#6A160A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#561007] disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Address"}
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
