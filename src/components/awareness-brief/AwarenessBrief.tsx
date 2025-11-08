"use client";

import Image from "next/image";
import BriefSection from "../brief/BriefSection";
import { useTranslations } from "next-intl";

export default function AwarenessBrief() {
  const t = useTranslations("AwarenessBrief");

  return (
    <BriefSection
      title={t("title")}
      description={t("description")}
      points={[
        t("points.0"),
        t("points.1"),
        t("points.2"),
      ]}
      buttonText = {t("buttonText")}
      imageSrc="/history.png"
      imageAlt={t("imageAlt")}
    />
  );
}
