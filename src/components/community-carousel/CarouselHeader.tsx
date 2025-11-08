"use client";
import React from "react";
import { useTranslations } from "next-intl"; // ✅ import from next-intl

export default function CarouselHeader() {
  const t = useTranslations("CarouselHeader"); // 👈 translation namespace

  return (
    <div className="carousel-content">
      <div className="content-bg">
        <h2 className="font-bold">{t("title")}</h2>

        <p className="">{t("description")}</p>
      </div>

      <div className="community-btn">
        <a href="#" className="slider-btn">
          {t("button")}
        </a>
      </div>
    </div>
  );
}
