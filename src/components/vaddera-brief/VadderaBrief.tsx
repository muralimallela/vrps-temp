"use client";

import React from "react";
import Image from "next/image";
import "./VadderaBrief.css";
import { Roboto } from "next/font/google";
import { useTranslations } from "next-intl";

const roboto = Roboto({
  weight: "700",
  subsets: ["latin"],
});

export const VadderaBrief: React.FC = () => {
  const t = useTranslations("VadderaBrief");

  return (
    <div className="bg-gray-50 py-10 px-4 md:px-8 vaddera-brief-bg min-h-screen">
      {/* Title */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1
          className={` text-2xl md:text-4xl font-bold text-gray-800 text-center mx-auto`}
        >
          {t("title")}
        </h1>
      </div>

      {/* Section Content */}
      <section className="md:p-8 rounded-lg flex flex-col md:flex-row items-start justify-around gap-1 mx-auto">
        {/* Left: Logo */}
        <div className="flex-shrink-0 w-full md:w-1/2 lg:h-[70vh] h-[40vh] relative">
          <Image
            src="/vrps-logo-3x.png"
            title={t("imageTitle")}
            alt={t("imageAlt")}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Right: Text Content */}
        <div className="max-w-xl md:text-left">
          <p className="text-[#6A160A] mb-4 text-lg md:text-2xl text-justify">
            {t("paragraph1")}
          </p>
          <p className="text-[#6A160A] mb-6 text-lg md:text-2xl text-justify">
            {t("paragraph2")}
          </p>
          <button className="bg-white text-black font-semibold border border-gray-300 shadow px-5 py-2 rounded hover:shadow-md transition">
            {t("button")}
          </button>
        </div>
      </section>
    </div>
  );
};
