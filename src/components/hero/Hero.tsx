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
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] pt-16 md:pt-18">
      <h1>Vaddera Reservation Porata Samithi</h1>
      <Image
        src="/hero.png"
        alt="Hero-image"
        fill
        className="object-cover"
        priority
      />
      <div className={`relative z-10 text-white ${inriaSerif.className}`}>
        <h3 className="text-[97.26px] flex justify-center">
          "For Growth,
          <br />
          &ensp;For Honor"
        </h3>
        <h3 className="text-[48.63px] flex justify-center">
          "Educating our children, Empowering our community."
        </h3>
        <span className="flex justify-center">
          <button
            type="button"
            className={`${roboto.className} focus:outline-none text-white  bg-[#0F5F54] hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-4xl mt-12 cursor-pointer  px-10 text-xl py-8 me-2 mb-2 dark:bg-[#0F5F54] dark:hover:bg-green-700 dark:focus:ring-green-800`}
          >
            JOIN THE COMMUNITY
          </button>
        </span>
      </div>
    </div>
  );
}
