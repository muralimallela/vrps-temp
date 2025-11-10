"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Empowerment: React.FC = () => {
  const t = useTranslations("empowerment");

  return (
    <div className="bg-amber-50 text-gray-900 flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-16 leading-relaxed">
      {/* ======= Hero Section ======= */}
      <section className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
        {/* Left Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-800 mb-4 drop-shadow-md">
            {t("hero.title")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-red-900 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <Image
            src="/empowerment.png"
            alt="Empowerment Symbol"
            width={300}
            height={300}
            className="w-2/3 sm:w-1/2 md:w-[260px] lg:w-[300px] h-auto object-contain"
          />
        </div>
      </section>

      {/* Divider */}
      <h2 className="text-xl sm:text-2xl md:text-3xl text-center text-red-800 font-bold lg:underline mb-12">
        {t("hero.subtitle2")}
      </h2>

      {/* ======= Content Sections ======= */}
      <div className="max-w-5xl space-y-10">
        {/* Birth of the Movement */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("birth.heading")}
          </h3>
          <p className="mb-3">{t("birth.p1")}</p>
          <p>{t("birth.p2")}</p>
        </section>

        {/* Awareness to Awakening */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("awareness.heading")}
          </h3>
          <p className="mb-3">{t("awareness.p1")}</p>
          <p>{t("awareness.p2")}</p>
        </section>

        {/* Historic Protests */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("protests.heading")}
          </h3>
          <p>{t("protests.p1")}</p>
        </section>

        {/* Political Recognition */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("politics.heading")}
          </h3>
          <p>{t("politics.p1")}</p>
        </section>

        {/* Social Empowerment Goals */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("goals.heading")}
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>{t("goals.points.1")}</li>
            <li>{t("goals.points.2")}</li>
            <li>{t("goals.points.3")}</li>
            <li>{t("goals.points.4")}</li>
            <li>{t("goals.points.5")}</li>
          </ul>
        </section>

        {/* Unity as Strength */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("unity.heading")}
          </h3>
          <p className="mb-3">{t("unity.p1")}</p>
          <p className="italic text-center text-red-800 font-semibold mt-6">
            “{t("unity.quote")}”
          </p>
        </section>
      </div>
    </div>
  );
};

export default Empowerment;
