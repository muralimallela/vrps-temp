import React from "react";
import { Metadata } from "next";
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
  const data = isTelugu ? SEO_PAGE_DATA.assemblySiege.te : SEO_PAGE_DATA.assemblySiege.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/assembly-siege",
    locale,
    keywords: data.keywords,
    image: "/assembly-siege.webp",
    type: "article",
  });
}

export default async function AssemblySiegePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "AssemblySiege" });
  const isTelugu = locale === "te";

  return (
    <div className="bg-[#FFFDF9] text-gray-900 min-h-screen pb-20">
      {/* Schema.org Article & Breadcrumbs */}
      <ArticleJsonLd
        title={isTelugu ? SEO_PAGE_DATA.assemblySiege.te.title : SEO_PAGE_DATA.assemblySiege.en.title}
        description={isTelugu ? SEO_PAGE_DATA.assemblySiege.te.description : SEO_PAGE_DATA.assemblySiege.en.description}
        url={`/${locale}/assembly-siege`}
        image="/assembly-siege.webp"
      />
      <BreadcrumbJsonLd
        items={[
          { name: isTelugu ? "హోమ్" : "Home", url: `/${locale}` },
          { name: isTelugu ? "అసెంబ్లీ ముట్టడి" : "Assembly Siege", url: `/${locale}/assembly-siege` },
        ]}
      />

      {/* ======= Hero Section ======= */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#36100B] via-[#4A120A] to-[#6A160A] py-16 md:py-24 text-white text-center shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-amber-100 max-w-2xl mx-auto font-medium leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>
      </header>

      {/* ======= Main Content ======= */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-16">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#6A160A] mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Chalo Assembly 1 */}
        <article className="bg-white rounded-3xl border border-[#e4c69d]/40 p-6 sm:p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[#6A160A]">
              {t("chaloAssembly1.heading")}
            </h3>
            <span className="bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
              {t("chaloAssembly1.date")}
            </span>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
            <p className="font-medium">{t("chaloAssembly1.p1")}</p>
            <p>{t("chaloAssembly1.p2")}</p>
          </div>
        </article>

        {/* Chalo Assembly 2 */}
        <article className="bg-white rounded-3xl border border-[#e4c69d]/40 p-6 sm:p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[#6A160A]">
              {t("chaloAssembly2.heading")}
            </h3>
            <span className="bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
              {t("chaloAssembly2.date")}
            </span>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
            <p className="font-medium">{t("chaloAssembly2.p1")}</p>
            <p>{t("chaloAssembly2.p2")}</p>
            <p>{t("chaloAssembly2.p3")}</p>
          </div>
        </article>

        {/* Assembly Demand 2023 */}
        <article className="bg-amber-50/50 rounded-3xl border border-amber-200/50 p-6 sm:p-8 md:p-10 shadow-md">
          <h3 className="text-xl sm:text-2xl font-bold text-[#6A160A] border-b border-amber-200/60 pb-4 mb-6">
            {t("assemblyMention.heading")}
          </h3>
          <p className="text-sm sm:text-base text-[#6A160A] font-semibold leading-relaxed text-justify">
            {t("assemblyMention.p1")}
          </p>
        </article>
      </main>
    </div>
  );
}
