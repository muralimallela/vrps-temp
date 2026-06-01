"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineCheckCircle,
  HiOutlineIdentification,
  HiOutlineLockClosed,
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
  HiOutlineCheckBadge,
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

const MEMBERSHIP_OPTIONS = [
  { amount: 99, label: "Membership", note: "Start your membership" },
  { amount: 199, label: "Member Plus", note: "Join and support outreach" },
  {
    amount: 499,
    label: "Community Supporter",
    note: "Help expand local programs",
  },
  {
    amount: 999,
    label: "Movement Champion",
    note: "Make a larger contribution",
  },
];

const BENEFITS = [
  {
    icon: HiOutlineIdentification,
    title: "Digital Member ID",
    text: "View and download your verified VRPS Member ID Card.",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Stay Connected",
    text: "Be part of a growing community working toward shared goals.",
  },
  {
    icon: HiOutlineCheckCircle,
    title: "Member Access",
    text: "Manage your profile and access member-only features as they grow.",
  },
];

export default function MembershipPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(99);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicVisibility, setPublicVisibility] = useState<
    "private" | "public" | "anonymous"
  >("private");
  const [publicDisplayName, setPublicDisplayName] = useState("");

  const formattedAmount = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount || 0),
    [amount],
  );

  const activateMembership = async () => {
    if (!Number.isFinite(amount) || amount < 99) {
      setMessage(
        "Membership starts at Rs. 99. Please choose an amount of Rs. 99 or more.",
      );
      return;
    }

    setLoading(true);
    setMessage("Preparing your membership...");

    try {
      const res = await fetch("/api/membership/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, publicVisibility, publicDisplayName }),
      });
      const data = await res.json();
      if (!data.success) {
        const errorMessage =
          data.error || "We could not start your membership. Please try again.";
        if (errorMessage.toLowerCase().includes("complete address")) {
          setMessage(
            "Please complete your address so we can prepare your Member ID Card. Redirecting you now...",
          );
          setTimeout(() => router.push("/address"), 1000);
          return;
        }
        setMessage(errorMessage);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setMessage(
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
        description: "Activate VRPS Membership",
        order_id: order.id,
        notes: order.notes,
        handler: () => {
          setMessage(
            "Thank you for joining VRPS. Your membership is being activated and should be ready within a few seconds.",
          );
        },
        modal: {
          ondismiss: () =>
            setMessage(
              "Your membership has not been activated yet. You can continue whenever you are ready.",
            ),
        },
        theme: { color: "#6A160A" },
      });

      rz.on("payment.failed", () => {
        setMessage(
          "We could not complete the payment. Please try again or use another payment method.",
        );
      });

      rz.open();
    } catch {
      setMessage(
        "Something went wrong while preparing your membership. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] px-4 py-8 md:px-8 md:py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl border border-[#e4c69d] bg-white/85 p-6 shadow-[0_20px_40px_-24px_rgba(90,28,22,0.45)] backdrop-blur md:p-8">
          <p className="mb-2 inline-block rounded-full bg-[#6A160A] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Join VRPS
          </p>
          <h1 className="text-3xl font-black leading-tight text-[#3d120d] md:text-4xl">
            Become a Member. Strengthen the Movement.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5a3a2e] md:text-base">
            Join a community working for representation, opportunity, and
            progress. Membership starts at Rs. 99 and gives you a verified
            digital Member ID Card.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
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
              Choose your contribution
            </h2>
            <p className="mt-1 text-sm text-[#6a4a3b]">
              Membership starts at Rs. 99. A higher amount helps support
              community programs.
            </p>

            <div className="mt-4 space-y-2">
              {MEMBERSHIP_OPTIONS.map((option) => (
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
                  <span className="mt-1 block text-xs text-[#7a5b4c]">
                    {option.note}
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
          </aside>

          <div className="rounded-2xl border border-[#e7d1ba] bg-white p-5 shadow-sm lg:col-span-3">
            <h3 className="text-xl font-bold text-[#3d120d]">
              Activate your membership
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6a4a3b]">
              We use your address to prepare your Member ID Card. Make sure your
              details are complete, then activate your membership with secure
              checkout.
            </p>
            <Link
              href="/address"
              className="mt-3 inline-block rounded-md border border-[#eddcc8] bg-[#fff3e5] px-3 py-1.5 text-xs font-semibold text-[#6A160A] hover:bg-[#fde7cf]"
            >
              Review my address
            </Link>

            <div className="mt-4 rounded-lg border border-[#eddcc8] bg-[#fffaf4] p-4 text-sm text-[#5a3a2e]">
              <p className="font-semibold">What happens next?</p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5">
                <li>Your contribution is securely processed and verified.</li>
                <li>
                  Your membership is activated automatically after confirmation.
                </li>
                <li>
                  Your digital Member ID Card becomes available to view and
                  download.
                </li>
                <li>
                  You can manage your profile and access member-exclusive
                  features.
                </li>
              </ol>
              <p className="mt-3 border-t border-[#eddcc8] pt-3 text-xs text-[#6a4a3b]">
                <strong>Note:</strong> Activation usually happens within a few
                seconds after confirmation.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-[#cce3dc] bg-[#f0f7f5] p-4">
              <div className="mb-4 flex items-center gap-2">
                <HiOutlineSparkles className="h-5 w-5 text-[#0F5F54]" />
                <h4 className="font-semibold text-[#0F5F54]">
                  Membership Visibility
                </h4>
              </div>

              <p className="mb-4 text-xs text-[#486a63]">
                Choose how your membership appears in the community.
              </p>

              <div className="space-y-2">
                {[
                  {
                    id: "private",
                    title: "Private",
                    desc: "Not listed publicly",
                    icon: HiOutlineLockClosed,
                  },
                  {
                    id: "anonymous",
                    title: "Anonymous",
                    desc: "Show support without your name",
                    icon: HiOutlineUser,
                  },
                  {
                    id: "public",
                    title: "Public",
                    desc: "Show your name publicly",
                    icon: HiOutlineGlobeAlt,
                  },
                ].map((option) => {
                  const Icon = option.icon;
                  const selected = publicVisibility === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setPublicVisibility(
                          option.id as "private" | "anonymous" | "public",
                        )
                      }
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        selected
                          ? "border-[#0F5F54] bg-white shadow-sm"
                          : "border-[#e8d4b8] bg-white hover:bg-[#fffaf4]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            selected
                              ? "bg-[#dff1ed] text-[#0F5F54]"
                              : "bg-[#fff3e5] text-[#8B6F47]"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#5A1C16]">
                            {option.title}
                          </p>
                          <p className="text-xs text-[#8B6F47]">
                            {option.desc}
                          </p>
                        </div>

                        {selected && (
                          <HiOutlineCheckBadge className="h-5 w-5 text-[#0F5F54]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {publicVisibility === "public" && (
                <div className="mt-3 rounded-lg border border-[#cce3dc] bg-white p-3">
                  <label>
                    <p className="mb-1 text-xs font-semibold text-[#5A1C16]">
                      Display Name (Optional)
                    </p>

                    <input
                      type="text"
                      value={publicDisplayName}
                      onChange={(e) => setPublicDisplayName(e.target.value)}
                      placeholder="Enter display name"
                      className="w-full rounded-lg border border-[#dcc9a8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F54]"
                    />

                    <p className="mt-1 text-xs text-[#8B6F47]">
                      Leave blank to use your profile name.
                    </p>
                  </label>
                </div>
              )}
            </div>

            <button
              onClick={activateMembership}
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-[#6A160A] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#561007] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Preparing your membership..." : "Activate Membership"}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#7a5b4c]">
              <HiOutlineLockClosed className="h-4 w-4 text-[#0F5F54]" />
              Secure checkout. Your details are protected.
            </p>

            {message && (
              <p className="mt-3 rounded-md bg-[#fff3e5] p-3 text-xs leading-relaxed text-[#5b2a1f]">
                {message}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
