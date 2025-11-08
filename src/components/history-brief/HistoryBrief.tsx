"use client";

import Image from "next/image";
import BriefSection from "../brief/BriefSection";
import { useTranslations } from "next-intl";

export default function HistoryBrief() {
  const t = useTranslations("HistoryBrief");

  return (
    <BriefSection
      title={t("title")}
      subtitle={t("subtitle")}
      description={t("description")}
      imageSrc="/history.png"
      imageAlt={t("imageAlt")}
      buttonText={t("buttonText")}
    />
  );
}
