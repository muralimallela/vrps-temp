import React from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { constructMetadata, SEO_PAGE_DATA } from "@/src/lib/seo";
import { BreadcrumbJsonLd } from "@/src/components/seo/JsonLd";
import DataRightsClient from "@/src/components/legal/DataRightsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTelugu = locale === "te";
  const data = isTelugu ? SEO_PAGE_DATA.dataRights.te : SEO_PAGE_DATA.dataRights.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/data-rights",
    locale,
    keywords: data.keywords,
  });
}

export default async function DataRightsPage({
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
          { name: isTelugu ? "డేటా హక్కులు" : "Data Rights", url: `/${locale}/data-rights` },
        ]}
      />
      <DataRightsClient isTelugu={isTelugu} />
    </>
  );
}
