"use client";

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
      imageAlt={t("imageAlt") || "VRPS Historical Movement Overview"}
      buttonText={t("buttonText")}
      href="/history"
    />
  );
}
