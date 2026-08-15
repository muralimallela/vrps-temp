import React from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { constructMetadata, SEO_PAGE_DATA } from "@/src/lib/seo";
import { BreadcrumbJsonLd } from "@/src/components/seo/JsonLd";
import CommunityImpactClient from "@/src/components/community/CommunityImpactClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTelugu = locale === "te";
  const data = isTelugu ? SEO_PAGE_DATA.impact.te : SEO_PAGE_DATA.impact.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/community/impact",
    locale,
    keywords: data.keywords,
    image: "/VRPS-LOGO-FINAL.png",
  });
}

export default async function CommunityImpactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isTelugu = locale === "te";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: isTelugu ? "హోమ్" : "Home", url: `/${locale}` },
          { name: isTelugu ? "సామాజిక ప్రభావం" : "Community Impact", url: `/${locale}/community/impact` },
        ]}
      />
      <CommunityImpactClient isTelugu={isTelugu} />
    </>
  );
}
