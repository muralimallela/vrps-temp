import React from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { constructMetadata, SEO_PAGE_DATA } from "@/src/lib/seo";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/src/components/seo/JsonLd";
import CommunityMembersClient from "@/src/components/community/CommunityMembersClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTelugu = locale === "te";
  const data = isTelugu ? SEO_PAGE_DATA.communityMembers.te : SEO_PAGE_DATA.communityMembers.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/community/members",
    locale,
    keywords: data.keywords,
    image: "/VRPS-LOGO-FINAL.png",
  });
}

export default async function CommunityMembersPage({
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
          { name: isTelugu ? "సభ్యుల డైరెక్టరీ" : "Members Directory", url: `/${locale}/community/members` },
        ]}
      />
      <CollectionPageJsonLd
        title={isTelugu ? SEO_PAGE_DATA.communityMembers.te.title : SEO_PAGE_DATA.communityMembers.en.title}
        description={isTelugu ? SEO_PAGE_DATA.communityMembers.te.description : SEO_PAGE_DATA.communityMembers.en.description}
        url={`/${locale}/community/members`}
      />
      <CommunityMembersClient isTelugu={isTelugu} />
    </>
  );
}
