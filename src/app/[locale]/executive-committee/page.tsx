import React from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { constructMetadata, SEO_PAGE_DATA } from "@/src/lib/seo";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/src/components/seo/JsonLd";
import ExecutiveCommitteeClient from "@/src/components/committee/ExecutiveCommitteeClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTelugu = locale === "te";
  const data = isTelugu ? SEO_PAGE_DATA.executiveCommittee.te : SEO_PAGE_DATA.executiveCommittee.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/executive-committee",
    locale,
    keywords: data.keywords,
    image: "/committee/santhosh.jpeg",
  });
}

export default async function ExecutiveCommitteePage({
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
          { name: isTelugu ? "కార్యవర్గం" : "Executive Committee", url: `/${locale}/executive-committee` },
        ]}
      />
      <CollectionPageJsonLd
        title={isTelugu ? SEO_PAGE_DATA.executiveCommittee.te.title : SEO_PAGE_DATA.executiveCommittee.en.title}
        description={isTelugu ? SEO_PAGE_DATA.executiveCommittee.te.description : SEO_PAGE_DATA.executiveCommittee.en.description}
        url={`/${locale}/executive-committee`}
      />
      <ExecutiveCommitteeClient
        title={isTelugu ? "రాష్ట్ర కార్యవర్గం" : "Executive Committee"}
        subtitle={
          isTelugu
            ? "సమాజ సాధికారత, సంక్షేమ కార్యక్రమాలు మరియు హక్కుల సాధనకు నిరంతరం శ్రమిస్తున్న మా రాష్ట్ర బాధ్యులు."
            : "Meet our dedicated state officers and leaders driving empowerment, welfare initiatives, and community progress across the nation."
        }
        badgeText={isTelugu ? "వడ్డెర రిజర్వేషన్ పోరాట సమితి" : "Vaddera Reservation Porata Samithi"}
      />
    </>
  );
}
