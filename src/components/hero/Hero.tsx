import Image from "next/image";
import { Inria_Serif, Roboto } from "next/font/google";

const inriaSerif = Inria_Serif({
  weight: "700",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: "600",
  subsets: ["latin"],
});

export default function Hero() {
  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] pt-12 sm:pt-14 md:pt-18">
      <Image
        src="/hero.png"
        alt="Hero-image"
        fill
        className="object-cover"
        priority
      />
      <div
        className={`relative z-10 text-white text-center px-4 ${inriaSerif.className}`}
      >
        {/* Title */}
        <h3 className="text-3xl sm:text-4xl md:text-6xl lg:text-[97.26px] leading-tight">
          "For Growth,
          <br />
          &ensp;For Honor"
        </h3>

        {/* Subtitle */}
        <h3 className="mt-4 text-lg sm:text-xl md:text-3xl lg:text-[48.63px] leading-snug">
          "Educating our children, Empowering our community."
        </h3>

        {/* Button */}
        <div className="flex justify-center">
          <button
            type="button"
            className={`${roboto.className} focus:outline-none text-white bg-[#0F5F54] hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-4xl mt-8 md:mt-12 cursor-pointer px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl py-4 sm:py-6 md:py-8 me-2 mb-2 dark:bg-[#0F5F54] dark:hover:bg-green-700 dark:focus:ring-green-800`}
          >
            JOIN THE COMMUNITY
          </button>
        </div>
      </div>
    </div>
  );
}
