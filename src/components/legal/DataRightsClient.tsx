"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineArrowPath,
  HiOutlineUserPlus,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

const REQUEST_TYPES = [
  {
    id: "access",
    title: "Right to Access (Sec. 11)",
    description: "Request a summary and copy of personal data collected and shared.",
    icon: HiOutlineDocumentText,
  },
  {
    id: "correction",
    title: "Right to Correction (Sec. 12)",
    description: "Request correction of inaccurate or incomplete profile/address information.",
    icon: HiOutlinePencilSquare,
  },
  {
    id: "erasure",
    title: "Right to Erasure (Sec. 12)",
    description: "Request deletion or anonymization of personal data (Right to be Forgotten).",
    icon: HiOutlineTrash,
  },
  {
    id: "withdrawal",
    title: "Withdraw Consent (Sec. 6(4))",
    description: "Withdraw consent for public listing, communications, or non-essential data.",
    icon: HiOutlineArrowPath,
  },
  {
    id: "nomination",
    title: "Right to Nominate (Sec. 14)",
    description: "Nominate a representative to exercise data rights in case of death or incapacity.",
    icon: HiOutlineUserPlus,
  },
  {
    id: "grievance",
    title: "File Grievance (Sec. 13)",
    description: "Submit a formal data protection grievance to the Nodal Grievance Officer.",
    icon: HiOutlineChatBubbleLeftRight,
  },
];

export default function DataRightsClient({ isTelugu = false }: { isTelugu?: boolean }) {
  const [activeTab, setActiveTab] = useState<"submit" | "track">("submit");
  const [requestType, setRequestType] = useState("access");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [details, setDetails] = useState("");
  const [correctionData, setCorrectionData] = useState("");
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeContact, setNomineeContact] = useState("");
  const [consentGranted, setConsentGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [trackRequestId, setTrackRequestId] = useState("");
  const [trackEmail, setTrackEmail] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGranted) {
      setErrorMessage("Please check the consent box to authorize processing of this statutory request.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const nomineeDetails =
        requestType === "nomination"
          ? { nomineeName, nomineeContact }
          : undefined;

      const res = await fetch("/api/data-rights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          membershipId,
          requestType,
          details,
          correctionData: requestType === "correction" ? correctionData : undefined,
          nomineeDetails,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedResult(data.data);
      } else {
        setErrorMessage(data.error || "Failed to submit data rights request.");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackRequestId.trim() || !trackEmail.trim()) {
      setTrackError("Both Request ID and Email are required.");
      return;
    }

    setTrackLoading(true);
    setTrackError("");
    setTrackResult(null);

    try {
      const res = await fetch(
        `/api/data-rights?requestId=${encodeURIComponent(
          trackRequestId.trim()
        )}&email=${encodeURIComponent(trackEmail.trim())}`
      );
      const data = await res.json();
      if (data.success) {
        setTrackResult(data.data);
      } else {
        setTrackError(data.error || "No matching request found.");
      }
    } catch {
      setTrackError("Failed to look up request.");
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] px-4 py-8 md:px-8 md:py-12 text-[#2B0904]">
      <div className="mx-auto max-w-4xl">
        {/* Banner */}
        <header className="mb-8 rounded-3xl border border-[#e4c69d] bg-white p-6 shadow-xl md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F5F54] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <HiOutlineShieldCheck className="h-4 w-4" />
              DPDP Act 2023 Statutory Portal
            </span>
          </div>

          <h1 className="text-3xl font-black text-[#3d120d] md:text-4xl">
            {isTelugu ? "డేటా హక్కులు & ఫిర్యాదుల పరిష్కార వేదిక" : "Data Principal Rights & Grievance Portal"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5a3a2e] md:text-base">
            {isTelugu
              ? "డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ (DPDP) చట్టం 2023 క్రింద మీ వ్యక్తిగత డేటా సమాచారం, సవరణ, తొలగింపు మరియు చట్టబద్ధమైన హక్కుల వినియోగానికి అధికారిక వేదిక."
              : "Under the Digital Personal Data Protection (DPDP) Act, 2023, you have full authority to request access to, correction of, or erasure of your personal data, or nominate a representative and lodge grievances."}
          </p>

          <div className="mt-6 flex gap-2 border-b border-[#eddcc8] pb-1">
            <button
              type="button"
              onClick={() => setActiveTab("submit")}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition ${
                activeTab === "submit"
                  ? "bg-[#5A1C16] text-white"
                  : "text-[#5A1C16] hover:bg-[#fff3e5]"
              }`}
            >
              Submit New Request
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("track")}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition ${
                activeTab === "track"
                  ? "bg-[#5A1C16] text-white"
                  : "text-[#5A1C16] hover:bg-[#fff3e5]"
              }`}
            >
              Track Existing Request
            </button>
          </div>
        </header>

        {activeTab === "submit" && (
          <div className="rounded-3xl border border-[#e4c69d] bg-white p-6 shadow-xl md:p-10">
            {submittedResult ? (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner">
                  <HiOutlineCheckCircle className="h-12 w-12" />
                </div>
                <h2 className="text-2xl font-black text-[#3d120d]">
                  Request Submitted Successfully
                </h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Your request has been logged into our DPDP compliance records. Our Grievance Redressal Officer will process your request within the statutory 30-day timeline.
                </p>

                <div className="my-6 inline-block rounded-2xl border border-[#cce3dc] bg-[#f0f7f5] p-5 text-left max-w-md w-full">
                  <p className="text-xs font-bold text-gray-500 uppercase">Your Tracking Reference ID</p>
                  <p className="text-xl font-black text-[#0F5F54] select-all tracking-wider font-mono">
                    {submittedResult.requestId}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#cce3dc] text-xs text-[#2b4c44] space-y-1">
                    <p><strong>Request Type:</strong> {submittedResult.requestType}</p>
                    <p><strong>Statutory SLA:</strong> {submittedResult.slaDays} Calendar Days</p>
                    <p><strong>Officer Contact:</strong> {submittedResult.grievanceEmail}</p>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedResult(null);
                      setDetails("");
                      setConsentGranted(false);
                    }}
                    className="rounded-xl bg-[#5A1C16] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#3E120F]"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#5A1C16] mb-1">
                    1. Select Right to Exercise
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Choose the specific DPDP Act statutory right you wish to exercise:
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {REQUEST_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = requestType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setRequestType(type.id)}
                          className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                            isSelected
                              ? "border-[#5A1C16] bg-[#FFF3E5] ring-2 ring-[#5A1C16]/20 shadow-sm"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <Icon className={`h-6 w-6 shrink-0 mt-0.5 ${isSelected ? "text-[#5A1C16]" : "text-gray-400"}`} />
                          <div>
                            <p className={`text-xs font-bold ${isSelected ? "text-[#5A1C16]" : "text-gray-800"}`}>
                              {type.title}
                            </p>
                            <p className="mt-0.5 text-[11px] text-gray-500 leading-snug">
                              {type.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#5A1C16] mb-3">
                    2. Data Principal Contact Details
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div>
                      <label className="block font-semibold text-[#5A1C16] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name as registered with VRPS"
                        className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A1C16]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#5A1C16] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A1C16]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#5A1C16] mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A1C16]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#5A1C16] mb-1">
                        Member ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={membershipId}
                        onChange={(e) => setMembershipId(e.target.value)}
                        placeholder="VRPS-2026-XXXX"
                        className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A1C16]"
                      />
                    </div>
                  </div>
                </div>

                {requestType === "correction" && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-xs">
                    <label className="block font-bold text-blue-900 mb-1">
                      Proposed Corrections
                    </label>
                    <p className="text-[11px] text-blue-700 mb-2">
                      Please specify exactly which fields (name, phone, address) should be corrected and the new values.
                    </p>
                    <textarea
                      rows={3}
                      value={correctionData}
                      onChange={(e) => setCorrectionData(e.target.value)}
                      placeholder="e.g. Correct District from Medchal to Hyderabad; Correct Village name to ..."
                      className="w-full rounded-xl border border-blue-200 bg-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                    ></textarea>
                  </div>
                )}

                {requestType === "nomination" && (
                  <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 text-xs space-y-3">
                    <div>
                      <p className="font-bold text-purple-900">
                        Nominee Details (DPDP Act Sec. 14)
                      </p>
                      <p className="text-[11px] text-purple-700">
                        Designate a representative who may exercise data protection rights on your behalf in event of death or incapacity.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block font-semibold text-purple-900 mb-1">
                          Nominee Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={nomineeName}
                          onChange={(e) => setNomineeName(e.target.value)}
                          placeholder="Nominee Name"
                          className="w-full rounded-xl border border-purple-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-purple-900 mb-1">
                          Nominee Contact (Email / Mobile) *
                        </label>
                        <input
                          type="text"
                          required
                          value={nomineeContact}
                          onChange={(e) => setNomineeContact(e.target.value)}
                          placeholder="Email or Mobile"
                          className="w-full rounded-xl border border-purple-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#5A1C16] mb-1">
                    3. Specific Request Description & Instructions *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Please describe your specific request in detail (e.g. which data you wish to access, reason for grievance, or specific consent you wish to withdraw)..."
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A1C16]"
                  ></textarea>
                </div>

                <div className="rounded-2xl border border-[#e4c69d] bg-[#fffaf4] p-4 text-xs text-[#5A3A2E] space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#5A1C16]">
                    <HiOutlineShieldCheck className="h-4 w-4 text-[#0F5F54]" />
                    <span>Statutory Verification & Data Principal Duties (Sec. 15)</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-gray-600">
                    By submitting this request, you confirm that you are the authentic Data Principal (or lawful nominee) and that all information provided is true and accurate. Under Section 15 of the DPDP Act 2023, furnishing false information or impersonating another individual is punishable by statutory penalties.
                  </p>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={consentGranted}
                      onChange={(e) => setConsentGranted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#d9b892] text-[#6A160A] focus:ring-[#6A160A]"
                    />
                    <span className="leading-relaxed font-medium">
                      <strong>* Required:</strong> I consent to VRPS processing my details to verify my identity and resolve this statutory data rights request in accordance with the{" "}
                      <Link href="/privacy" target="_blank" className="text-[#6A160A] underline">
                        Privacy Notice
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#5A1C16] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#3E120F] transition disabled:opacity-70"
                >
                  {loading ? "Submitting Request..." : "Submit Statutory Data Rights Request"}
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === "track" && (
          <div className="rounded-3xl border border-[#e4c69d] bg-white p-6 shadow-xl md:p-10">
            <h2 className="text-xl font-bold text-[#5A1C16] mb-2">
              Track Request Status
            </h2>
            <p className="text-xs text-gray-600 mb-6">
              Enter your tracking reference ID and the email address used during submission:
            </p>

            <form onSubmit={handleTrack} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="block font-semibold text-[#5A1C16] mb-1">
                    Request ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={trackRequestId}
                    onChange={(e) => setTrackRequestId(e.target.value)}
                    placeholder="e.g. VRPS-DRR-20260815-ABCD"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A1C16]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#5A1C16] mb-1">
                    Registered Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={trackEmail}
                    onChange={(e) => setTrackEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A1C16]"
                  />
                </div>
              </div>

              {trackError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                  {trackError}
                </div>
              )}

              <button
                type="submit"
                disabled={trackLoading}
                className="rounded-xl bg-[#5A1C16] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#3E120F] transition disabled:opacity-70"
              >
                {trackLoading ? "Looking Up..." : "Check Status"}
              </button>
            </form>

            {trackResult && (
              <div className="mt-6 rounded-2xl border border-[#cce3dc] bg-[#f0f7f5] p-5 text-xs text-[#2b4c44] space-y-3">
                <div className="flex items-center justify-between border-b border-[#cce3dc] pb-2">
                  <span className="font-bold text-gray-600 uppercase">Request ID</span>
                  <span className="font-mono font-bold text-[#0F5F54]">{trackResult.requestId}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#cce3dc] pb-2">
                  <span className="font-bold text-gray-600 uppercase">Request Type</span>
                  <span className="font-bold uppercase text-gray-800">{trackResult.requestType}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#cce3dc] pb-2">
                  <span className="font-bold text-gray-600 uppercase">Status</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800 uppercase">
                    {trackResult.status}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[#cce3dc] pb-2">
                  <span className="font-bold text-gray-600 uppercase">Submitted On</span>
                  <span>{new Date(trackResult.requestedAt).toLocaleDateString("en-IN")}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-600 uppercase block mb-1">Officer Notes / Status Update:</span>
                  <p className="rounded-xl bg-white p-3 border border-[#cce3dc] text-gray-800">
                    {trackResult.resolutionNotes}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
