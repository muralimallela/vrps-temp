"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiOutlineShieldCheck,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineLockClosed,
} from "react-icons/hi2";

export interface ConsentPreferences {
  essential: boolean; // Always true
  analytics: boolean;
  functional: boolean;
  decidedAt: string;
  version: string;
}

const CONSENT_STORAGE_KEY = "vrps_consent_preferences";
const CURRENT_VERSION = "v1.0-2026-08";

export default function CookieConsentBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    functional: false,
    decidedAt: "",
    version: CURRENT_VERSION,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) {
        setIsOpen(true);
      } else {
        const parsed = JSON.parse(stored) as ConsentPreferences;
        setPreferences(parsed);
        if (parsed.version !== CURRENT_VERSION) {
          setIsOpen(true);
        }
      }
    } catch {
      setIsOpen(true);
    }

    // Listen for custom open event (e.g. from Footer link)
    const handleOpenSettings = () => {
      setIsModalOpen(true);
      setIsOpen(false);
    };

    window.addEventListener("vrps-open-cookie-settings", handleOpenSettings);
    return () => {
      window.removeEventListener("vrps-open-cookie-settings", handleOpenSettings);
    };
  }, []);

  const savePreferences = async (newPrefs: ConsentPreferences) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newPrefs));
      setPreferences(newPrefs);
      setIsOpen(false);
      setIsModalOpen(false);

      // Dispatch global event for trackers/scripts
      window.dispatchEvent(
        new CustomEvent("vrps-consent-updated", { detail: newPrefs })
      );

      // Asynchronously log to server
      fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purposeKey: "cookie_and_tracking_consent",
          status: newPrefs.analytics || newPrefs.functional ? "granted" : "withdrawn",
          consentTextVersion: CURRENT_VERSION,
          notes: JSON.stringify({
            analytics: newPrefs.analytics,
            functional: newPrefs.functional,
          }),
        }),
      }).catch(() => {
        // Non-blocking log
      });
    } catch (e) {
      console.error("Failed to save consent:", e);
    }
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      functional: true,
      decidedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    });
  };

  const handleRejectNonEssential = () => {
    savePreferences({
      essential: true,
      analytics: false,
      functional: false,
      decidedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    });
  };

  const handleSaveCustom = () => {
    savePreferences({
      ...preferences,
      essential: true,
      decidedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    });
  };

  return (
    <>
      {/* Floating Bottom Banner */}
      {isOpen && (
        <aside
          role="region"
          aria-label="Privacy and Cookie Consent"
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-[#EECDA3] bg-[#FFFDF9]/95 p-5 shadow-[0_20px_50px_rgba(43,9,4,0.25)] backdrop-blur-md transition-all duration-300 md:p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 pr-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5A1C16] text-white shrink-0">
                  <HiOutlineShieldCheck className="h-4 w-4" />
                </span>
                <h2 className="text-base font-bold text-[#5A1C16]">
                  Privacy & Consent
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-[#5A3A2E]">
                We comply with the Digital Personal Data Protection (DPDP) Act 2023.
                Essential cookies are used for authentication and security. Analytics
                and functional trackers are enabled only with your consent.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="rounded-md bg-[#5A1C16] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#3d120d] focus:outline-none focus:ring-2 focus:ring-[#5A1C16]/30 shadow-sm"
                >
                  Manage Consent
                </button>
                <Link
                  href="/privacy"
                  className="text-xs font-semibold text-[#6A160A] underline underline-offset-2 hover:text-[#3d120d]"
                >
                  Privacy Notice
                </Link>
                <Link
                  href="/data-rights"
                  className="text-xs font-semibold text-[#6A160A] underline underline-offset-2 hover:text-[#3d120d]"
                >
                  Data Rights
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="rounded-xl border border-[#EECDA3] bg-white px-3.5 py-2 text-xs font-bold text-[#5A1C16] transition hover:bg-[#FFF3E5]"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-xl bg-[#5A1C16] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#3E120F]"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Granular Preference Customization Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#EECDA3] bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF3E5] text-[#5A1C16]">
                  <HiOutlineShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#3D120D]">
                    Privacy & Tracker Preferences
                  </h3>
                  <p className="text-xs text-gray-500">
                    DPDP Act 2023 Granular Opt-in Controls
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-gray-700">
              {/* Essential */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <HiOutlineLockClosed className="h-3.5 w-3.5 text-emerald-600" />
                      Essential Platform & Security (Strictly Necessary)
                    </span>
                    <p className="mt-1 text-gray-600 leading-relaxed">
                      Required for Clerk secure authentication, session security, CSRF protection, and language routing. Cannot be disabled.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    Always Active
                  </span>
                </div>
              </div>

              {/* Analytics */}
              <div className="rounded-2xl border border-[#EECDA3] bg-[#FFFDF9] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-[#5A1C16]">
                      Performance & Usage Analytics
                    </span>
                    <p className="mt-1 text-[#6A4A3B] leading-relaxed">
                      Helps us understand visitor traffic and optimize page speed and community engagement anonymously.
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center shrink-0">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#0F5F54] peer-focus:ring-2 peer-focus:ring-[#0F5F54]/30 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>

              {/* Functional / External */}
              <div className="rounded-2xl border border-[#EECDA3] bg-[#FFFDF9] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-[#5A1C16]">
                      External Content & Third-Party Media
                    </span>
                    <p className="mt-1 text-[#6A4A3B] leading-relaxed">
                      Enables rich embeds, dynamic media widgets, and social sharing links.
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center shrink-0">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) =>
                        setPreferences({ ...preferences, functional: e.target.checked })
                      }
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#0F5F54] peer-focus:ring-2 peer-focus:ring-[#0F5F54]/30 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Reject All Non-Essential
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex items-center gap-1.5 rounded-xl bg-[#5A1C16] px-4 py-2 text-xs font-bold text-white hover:bg-[#3E120F]"
              >
                <HiOutlineCheck className="h-4 w-4" />
                Save My Choices
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
