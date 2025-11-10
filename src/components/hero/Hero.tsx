"use client";

import Image from "next/image";
import { Inria_Serif, Roboto } from "next/font/google";
import { useTranslations } from "next-intl";
import { SignInButton } from "@clerk/nextjs";

const inriaSerif = Inria_Serif({
  weight: "700",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: "600",
  subsets: ["latin"],
});

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <div className="relative w-full pb-10 lg:pb-0 md:h-[calc(100vh-4.5rem)] pt-12 sm:pt-14 md:pt-18">
      <Image
        src="/hero.png"
        alt={t("alt")}
        fill
        className="object-cover"
        priority
      />
      <div className={`relative z-10 text-white text-center px-4 font-bold`}>
        {/* Title */}
        <h3 className="text-3xl sm:text-4xl md:text-6xl lg:text-[97.26px] leading-tight whitespace-pre-line">
          {t("title")}
        </h3>

        {/* Subtitle */}
        <h3 className="mt-4 text-lg sm:text-xl md:text-3xl lg:text-[48.63px] leading-snug">
          {t("subtitle")}
        </h3>

        {/* Button */}
        <div className="flex justify-center">
          <SignInButton mode="modal">
            <button
              type="button"
              className={` focus:outline-none text-white bg-[#0F5F54] hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-4xl mt-8 md:mt-12 cursor-pointer px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl py-4 sm:py-6 md:py-8 me-2 mb-2 dark:bg-[#0F5F54] dark:hover:bg-green-700 dark:focus:ring-green-800`}
            >
              {t("button")}
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}
