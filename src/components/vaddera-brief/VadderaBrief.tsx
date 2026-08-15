"use client";

import React from "react";
import Image from "next/image";
import "./VadderaBrief.css";
import { Roboto } from "next/font/google";
import { useTranslations } from "next-intl";
import Link from "next/link";

const roboto = Roboto({
  weight: "700",
  subsets: ["latin"],
});

export const VadderaBrief: React.FC = () => {
  const t = useTranslations("VadderaBrief");

  return (
    <section className="bg-gray-50 py-12 px-4 md:px-8 vaddera-brief-bg min-h-screen">
      {/* Title */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 text-center mx-auto">
          {t("title")}
        </h2>
      </div>

      {/* Section Content */}
      <div className="md:p-8 rounded-lg flex flex-col md:flex-row items-start justify-around gap-1 mx-auto max-w-6xl">
        {/* Left: Logo */}
        <div className="flex-shrink-0 w-full md:w-1/2 lg:h-[70vh] h-[40vh] relative">
          <Image
            src="/vrps-logo-3x.png"
            title={t("imageTitle")}
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Right: Text Content */}
        <div className="max-w-xl md:text-left flex flex-col justify-center h-full pt-4 md:pt-12">
          <p className="text-[#6A160A] mb-4 text-lg md:text-2xl text-justify font-medium">
            {t("paragraph1")}
          </p>
          <p className="text-[#6A160A] mb-6 text-lg md:text-2xl text-justify font-medium">
            {t("paragraph2")}
          </p>
          <div className="flex gap-4">
            <Link href="/about/vrps-birth">
              <button className="bg-[#6A160A] text-white hover:bg-[#521107] font-semibold border border-transparent shadow px-5 py-2.5 rounded-lg hover:shadow-md transition cursor-pointer">
                {t("button")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
