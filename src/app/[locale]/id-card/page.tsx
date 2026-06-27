"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import LogoLoader from "@/src/components/loading/LogoLoader";
import { generateDottedQrSvg } from "@/src/lib/qrDots";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowPath,
  HiOutlineCheckBadge,
  HiOutlineIdentification,
  HiOutlineUser,
} from "react-icons/hi2";

type IdCardData = {
  membershipId: string;
  userId: string;
  name: string;
  mobile: string;
  email: string;
  photoUrl: string;
  address: string;
  memberSince: string;
};

export default function IdCardPage() {
  const [card, setCard] = useState<IdCardData | null>(null);
  const [error, setError] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [downloading, setDownloading] = useState(false);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/membership/id-card");
        const data = await res.json();
        if (data.success) {
          setCard(data.data);
          // Generate Dotted QR code encoding instant verification URL
          const origin = typeof window !== "undefined" ? window.location.origin : "https://www.vaddera.org";
          const qrPayload = `${origin}/verify/${data.data.membershipId}?sig=${data.data.sig || ""}`;
          const qrUrl = generateDottedQrSvg(qrPayload);
          setQrDataUrl(qrUrl);
        } else {
          setError(data.error || "Access denied. Only active members can view ID cards.");
        }
      } catch (err) {
        setError("Unable to load ID card details.");
      }
    };
    load();
  }, []);

  const downloadExactPdf = async () => {
    if (!frontRef.current || !backRef.current || !card) return;
    try {
      setDownloading(true);
      const frontDataUrl = await toPng(frontRef.current, { cacheBust: true, pixelRatio: 2 });
      const backDataUrl = await toPng(backRef.current, { cacheBust: true, pixelRatio: 2 });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [380, 602],
      });

      pdf.addImage(frontDataUrl, "PNG", 0, 0, 380, 602);
      pdf.addPage([380, 602], "portrait");
      pdf.addImage(backDataUrl, "PNG", 0, 0, 380, 602);

      pdf.save(`${card.membershipId}_VRPS_ID_Card.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Unable to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] p-6">
        <div className="max-w-md rounded-2xl border border-[#e4c69d] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3e5] text-[#6A160A]">
            <HiOutlineIdentification className="h-10 w-10" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#5A1C16]">ID Card Access</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6a4a3b]">{error}</p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/membership"
              className="rounded-xl bg-[#6A160A] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#521006]"
            >
              Activate Membership
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!card) return <LogoLoader message="Loading official VRPS Digital ID Card..." />;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] py-8 px-4 sm:px-6 md:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header Title */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6A160A] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
            <HiOutlineCheckBadge className="h-4 w-4" /> Verified Membership Card
          </span>
          <h1 className="mt-3 text-3xl font-black text-[#3d120d] md:text-4xl">
            Digital Member ID Card
          </h1>
          <p className="mt-2 text-sm text-[#6a4a3b] md:text-base">
            Front shows official logo & member identity. Flip to back to view verification QR code.
          </p>
        </div>

        {/* Action Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-2 rounded-xl border border-[#d9b892] bg-white px-5 py-2.5 text-sm font-bold text-[#5A1C16] shadow-sm transition hover:bg-[#fff9f2]"
          >
            <HiOutlineArrowPath className={`h-5 w-5 transition-transform duration-500 ${isFlipped ? "rotate-180" : ""}`} />
            Flip Card ({isFlipped ? "Show Front" : "Show Back"})
          </button>

          <button
            onClick={downloadExactPdf}
            disabled={downloading}
            className="flex items-center gap-2 rounded-xl bg-[#6A160A] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#521006] disabled:opacity-70"
          >
            <HiOutlineArrowDownTray className="h-5 w-5" />
            {downloading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>

        {/* Interactive 3D Card Display Container */}
        <div className="mx-auto flex justify-center perspective-1000">
          <div
            className={`relative w-[340px] h-[538px] sm:w-[380px] sm:h-[602px] transition-transform duration-700 transform-style-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            {/* FRONT SIDE (DISPLAY) */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-white select-none rounded-[24px] overflow-hidden border-4 border-white/80 shadow-2xl">
              <img
                src="/images/id-card-front.svg"
                alt="ID Card Front Background"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              <div className="absolute inset-x-0 bottom-4 top-[52%] sm:top-[53%] flex flex-col items-center justify-start px-4 text-center">
                <div className="relative h-36 w-36 sm:h-40 sm:w-40 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-xl bg-white shrink-0">
                  {card.photoUrl ? (
                    <img src={card.photoUrl} alt={card.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-sky-50 text-[#0080D2]">
                      <HiOutlineUser className="h-20 w-20" />
                    </div>
                  )}
                </div>

                <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-goblin text-[#E52321] uppercase tracking-wide">
                  {card.membershipId}
                </h3>

                <h2 className="mt-0.5 sm:mt-1 text-3xl sm:text-4xl font-carattere text-[#0080D2] tracking-normal px-2 leading-tight">
                  {card.name}
                </h2>
              </div>
            </div>

            {/* BACK SIDE (DISPLAY) */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#0080D2] select-none rounded-[24px] overflow-hidden border-4 border-white/80 shadow-2xl">
              <img
                src="/images/id-card-back.svg"
                alt="ID Card Back Background"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-x-0 top-[12.8%] sm:top-[12.8%] flex justify-center px-6">
                <div className="w-[262px] h-[262px] sm:w-[294px] sm:h-[294px] p-2 bg-white rounded-[26px] flex items-center justify-center shadow-inner overflow-hidden">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Verification QR Code"
                      className="w-full h-full object-contain rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-2xl animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HIDDEN OFF-SCREEN TARGETS FOR 100% EXACT PDF CAPTURE */}
        <div className="fixed top-[9999px] left-[9999px] pointer-events-none opacity-0">
          {/* EXACT FRONT TEMPLATE FOR EXPORT */}
          <div
            ref={frontRef}
            className="relative w-[380px] h-[602px] bg-white rounded-[24px] overflow-hidden border-4 border-white"
          >
            <img
              src="/images/id-card-front.svg"
              alt="ID Card Front Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-4 top-[53%] flex flex-col items-center justify-start px-4 text-center">
              <div className="relative h-40 w-40 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-xl bg-white shrink-0">
                {card.photoUrl ? (
                  <img src={card.photoUrl} alt={card.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-sky-50 text-[#0080D2]">
                    <HiOutlineUser className="h-20 w-20" />
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-2xl font-goblin text-[#E52321] uppercase tracking-wide">
                {card.membershipId}
              </h3>
              <h2 className="mt-1 text-4xl font-carattere text-[#0080D2] tracking-normal px-2 leading-tight">
                {card.name}
              </h2>
            </div>
          </div>

          {/* EXACT BACK TEMPLATE FOR EXPORT */}
          <div
            ref={backRef}
            className="relative w-[380px] h-[602px] bg-[#0080D2] rounded-[24px] overflow-hidden border-4 border-white"
          >
            <img
              src="/images/id-card-back.svg"
              alt="ID Card Back Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 top-[12.8%] flex justify-center px-6">
              <div className="w-[294px] h-[294px] p-2 bg-white rounded-[26px] flex items-center justify-center overflow-hidden">
                {qrDataUrl && (
                  <img
                    src={qrDataUrl}
                    alt="Verification QR Code"
                    className="w-full h-full object-contain rounded-2xl"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
