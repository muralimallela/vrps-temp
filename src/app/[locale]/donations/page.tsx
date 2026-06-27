"use client";

import { useMemo, useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineHeart,
  HiOutlineLockClosed,
  HiOutlineMegaphone,
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineGlobeAlt,
  HiOutlineCheckBadge,
  HiOutlineShieldCheck,
  HiOutlineChatBubbleBottomCenterText,
} from "react-icons/hi2";

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const SUPPORT_OPTIONS = [
  {
    amount: 99,
    label: "Supporter",
    impact: "Helps share community awareness materials.",
  },
  {
    amount: 299,
    label: "Contributor",
    impact: "Supports local outreach and engagement.",
  },
  {
    amount: 499,
    label: "Advocate",
    impact: "Helps organize educational awareness programs.",
  },
  {
    amount: 999,
    label: "Champion",
    impact: "Strengthens broader community initiatives.",
  },
];

const IMPACT_AREAS = [
  {
    icon: HiOutlineAcademicCap,
    title: "Awareness",
    text: "Educational resources and information sharing.",
  },
  {
    icon: HiOutlineMegaphone,
    title: "Outreach",
    text: "Local organizing and community engagement.",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Community Support",
    text: "Programs that strengthen participation and connection.",
  },
];

export default function DonationsPage() {
  const [amount, setAmount] = useState(299);
  const [oneTimeMessage, setOneTimeMessage] = useState("");
  const [monthlyMessage, setMonthlyMessage] = useState("");
  const [isOneTimeLoading, setIsOneTimeLoading] = useState(false);
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(false);
  const [publicVisibility, setPublicVisibility] = useState<
    "private" | "public" | "anonymous"
  >("public");
  const [publicDisplayName, setPublicDisplayName] = useState("");
  const [supporterMessage, setSupporterMessage] = useState("");

  const formattedAmount = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount || 0),
    [amount],
  );

  const createOneTime = async () => {
    if (!Number.isFinite(amount) || amount < 99) {
      setOneTimeMessage(
        "Contribution starts at Rs. 99. Please enter an amount of Rs. 99 or more.",
      );
      return;
    }

    setIsOneTimeLoading(true);
    setOneTimeMessage("Preparing secure checkout...");

    try {
      const res = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          publicVisibility,
          publicDisplayName,
          supporterMessage,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setOneTimeMessage(
          data.error ||
            "We could not start your contribution. Please try again.",
        );
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setOneTimeMessage(
          "The secure checkout could not load. Please try again in a moment.",
        );
        return;
      }

      const order = data.data.order;
      const rz = new window.Razorpay({
        key: data.data.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "VRPS",
        description: "Support VRPS Community Initiatives",
        order_id: order.id,
        handler: () => {
          setOneTimeMessage(
            "Thank you for supporting VRPS. Your contribution will be reflected shortly.",
          );
        },
        modal: {
          ondismiss: () =>
            setOneTimeMessage(
              "No contribution was made. You can continue whenever you are ready.",
            ),
        },
        notes: order.notes,
        theme: { color: "#6A160A" },
      });

      rz.on("payment.failed", () => {
        setOneTimeMessage(
          "We could not complete the contribution. Please try again or use another payment method.",
        );
      });

      rz.open();
    } catch {
      setOneTimeMessage(
        "Something went wrong while preparing your contribution. Please try again.",
      );
    } finally {
      setIsOneTimeLoading(false);
    }
  };

  const createMonthly = async () => {
    setIsMonthlyLoading(true);
    setMonthlyMessage("Preparing monthly support...");
    try {
      const res = await fetch("/api/donations/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicVisibility,
          publicDisplayName,
          supporterMessage,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setMonthlyMessage(
          data.error || "We could not start monthly support. Please try again.",
        );
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setMonthlyMessage(
          "The secure checkout could not load. Please try again in a moment.",
        );
        return;
      }

      const rz = new window.Razorpay({
        key: data.data.keyId,
        subscription_id: data.data.subscription.id,
        name: "VRPS",
        description: "Monthly Support for VRPS Initiatives",
        handler: () => {
          setMonthlyMessage(
            "Thank you. Your monthly support has been authorized and will help sustain long-term initiatives.",
          );
        },
        modal: {
          ondismiss: () =>
            setMonthlyMessage(
              "Monthly support was not started. You can continue whenever you are ready.",
            ),
        },
        theme: { color: "#0F5F54" },
      });

      rz.on("payment.failed", () => {
        setMonthlyMessage(
          "We could not authorize monthly support. Please try again or use another payment method.",
        );
      });

      rz.open();
    } catch {
      setMonthlyMessage(
        "Something went wrong while preparing monthly support. Please try again.",
      );
    } finally {
      setIsMonthlyLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] px-4 py-8 md:px-8 md:py-12">
      <section className="mx-auto max-w-6xl">
        {/* Hero Banner */}
        <div className="mb-8 rounded-2xl border border-[#e4c69d] bg-white/85 p-6 shadow-[0_20px_40px_-24px_rgba(90,28,22,0.45)] backdrop-blur md:p-8">
          <p className="mb-2 inline-block rounded-full bg-[#6A160A] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Support VRPS
          </p>
          <h1 className="text-3xl font-black leading-tight text-[#3d120d] md:text-4xl">
            Help Turn Community Support Into Action
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5a3a2e] md:text-base">
            Every contribution helps expand awareness, outreach, and community
            programs. Giving is always optional and is separate from VRPS
            membership.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {IMPACT_AREAS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex gap-3 rounded-xl border border-[#eddcc8] bg-[#fffaf4] p-3"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#0F5F54]" />
                <div>
                  <p className="text-sm font-bold text-[#3d120d]">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#6a4a3b]">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5 items-start">
          {/* Left Column: Focused Amount Selection Sidebar */}
          <aside className="rounded-2xl border border-[#e4c69d] bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold text-[#4a160f]">
              Select Contribution
            </h2>
            <p className="mt-1 text-sm text-[#6a4a3b]">
              Choose a preset amount or enter your custom gift.
            </p>

            <div className="mt-4 space-y-2">
              {SUPPORT_OPTIONS.map((option) => (
                <button
                  key={option.amount}
                  type="button"
                  onClick={() => setAmount(option.amount)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    amount === option.amount
                      ? "border-[#6A160A] bg-[#fff3e5] shadow-sm"
                      : "border-[#e7d1ba] bg-white hover:bg-[#fffaf4]"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-[#4a160f]">
                      {option.label}
                    </span>
                    <span className="text-sm font-black text-[#6A160A]">
                      Rs. {option.amount}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-[#7a5b4c]">
                    {option.impact}
                  </span>
                </button>
              ))}
            </div>

            <label className="mt-5 block text-sm font-semibold text-[#4a160f]">
              Custom Amount (INR)
            </label>
            <input
              type="number"
              min={99}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-[#d9b892] bg-white px-3 py-2 text-base font-bold text-[#34120e] outline-none ring-[#6A160A] focus:ring-2"
            />

            <div className="mt-5 rounded-xl bg-[#fff3e5] p-4 border border-[#eddcc8] text-center">
              <p className="text-xs uppercase tracking-wider font-bold text-[#8a5b3a]">
                Selected Contribution
              </p>
              <p className="text-3xl font-black text-[#6A160A] mt-0.5">
                {formattedAmount}
              </p>
            </div>
          </aside>

          {/* Right Column: Visibility Bar + Action Cards */}
          <div className="space-y-6 lg:col-span-3">
            {/* Sleek Horizontal Visibility Segment Bar (No Scrolling Required!) */}
            <div className="rounded-2xl border border-[#cce3dc] bg-white p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#3d120d] flex items-center gap-1.5">
                    <HiOutlineSparkles className="h-5 w-5 text-[#0F5F54]" />
                    Supporter Listing Preference
                  </h3>
                  <p className="text-xs text-[#6a4a3b] mt-0.5">
                    Choose how your support appears on the community roll.
                  </p>
                </div>

                {/* Horizontal Segment Pills */}
                <div className="inline-flex rounded-xl bg-[#f0f7f5] p-1 border border-[#cce3dc] shrink-0">
                  {[
                    { id: "public", label: "Public", icon: HiOutlineGlobeAlt },
                    { id: "anonymous", label: "Anonymous", icon: HiOutlineUser },
                    { id: "private", label: "Private", icon: HiOutlineLockClosed },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const selected = publicVisibility === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPublicVisibility(tab.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selected
                            ? "bg-[#0F5F54] text-white shadow-sm"
                            : "text-[#486a63] hover:text-[#0F5F54]"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Note & Display Name Input Fields when Public */}
              {publicVisibility === "public" && (
                <div className="mt-3 grid gap-3 pt-3 border-t border-[#cce3dc] sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#5A1C16] mb-1">
                      Display Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={publicDisplayName}
                      onChange={(e) => setPublicDisplayName(e.target.value)}
                      placeholder="Defaults to profile name"
                      className="w-full rounded-lg border border-[#dcc9a8] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5F54]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5A1C16] mb-1">
                      Supporter Message (Optional)
                    </label>
                    <input
                      type="text"
                      value={supporterMessage}
                      onChange={(e) => setSupporterMessage(e.target.value)}
                      placeholder="Share why you support VRPS (max 160 chars)"
                      maxLength={160}
                      className="w-full rounded-lg border border-[#dcc9a8] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5F54]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-[#e7d1ba] bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3e5] text-[#6A160A] mb-3">
                    <HiOutlineHeart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#3d120d]">
                    One-time Contribution
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6a4a3b]">
                    Offer direct support today and help fund active awareness and outreach campaigns.
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={createOneTime}
                    disabled={isOneTimeLoading}
                    className="w-full rounded-lg bg-[#6A160A] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#561007] disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
                  >
                    {isOneTimeLoading
                      ? "Preparing checkout..."
                      : `Contribute ${formattedAmount}`}
                  </button>
                  {oneTimeMessage && (
                    <p className="mt-3 rounded-md bg-[#fff3e5] p-3 text-xs leading-relaxed text-[#5b2a1f]">
                      {oneTimeMessage}
                    </p>
                  )}
                </div>
              </article>

              <article className="rounded-2xl border border-[#cce3dc] bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f7f5] text-[#0F5F54] mb-3">
                    <HiOutlineUserGroup className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F5F54]">
                    Monthly Sustaining Supporter
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#486a63]">
                    Provide reliable monthly support that sustains long-term student welfare and outreach initiatives.
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={createMonthly}
                    disabled={isMonthlyLoading}
                    className="w-full rounded-lg bg-[#0F5F54] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0D4A42] disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
                  >
                    {isMonthlyLoading
                      ? "Preparing monthly support..."
                      : "Become Monthly Supporter"}
                  </button>
                  {monthlyMessage && (
                    <p className="mt-3 rounded-md bg-[#eaf7f3] p-3 text-xs leading-relaxed text-[#23574f]">
                      {monthlyMessage}
                    </p>
                  )}
                </div>
              </article>

              <div className="md:col-span-2 rounded-xl bg-white p-4 border border-[#eddcc8] text-center">
                <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#7a5b4c]">
                  <HiOutlineShieldCheck className="h-4 w-4 text-[#0F5F54]" />
                  100% Secure Checkout. Contributions are optional and separate from membership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
