"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

interface Member {
  image: string;
}

const ExecutiveCommittee: React.FC = () => {
  const t = useTranslations("executiveCommittee");

  // Only store static values here
  const members: Member[] = [
    { image: "/committee/santhosh.jpeg" },
    { image: "/committee/uppendra.png" },
    { image: "/committee/shiva.jpg" }
  ];

  return (
    <div className="bg-amber-50 text-gray-900 flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-16 leading-relaxed">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-800 mb-4 drop-shadow-md text-center">
        {t("title")}
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl text-red-900 font-medium text-center max-w-3xl mb-10">
        {t("subtitle")}
      </p>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {members.map((member, i) => (
          <div
            key={i}
            className="bg-[#F5E6CF] shadow-md rounded-2xl flex flex-col items-center p-4 border border-gray-200"
          >
            <Image
              src={member.image}
              alt={t(`members.${i}.name`)}
              width={400}
              height={400}
              className="w-full h-90 object-cover rounded-xl mb-4 bg-white"
            />

            <h3 className="text-lg font-semibold text-center">
              {t(`members.${i}.name`)}
            </h3>
            <p className="text-sm text-gray-700 text-center">
              {t(`members.${i}.title`)}
            </p>
            <p className="text-sm text-gray-700 text-center mb-2">
              {t(`members.${i}.role`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutiveCommittee;
