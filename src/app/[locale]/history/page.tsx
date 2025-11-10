"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const VRPSHistory: React.FC = () => {
  const t = useTranslations("vrpsHistory");

  return (
    <div className="bg-amber-50 text-gray-900 flex flex-col items-center justify-center">
      {/* ======= Hero / Banner Section ======= */}
      <section className="relative w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 px-4 sm:px-6 md:px-10 py-10">
        {/* Text Section */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-800 mb-4">
            {t("hero.title", { default: "History" })}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-red-900 leading-relaxed max-w-xl mx-auto lg:mx-0">
            {t("hero.subtitle", {
              default:
                "The Vaddera community is not just a part of history—it is a living spirit of courage and progress.",
            })}
          </p>
        </div>

        {/* Image Section */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <Image
            src="/odde-obanna-without-bg.png"
            alt="Vaddera History Hero Banner"
            width={685}
            height={1041}
            priority
            className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-[400px] xl:w-[450px] h-auto object-contain drop-shadow-xl"
          />
        </div>
      </section>

      {/* ======= Main History Content ======= */}
      <div className="w-full max-w-5xl bg-amber-50 px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-12 lg:py-20 leading-relaxed">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-red-700 lg:underline mb-10 md:mb-14">
          {t("title")}
        </h1>

        {/* Origins Section */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-4">
            {t("origins.heading")}
          </h2>
          <p className="mb-4 text-base sm:text-lg leading-7">
            {t("origins.p1")}
          </p>
          <p className="text-base sm:text-lg leading-7">{t("origins.p2")}</p>
        </section>

        {/* Cultural Section */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-4">
            {t("culture.heading")}
          </h2>
          <p className="mb-4 text-base sm:text-lg leading-7">
            {t("culture.p1")}
          </p>
          <p className="text-base sm:text-lg leading-7">{t("culture.p2")}</p>
        </section>

        {/* Leadership Section */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-4">
            {t("leadership.heading")}
          </h2>
          <p className="mb-4 text-base sm:text-lg leading-7">
            {t("leadership.p1")}
          </p>
          <p className="text-base sm:text-lg leading-7">{t("leadership.p2")}</p>
        </section>

        {/* Struggles Section */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-4">
            {t("struggles.heading")}
          </h2>
          <p className="mb-4 text-base sm:text-lg leading-7">
            {t("struggles.p1")}
          </p>
          <p className="text-base sm:text-lg leading-7">{t("struggles.p2")}</p>
        </section>

        {/* Impact Section */}
        <section>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-4">
            {t("impact.heading")}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-base sm:text-lg leading-7 pl-2 sm:pl-4">
            <li>{t("impact.points.1")}</li>
            <li>{t("impact.points.2")}</li>
            <li>{t("impact.points.3")}</li>
            <li>{t("impact.points.4")}</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default VRPSHistory;
