"use client";

import React from "react";
import BriefSection from "../brief/BriefSection";
import { useTranslations } from "next-intl";

export default function AssemblySiegeBrief() {
  const t = useTranslations("AssemblySiege");

  return (
    <BriefSection
      title={t("title")}
      subtitle={t("subtitle")}
      description={t("description")}
      imageSrc="/assembly-siege.webp"
      imageAlt={t("imageAlt")}
      buttonText={t("buttonText")}
      href="assembly-siege"
      reverse={true}
    />
  );
}
