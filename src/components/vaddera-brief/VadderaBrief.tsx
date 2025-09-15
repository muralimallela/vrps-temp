import React from "react";
import Image from "next/image";
import "./VadderaBrief.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "700",
  subsets: ["latin"],
});

export const VadderaBrief: React.FC = () => {
  return (
    <div className="bg-gray-50 py-10 px-4 md:px-8 vaddera-brief-bg min-h-screen">
      {/* Title */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1
          className={`${roboto.className} text-2xl md:text-4xl font-bold text-gray-800 text-center md:text-center mx-auto`}
        >
          Vaddera Reservation Porata Samithi
        </h1>
      </div>

      {/* Section Content */}
      <section className=" md:p-8 rounded-lg  flex flex-col md:flex-row items-start justify-around gap-1  mx-auto">
        {/* Left: Logo */}
        <div className="flex-shrink-0 w-full md:w-1/2 lg:h-[70vh] h-[40vh] relative">
          <Image
            src="/vrps-logo-3x.png"
            title="VRPS - Vaddera Reservation Porata Samithi"
            alt="VRPS Logo - Vaddera Reservation Porata Samithi"
            fill
            className="object-contain "
            priority
          />
        </div>

        {/* Right: Text Content */}
        <div className="max-w-xl text-center md:text-left ">
          <p className="text-[#6A160A] mb-4 text-2xl text-justify">
            The Vaddera Reservation Struggle Committee (VRPS) is not just an
            association — it is an organization dedicated to bringing to the
            government’s attention all matters related to the welfare,
            reservations, and development that should rightfully be provided to
            the Vaddera community across the country.
          </p>
          <p className="text-[#6A160A] mb-6 text-2xl text-justify">
            While many associations fight only to some extent for developmental
            activities, VRPS moves forward with unyielding determination to
            bring light into the lives of Vadderas throughout the nation.
          </p>
          <button className="bg-white text-black font-semibold border border-gray-300 shadow px-5 py-2 rounded hover:shadow-md transition">
            Know More
          </button>
        </div>
      </section>
    </div>
  );
};
