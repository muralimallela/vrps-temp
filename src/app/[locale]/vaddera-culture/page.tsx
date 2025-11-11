"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const VadderaCulture: React.FC = () => {
  const t = useTranslations("vadderaCulture");

  return (
    <div className="bg-amber-50 text-gray-900 flex flex-col items-center justify-center overflow-hidden">
      {/* ======= Hero Section ======= */}
      <section className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 px-4 sm:px-6 md:px-10 py-12 md:py-20">
        {/* Left Side Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-800 mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-red-900 leading-relaxed max-w-xl mx-auto lg:mx-0">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Right Side Image */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <Image
            src="/vaddera-culture-work.jpg"
            alt="Vaddera Culture Image"
            width={1040}
            height={527}
            priority
            className="w-full sm:w-3/4 md:w-2/3 lg:w-[420px] xl:w-[480px] h-auto rounded-xl object-cover drop-shadow-xl"
          />
        </div>
      </section>

      {/* ======= Section 1: Heritage & Identity ======= */}
      <section className="w-full max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-8 px-4 sm:px-6 md:px-10 py-12 md:py-20">
        {/* Left Image */}
        {/* <div className="flex-1 flex justify-center lg:justify-start">
          <Image
            src="/shield.png"
            alt="Vaddera Heritage Image"
            width={685}
            height={1041}
            className="w-full sm:w-3/4 md:w-2/3 lg:w-[400px] xl:w-[450px] h-auto rounded-xl object-cover drop-shadow-lg"
          />
        </div> */}

        {/* Right Text */}
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-700 mb-6">
            {t("section1.heading")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 leading-relaxed">
            {t("section1.p1")}
          </p>
        </div>
      </section>

      {/* ======= Section 2: Cultural Identity ======= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-red-700 mb-6">
          {t("section2.heading")}
        </h2>
        <p className="text-base sm:text-lg leading-7 mb-4">
          {t("section2.p1")}
        </p>
        <p className="text-base sm:text-lg leading-7">{t("section2.p2")}</p>
      </section>

      {/* ======= Section 3: Values & Traditions ======= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-16 bg-amber-100 rounded-3xl shadow-inner">
        <h2 className="text-2xl sm:text-3xl font-bold text-red-700 mb-6">
          {t("section3.heading")}
        </h2>
        <ul className="list-disc list-inside space-y-3 text-base sm:text-lg leading-7">
          <li>{t("section3.points.1")}</li>
          <li>{t("section3.points.2")}</li>
          <li>{t("section3.points.3")}</li>
        </ul>
      </section>

      {/* ======= Section 4: Modern Transformation ======= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-red-700 mb-6">
          {t("section4.heading")}
        </h2>
        <p className="text-base sm:text-lg leading-7 mb-4">
          {t("section4.p1")}
        </p>
        <p className="text-base sm:text-lg leading-7 mb-4">
          {t("section4.p2")}
        </p>
        <p className="text-base sm:text-lg leading-7">{t("section4.p3")}</p>
      </section>
    </div>
  );
};

export default VadderaCulture;
