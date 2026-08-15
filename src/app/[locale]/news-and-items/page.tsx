import React from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { constructMetadata, SEO_PAGE_DATA } from "@/src/lib/seo";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/src/components/seo/JsonLd";
import { NewsGalleryClient } from "@/src/components/news/NewsGalleryClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTelugu = locale === "te";
  const data = isTelugu ? SEO_PAGE_DATA.news.te : SEO_PAGE_DATA.news.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/news-and-items",
    locale,
    keywords: data.keywords,
    image: "/images/news/1.jpeg",
  });
}

export default async function NewsAndItemsPage({
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
          { name: isTelugu ? "వార్తలు" : "News & Media", url: `/${locale}/news-and-items` },
        ]}
      />
      <CollectionPageJsonLd
        title={isTelugu ? SEO_PAGE_DATA.news.te.title : SEO_PAGE_DATA.news.en.title}
        description={isTelugu ? SEO_PAGE_DATA.news.te.description : SEO_PAGE_DATA.news.en.description}
        url={`/${locale}/news-and-items`}
      />
      <NewsGalleryClient isTelugu={isTelugu} />
    </>
  );
}
