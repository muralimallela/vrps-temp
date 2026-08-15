"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FaBuilding, FaGavel, FaFlask, FaNewspaper } from "react-icons/fa";

const VRPSBirthPage: React.FC = () => {
  const t = useTranslations("vrpsBirth");

  // Map founder keys to specific icons
  const founderIcons = [
    <FaBuilding className="text-amber-700 w-6 h-6" key="building" />,
    <FaGavel className="text-amber-700 w-6 h-6" key="gavel" />,
    <FaFlask className="text-amber-700 w-6 h-6" key="flask" />,
    <FaNewspaper className="text-amber-700 w-6 h-6" key="newspaper" />
  ];

  const founders = [
    { name: t("founders.1.name"), desc: t("founders.1.description"), icon: founderIcons[0] },
    { name: t("founders.2.name"), desc: t("founders.2.description"), icon: founderIcons[1] },
    { name: t("founders.3.name"), desc: t("founders.3.description"), icon: founderIcons[2] },
    { name: t("founders.4.name"), desc: t("founders.4.description"), icon: founderIcons[3] }
  ];

  return (
    <div className="bg-[#fcf8f2] text-gray-900 min-h-screen flex flex-col items-center">
      {/* ======= Hero Section ======= */}
      <section className="relative w-full bg-gradient-to-r from-red-800 to-amber-950 text-white overflow-hidden py-16 md:py-24 px-4 sm:px-6 md:px-12 text-center shadow-lg">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-600/20 via-transparent to-transparent opacity-60"></div>
        <div className="relative max-w-4xl mx-auto z-10">
          <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-300 mb-4">
            Movement Origin
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 drop-shadow-md">
            {t("title")}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-amber-100 font-medium max-w-3xl mx-auto leading-relaxed border-t border-amber-500/30 pt-6">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* ======= Main Content & Founders Grid ======= */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">
        
        {/* Story Section (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-8 leading-relaxed">
          {/* Paragraph 1 - Blockquote quote card */}
          <div className="relative border-l-4 border-amber-600 pl-6 py-3 bg-amber-50/60 rounded-r-2xl shadow-sm">
            <p className="text-lg text-gray-800 italic font-medium leading-relaxed">
              {t("p1")}
            </p>
          </div>

          {/* Paragraph 2 */}
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
            {t("p2")}
          </p>

          {/* Core Question & Answer Callout Card */}
          <div className="bg-gradient-to-br from-amber-500/10 to-red-500/10 border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-800 text-white text-sm font-bold">?</span>
              {t("question")}
            </h3>
            <p className="text-lg sm:text-xl text-gray-800 font-semibold leading-relaxed border-l-2 border-red-700 pl-4 py-1">
              {t("answer")}
            </p>
          </div>

          {/* Paragraph 3 */}
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
            {t("p3")}
          </p>

          {/* Paragraph 4 - Callout Card */}
          <div className="bg-[#6A160A] text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <p className="text-lg sm:text-xl font-medium leading-relaxed text-center">
              {t("p4")}
            </p>
          </div>

          {/* Paragraph 5 */}
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
            {t("p5")}
          </p>
        </div>

        {/* Guiding Personalities Sidebar (Right 1 column) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-red-800 mb-6 border-b border-amber-100 pb-4">
              {t("guidingPersonalities")}
            </h2>
            
            <div className="space-y-5">
              {founders.map((founder, i) => (
                <div key={i} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-amber-50/50 transition duration-300 border border-transparent hover:border-amber-200/50">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100/80 group-hover:bg-amber-100 transition duration-300">
                    {founder.icon}
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-red-800 transition duration-300">
                      {founder.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {founder.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Context/Quote card */}
            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <p className="text-xs text-amber-800 uppercase tracking-widest font-bold mb-1">Our Mission</p>
              <p className="text-sm text-gray-700 font-medium">
                Socio-Economic Development through Education, Representation, and Collective Struggle.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default VRPSBirthPage;
