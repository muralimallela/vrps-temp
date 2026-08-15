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
    <header className="relative w-full pb-10 lg:pb-0 md:h-[calc(100vh-4.5rem)] pt-12 sm:pt-14 md:pt-18">
      <Image
        src="/hero.png"
        alt={t("alt") || "VRPS Community Leadership and Empowerment Banner"}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="relative z-10 text-white text-center px-4 font-bold max-w-5xl mx-auto">
        {/* Semantic H1 Title */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl leading-tight whitespace-pre-line drop-shadow-md">
          {t("title")}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-lg sm:text-xl md:text-3xl lg:text-[48px] leading-snug font-semibold text-amber-100 drop-shadow-sm">
          {t("subtitle")}
        </p>

        {/* Action Button */}
        <div className="flex justify-center mt-8 md:mt-12">
          <SignInButton mode="modal">
            <button
              type="button"
              className="focus:outline-none text-white bg-[#0F5F54] hover:bg-[#0b4840] focus:ring-4 focus:ring-emerald-300 font-bold rounded-full cursor-pointer px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl py-3.5 sm:py-5 md:py-6 shadow-xl transition-all duration-300 hover:scale-105"
            >
              {t("button")}
            </button>
          </SignInButton>
        </div>
      </div>
    </header>
  );
}
