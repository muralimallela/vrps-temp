"use client";

import { useMemo, useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineHeart,
  HiOutlineLockClosed,
  HiOutlineMegaphone,
  HiOutlineUserGroup,
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
  >("private");
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
        "Support starts at Rs. 99. Please choose an amount of Rs. 99 or more.",
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

        <div className="grid gap-6 lg:grid-cols-5">
          <aside className="rounded-2xl border border-[#e4c69d] bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold text-[#4a160f]">
              Choose your impact
            </h2>
            <p className="mt-1 text-sm text-[#6a4a3b]">
              Select an amount or enter your own one-time contribution.
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
              Choose another amount
            </label>
            <input
              type="number"
              min={99}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-[#d9b892] bg-white px-3 py-2 text-base text-[#34120e] outline-none ring-[#6A160A] focus:ring-2"
            />

            <div className="mt-5 rounded-lg bg-[#fff3e5] p-3">
              <p className="text-xs uppercase tracking-wide text-[#8a5b3a]">
                Your contribution
              </p>
              <p className="text-2xl font-black text-[#6A160A]">
                {formattedAmount}
              </p>
            </div>

            <div className="mt-6 rounded-lg border border-[#cce3dc] bg-[#f0f7f5] p-5">
              <h4 className="font-semibold text-[#0F5F54] mb-3 flex items-center gap-2">
                <span className="text-lg">❤️</span> Share Your Support
              </h4>
              <p className="text-xs text-[#486a63] mb-4">
                Help inspire others by sharing your support. Your visibility preference is optional and you can change it anytime.
              </p>
              
              <div className="space-y-3">
                <label className="flex items-start p-3 border-2 rounded-lg cursor-pointer transition border-[#e8d4b8] bg-white hover:bg-[#fffaf4]" 
                  onClick={() => setPublicVisibility("private")}>
                  <input
                    type="radio"
                    name="donationVisibility"
                    checked={publicVisibility === "private"}
                    onChange={() => setPublicVisibility("private")}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[#5A1C16]">🔒 Private</p>
                    <p className="text-xs text-[#8B6F47]">Not listed publicly</p>
                  </div>
                </label>

                <label className="flex items-start p-3 border-2 rounded-lg cursor-pointer transition border-[#e8d4b8] bg-white hover:bg-[#fffaf4]"
                  onClick={() => setPublicVisibility("anonymous")}>
                  <input
                    type="radio"
                    name="donationVisibility"
                    checked={publicVisibility === "anonymous"}
                    onChange={() => setPublicVisibility("anonymous")}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[#5A1C16]">😊 Anonymous</p>
                    <p className="text-xs text-[#8B6F47]">Show amount without revealing your identity</p>
                  </div>
                </label>

                <label className="flex items-start p-3 border-2 rounded-lg cursor-pointer transition" 
                  style={{
                    borderColor: publicVisibility === "public" ? "#0F5F54" : "#e8d4b8",
                    backgroundColor: publicVisibility === "public" ? "#f5e6cf" : "white",
                  }}
                  onClick={() => setPublicVisibility("public")}>
                  <input
                    type="radio"
                    name="donationVisibility"
                    checked={publicVisibility === "public"}
                    onChange={() => setPublicVisibility("public")}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[#5A1C16]">👁️ Public</p>
                    <p className="text-xs text-[#8B6F47]">Show your name and contribution publicly</p>
                  </div>
                </label>
              </div>

              {publicVisibility === "public" && (
                <div className="mt-4 p-3 bg-[#ffe6bf] rounded-lg border border-[#e8d4b8] space-y-3">
                  <label className="block">
                    <p className="text-xs font-semibold text-[#5A1C16] mb-1">Display Name (Optional)</p>
                    <input
                      type="text"
                      value={publicDisplayName}
                      onChange={(e) => setPublicDisplayName(e.target.value)}
                      placeholder="Leave blank to use first name + last initial"
                      className="w-full px-3 py-2 border border-[#dcc9a8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F54] text-[#2B0904] text-sm"
                    />
                    <p className="text-xs text-[#8B6F47] mt-1">How your name will appear in community listings</p>
                  </label>

                  <label className="block">
                    <p className="text-xs font-semibold text-[#5A1C16] mb-1">Message (Optional)</p>
                    <textarea
                      value={supporterMessage}
                      onChange={(e) => setSupporterMessage(e.target.value)}
                      placeholder="Share why you support our community (max 160 chars)"
                      maxLength={160}
                      className="w-full px-3 py-2 border border-[#dcc9a8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F54] text-[#2B0904] text-sm resize-none h-16"
                    />
                    <p className="text-xs text-[#8B6F47] mt-1">{supporterMessage.length}/160 characters</p>
                  </label>
                </div>
              )}
            </div>
          </aside>

          <div className="grid gap-6 md:grid-cols-2 lg:col-span-3">
            <article className="rounded-2xl border border-[#e7d1ba] bg-white p-5 shadow-sm">
              <HiOutlineHeart className="h-7 w-7 text-[#6A160A]" />
              <h3 className="mt-3 text-lg font-bold text-[#3d120d]">
                Make a one-time contribution
              </h3>
              <p className="mt-2 min-h-16 text-sm leading-relaxed text-[#6a4a3b]">
                Offer support today and help advance current community
                initiatives.
              </p>
              <button
                onClick={createOneTime}
                disabled={isOneTimeLoading}
                className="mt-4 w-full rounded-lg bg-[#6A160A] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#561007] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isOneTimeLoading
                  ? "Preparing secure checkout..."
                  : "Support VRPS Today"}
              </button>
              {oneTimeMessage && (
                <p className="mt-3 rounded-md bg-[#fff3e5] p-3 text-xs leading-relaxed text-[#5b2a1f]">
                  {oneTimeMessage}
                </p>
              )}
            </article>

            <article className="rounded-2xl border border-[#cce3dc] bg-white p-5 shadow-sm">
              <HiOutlineUserGroup className="h-7 w-7 text-[#0f5f54]" />
              <h3 className="mt-3 text-lg font-bold text-[#0f5f54]">
                Become a monthly supporter
              </h3>
              <p className="mt-2 min-h-16 text-sm leading-relaxed text-[#486a63]">
                Provide reliable support that helps sustain outreach and
                long-term programs. Your recurring amount is shown clearly
                before you authorize it.
              </p>
              <button
                onClick={createMonthly}
                disabled={isMonthlyLoading}
                className="mt-4 w-full rounded-lg bg-[#0f5f54] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0b4c43] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isMonthlyLoading
                  ? "Preparing monthly support..."
                  : "Start Monthly Support"}
              </button>
              {monthlyMessage && (
                <p className="mt-3 rounded-md bg-[#eaf7f3] p-3 text-xs leading-relaxed text-[#23574f]">
                  {monthlyMessage}
                </p>
              )}
            </article>

            <p className="flex items-center justify-center gap-1.5 text-xs text-[#7a5b4c] md:col-span-2">
              <HiOutlineLockClosed className="h-4 w-4 text-[#0F5F54]" />
              Secure checkout. Donations are optional and separate from
              membership.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
