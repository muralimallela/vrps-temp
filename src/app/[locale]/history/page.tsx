import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { constructMetadata, SEO_PAGE_DATA } from "@/src/lib/seo";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/src/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTelugu = locale === "te";
  const data = isTelugu ? SEO_PAGE_DATA.history.te : SEO_PAGE_DATA.history.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/history",
    locale,
    keywords: data.keywords,
    image: "/odde-obanna-without-bg.png",
    type: "article",
  });
}

export default async function VRPSHistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "vrpsHistory" });
  const isTelugu = locale === "te";

  return (
    <div className="bg-amber-50 text-gray-900 flex flex-col items-center justify-center">
      {/* Schema.org Article & Breadcrumbs */}
      <ArticleJsonLd
        title={isTelugu ? SEO_PAGE_DATA.history.te.title : SEO_PAGE_DATA.history.en.title}
        description={isTelugu ? SEO_PAGE_DATA.history.te.description : SEO_PAGE_DATA.history.en.description}
        url={`/${locale}/history`}
        image="/odde-obanna-without-bg.png"
      />
      <BreadcrumbJsonLd
        items={[
          { name: isTelugu ? "హోమ్" : "Home", url: `/${locale}` },
          { name: isTelugu ? "చరిత్ర" : "History", url: `/${locale}/history` },
        ]}
      />

      {/* ======= Hero / Banner Section ======= */}
      <header className="relative w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 px-4 sm:px-6 md:px-10 py-10">
        {/* Text Section */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-800 mb-4 drop-shadow-sm">
            {t("hero.title", { default: "History" })}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-red-900 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            {t("hero.subtitle", {
              default:
                "The Vaddera community is not just a part of history—it is a living spirit of courage and progress.",
            })}
          </p>
        </div>

        {/* Image Section */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <Image
            src="/odde-obanna-without-bg.png"
            alt="Heroic legacy of Odde Obanna and historical leaders of Vaddera community"
            width={685}
            height={1041}
            priority
            sizes="(max-width: 768px) 75vw, 450px"
            className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-[400px] xl:w-[450px] h-auto object-contain drop-shadow-xl"
          />
        </div>
      </header>

      {/* ======= Main History Content ======= */}
      <main className="w-full max-w-5xl bg-amber-50 px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-12 lg:py-20 leading-relaxed">
        {/* Semantic H2 Section Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-red-700 lg:underline mb-10 md:mb-14">
          {t("title")}
        </h2>

        {/* Origins Section */}
        <section className="mb-12">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-4">
            {t("origins.heading")}
          </h3>
          <p className="mb-4 text-base sm:text-lg leading-7">
            {t("origins.p1")}
          </p>
          <p className="text-base sm:text-lg leading-7">{t("origins.p2")}</p>
        </section>

        {/* Cultural Section */}
        <section className="mb-12">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-4">
            {t("culture.heading")}
          </h3>
          <p className="mb-4 text-base sm:text-lg leading-7">
            {t("culture.p1")}
          </p>
          <p className="text-base sm:text-lg leading-7">{t("culture.p2")}</p>
        </section>

        {/* Leadership Section */}
        <section className="mb-12">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-4">
            {t("leadership.heading")}
          </h3>
          <p className="mb-4 text-base sm:text-lg leading-7">
            {t("leadership.p1")}
          </p>
          <p className="text-base sm:text-lg leading-7">{t("leadership.p2")}</p>
        </section>

        {/* Struggles Section */}
        <section className="mb-12">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-4">
            {t("struggles.heading")}
          </h3>
          <p className="mb-4 text-base sm:text-lg leading-7">
            {t("struggles.p1")}
          </p>
          <p className="text-base sm:text-lg leading-7">{t("struggles.p2")}</p>
        </section>

        {/* Impact Section */}
        <section>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-4">
            {t("impact.heading")}
          </h3>
          <ul className="list-disc list-inside space-y-2 text-base sm:text-lg leading-7 pl-2 sm:pl-4">
            <li>{t("impact.points.1")}</li>
            <li>{t("impact.points.2")}</li>
            <li>{t("impact.points.3")}</li>
            <li>{t("impact.points.4")}</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
