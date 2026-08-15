import React from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { constructMetadata, SEO_PAGE_DATA } from "@/src/lib/seo";
import { BreadcrumbJsonLd } from "@/src/components/seo/JsonLd";
import MembershipClient from "@/src/components/membership/MembershipClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTelugu = locale === "te";
  const data = isTelugu ? SEO_PAGE_DATA.membership.te : SEO_PAGE_DATA.membership.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/membership",
    locale,
    keywords: data.keywords,
    image: "/VRPS-LOGO-FINAL.png",
  });
}

export default async function MembershipPage({
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
          { name: isTelugu ? "సభ్యత్వం" : "Membership", url: `/${locale}/membership` },
        ]}
      />
      <MembershipClient isTelugu={isTelugu} />
    </>
  );
}
