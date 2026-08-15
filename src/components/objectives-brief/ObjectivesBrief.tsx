"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { HiCheckCircle } from "react-icons/hi2";

export const ObjectivesBrief: React.FC = () => {
  const tObj = useTranslations("Objectives");

  // Show all 11 objectives
  const objectiveKeys = Array.from({ length: 11 }, (_, i) => String(i + 1));

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#6A160A]">
            {tObj("title")}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {tObj("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectiveKeys.map((key) => (
            <div
              key={key}
              className="group flex gap-3 p-4 rounded-xl border border-slate-200/50 bg-white/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#6A160A]/20"
            >
              <div className="flex-shrink-0 flex items-start mt-0.5">
                <HiCheckCircle className="h-5 w-5 text-[#6A160A] group-hover:text-orange-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed font-semibold">
                {tObj(`list.${key}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
