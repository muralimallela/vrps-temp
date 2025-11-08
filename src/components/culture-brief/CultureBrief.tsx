"use client";

import Image from "next/image";
import BriefSection from "../brief/BriefSection";
import { useTranslations } from "next-intl";

export default function CultureBrief() {
  const t = useTranslations("CultureBrief");

  return (
    <BriefSection
      title={t("title")}
      content={
        <>
          {t("paragraph1")}
          <br />
          <span className="font-bold">{t("highlight")}</span>
          <br />
          <span className="italic">{t("quote")}</span>
        </>
      }
      imageSrc="/culture.png"
      imageAlt={t("imageAlt")}
      buttonText = {t("buttonText")}
    />
  );
}
