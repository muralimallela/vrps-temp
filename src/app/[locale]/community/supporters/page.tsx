import React from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { constructMetadata, SEO_PAGE_DATA } from "@/src/lib/seo";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/src/components/seo/JsonLd";
import CommunitySupportersClient from "@/src/components/community/CommunitySupportersClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTelugu = locale === "te";
  const data = isTelugu ? SEO_PAGE_DATA.supporters.te : SEO_PAGE_DATA.supporters.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/community/supporters",
    locale,
    keywords: data.keywords,
    image: "/VRPS-LOGO-FINAL.png",
  });
}

export default async function CommunitySupportersPage({
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
          { name: isTelugu ? "సహాయకులు" : "Supporters", url: `/${locale}/community/supporters` },
        ]}
      />
      <CollectionPageJsonLd
        title={isTelugu ? SEO_PAGE_DATA.supporters.te.title : SEO_PAGE_DATA.supporters.en.title}
        description={isTelugu ? SEO_PAGE_DATA.supporters.te.description : SEO_PAGE_DATA.supporters.en.description}
        url={`/${locale}/community/supporters`}
      />
      <CommunitySupportersClient isTelugu={isTelugu} />
    </>
  );
}
