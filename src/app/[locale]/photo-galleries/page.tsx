import React from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { constructMetadata, SEO_PAGE_DATA } from "@/src/lib/seo";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/src/components/seo/JsonLd";
import { PhotoGalleriesClient } from "@/src/components/gallery/PhotoGalleriesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTelugu = locale === "te";
  const data = isTelugu ? SEO_PAGE_DATA.gallery.te : SEO_PAGE_DATA.gallery.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/photo-galleries",
    locale,
    keywords: data.keywords,
    image: "/images/news/1.jpeg",
  });
}

export default async function PhotoGalleriesPage({
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
          { name: isTelugu ? "చిత్రమాలిక" : "Photo Gallery", url: `/${locale}/photo-galleries` },
        ]}
      />
      <CollectionPageJsonLd
        title={isTelugu ? SEO_PAGE_DATA.gallery.te.title : SEO_PAGE_DATA.gallery.en.title}
        description={isTelugu ? SEO_PAGE_DATA.gallery.te.description : SEO_PAGE_DATA.gallery.en.description}
        url={`/${locale}/photo-galleries`}
      />
      <PhotoGalleriesClient isTelugu={isTelugu} />
    </>
  );
}
