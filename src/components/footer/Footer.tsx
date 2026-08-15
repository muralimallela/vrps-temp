"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";
import { MdEmail, MdSecurity } from "react-icons/md";
import { HiOutlineShieldCheck, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consentGranted, setConsentGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGranted) {
      setFeedback({
        type: "error",
        text: "Please agree to the data processing consent checkbox to submit your message.",
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, message, consentGranted }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", text: data.message || "Message submitted successfully." });
        setFirstName("");
        setEmail("");
        setMessage("");
        setConsentGranted(false);
      } else {
        setFeedback({ type: "error", text: data.error || "Failed to submit message." });
      }
    } catch {
      setFeedback({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCookieSettings = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("vrps-open-cookie-settings"));
    }
  };

  return (
    <footer className="bg-[#ffe6bf] text-[#2B0904]">
      <div className="py-12 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
          {/* Left Side - Contact Info & Grievance Redressal */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#5A1C16] mb-4">
              {t("contactUs")}
            </h2>
            <p className="text-[#2B0904] mb-6 leading-relaxed">{t("introText")}</p>

            {/* Email */}
            <div className="flex items-center gap-3 mb-3">
              <FaEnvelope className="text-[#5A1C16] text-lg shrink-0" />
              <a href="mailto:vaddera@gmail.com" className="text-[#2B0904] hover:underline font-medium">
                vaddera@gmail.com
              </a>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 mb-6">
              <FaPhoneAlt className="text-[#5A1C16] text-lg shrink-0" />
              <a href="tel:9876543210" className="text-[#2B0904] hover:underline font-medium">
                +91 9876543210
              </a>
            </div>

            {/* Grievance Redressal Officer Contact Box (DPDP Act 2023 Mandate) */}
            <div className="mb-6 rounded-2xl border border-[#e4c69d] bg-white/70 p-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#5A1C16] mb-1.5">
                <MdSecurity className="h-4 w-4 text-[#0F5F54]" />
                <span>Grievance Redressal & Data Protection Officer</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>Officer:</strong> Administrative Nodal Officer, VRPS
              </p>
              <p className="text-gray-700">
                <strong>Official Email:</strong>{" "}
                <a href="mailto:vaddera@gmail.com" className="text-[#5A1C16] underline font-medium">
                  vaddera@gmail.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Statutory SLA:</strong> Acknowledgement in 48h | Resolution within 30 days
              </p>
              <Link
                href="/data-rights"
                className="mt-2 inline-flex items-center gap-1 font-bold text-[#0F5F54] hover:underline"
              >
                <HiOutlineShieldCheck className="h-3.5 w-3.5" />
                Submit DPDP Data Rights / Grievance Request →
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 text-2xl text-[#5A1C16]">
              <a href="#" aria-label="Instagram" className="hover:opacity-80"><FaInstagram /></a>
              <a href="#" aria-label="Facebook" className="hover:opacity-80"><FaFacebook /></a>
              <a href="#" aria-label="WhatsApp" className="hover:opacity-80"><FaWhatsapp /></a>
              <a href="mailto:vaddera@gmail.com" aria-label="Email" className="hover:opacity-80"><MdEmail /></a>
            </div>
          </div>

          {/* Right Side - Contact Form with DPDP Opt-In Consent */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-[#e4c69d]/50">
            <h3 className="text-xl font-semibold text-[#5A1C16] mb-2">
              {t("formTitle")}
            </h3>
            <p className="text-[#5A1C16] text-xs mb-6">{t("formSubtitle")}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#5A1C16] mb-1">
                  {t("firstName")} *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1C16] bg-gray-50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#5A1C16] mb-1">
                  {t("email")} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1C16] bg-gray-50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#5A1C16] mb-1">
                  {t("message")} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you?"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1C16] bg-gray-50 text-sm"
                ></textarea>
              </div>

              {/* DPDP Act 2023 Opt-in Consent Checkbox (Unticked by default) */}
              <div className="rounded-xl border border-[#e4c69d] bg-[#FFFDF9] p-3 text-xs text-[#5A3A2E]">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGranted}
                    onChange={(e) => setConsentGranted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#d9b892] text-[#6A160A] focus:ring-[#6A160A]"
                  />
                  <span className="leading-relaxed">
                    <strong className="text-[#3D120D]">* Required:</strong> I consent to VRPS collecting and processing my name, email, and inquiry details to respond to my request in accordance with the{" "}
                    <Link href="/privacy" target="_blank" className="font-semibold text-[#6A160A] underline">
                      Privacy Notice
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {feedback && (
                <div
                  className={`rounded-lg p-3 text-xs leading-relaxed ${
                    feedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5A1C16] text-white px-6 py-2.5 rounded-lg hover:bg-[#3E120F] transition font-bold text-sm disabled:opacity-70"
              >
                {loading ? "Submitting..." : t("submit")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Legal Links, Cookie Settings & Copyright */}
      <div className="bg-[#EECDA3] py-6 px-4 text-center text-xs text-[#5A1C16]">
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-3 font-semibold">
          <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:underline">Privacy Notice (DPDP)</Link>
          <span>•</span>
          <Link href="/data-rights" className="hover:underline">Data Rights Request</Link>
          <span>•</span>
          <Link href="/payment-policy" className="hover:underline">Payment & Refund Policy</Link>
          <span>•</span>
          <button
            type="button"
            onClick={handleOpenCookieSettings}
            className="inline-flex items-center gap-1 text-[#5A1C16] hover:underline"
          >
            <HiOutlineAdjustmentsHorizontal className="h-3.5 w-3.5" />
            Cookie & Privacy Preferences
          </button>
        </div>
        <p className="text-[11px] text-gray-700">
          © {new Date().getFullYear()} {t("copyright")}{" "}
          <a
            href="https://vaddera.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#5A1C16] font-medium"
          >
            vaddera.org
          </a>{" "}
          | Compliant with Digital Personal Data Protection Act 2023 (India)
        </p>
      </div>
    </footer>
  );
}
