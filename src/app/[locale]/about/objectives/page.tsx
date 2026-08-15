import React from "react";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HiOutlineSparkles } from "react-icons/hi2";
import { constructMetadata, SEO_PAGE_DATA } from "@/src/lib/seo";
import { AboutPageJsonLd, BreadcrumbJsonLd } from "@/src/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTelugu = locale === "te";
  const data = isTelugu ? SEO_PAGE_DATA.objectives.te : SEO_PAGE_DATA.objectives.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/about/objectives",
    locale,
    keywords: data.keywords,
    image: "/hero.png",
  });
}

export default async function AboutObjectivesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Objectives" });
  const isTelugu = locale === "te";

  // 11 core objectives
  const objectiveKeys = Array.from({ length: 11 }, (_, i) => String(i + 1));

  return (
    <div className="bg-[#FFFDF9] text-gray-900 min-h-screen pb-20">
      {/* Schema.org AboutPage & Breadcrumbs */}
      <AboutPageJsonLd
        title={isTelugu ? SEO_PAGE_DATA.objectives.te.title : SEO_PAGE_DATA.objectives.en.title}
        description={isTelugu ? SEO_PAGE_DATA.objectives.te.description : SEO_PAGE_DATA.objectives.en.description}
        url={`/${locale}/about/objectives`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: isTelugu ? "హోమ్" : "Home", url: `/${locale}` },
          { name: isTelugu ? "లక్ష్యాలు" : "Objectives", url: `/${locale}/about/objectives` },
        ]}
      />

      {/* ======= Hero Section ======= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#36100B] via-[#4A120A] to-[#6A160A] py-20 md:py-28 text-white text-center shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-white/10 px-4 py-1.5 text-xs font-bold text-amber-200 backdrop-blur-md mb-6 shadow-sm">
            <HiOutlineSparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            VRPS Mission
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
            {t("title")}
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-amber-100 max-w-3xl mx-auto font-medium leading-relaxed border-t border-amber-500/30 pt-6">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* ======= Objectives Grid Section ======= */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="rounded-3xl border border-[#e4c69d]/40 bg-white p-6 sm:p-10 shadow-xl backdrop-blur-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {objectiveKeys.map((key) => (
              <article
                key={key}
                className="group relative flex gap-4 p-5 rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#6A160A]/20"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-[#6A160A] font-extrabold text-base border border-amber-200/40 group-hover:bg-[#6A160A] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                  {key.padStart(2, "0")}
                </div>
                <div className="flex-1 pt-1.5">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                    {t(`list.${key}`)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* ======= Footer Note / Update Info Section ======= */}
          <div className="mt-12 p-6 sm:p-8 bg-amber-50/50 rounded-2xl border border-amber-200/50 text-center shadow-inner">
            <h2 className="text-xs text-amber-800 uppercase tracking-widest font-extrabold mb-2">
              Updates &amp; Announcements
            </h2>
            <p className="text-sm sm:text-base text-[#6A160A] font-semibold max-w-3xl mx-auto leading-relaxed">
              {t("introText")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
