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
  const data = isTelugu ? SEO_PAGE_DATA.empowerment.te : SEO_PAGE_DATA.empowerment.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/empowerment",
    locale,
    keywords: data.keywords,
    image: "/empowerment.png",
    type: "article",
  });
}

export default async function EmpowermentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "empowerment" });
  const isTelugu = locale === "te";

  return (
    <div className="bg-amber-50 text-gray-900 flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-16 leading-relaxed">
      {/* Schema.org Article & Breadcrumbs */}
      <ArticleJsonLd
        title={isTelugu ? SEO_PAGE_DATA.empowerment.te.title : SEO_PAGE_DATA.empowerment.en.title}
        description={isTelugu ? SEO_PAGE_DATA.empowerment.te.description : SEO_PAGE_DATA.empowerment.en.description}
        url={`/${locale}/empowerment`}
        image="/empowerment.png"
      />
      <BreadcrumbJsonLd
        items={[
          { name: isTelugu ? "హోమ్" : "Home", url: `/${locale}` },
          { name: isTelugu ? "సాధికారత" : "Empowerment", url: `/${locale}/empowerment` },
        ]}
      />

      {/* ======= Hero Section ======= */}
      <header className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
        {/* Left Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-800 mb-4 drop-shadow-sm">
            {t("hero.title")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-red-900 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <Image
            src="/empowerment.png"
            alt="Symbol of Education, Unity, and Empowerment for Vaddera youth"
            width={300}
            height={300}
            priority
            sizes="(max-width: 768px) 75vw, 300px"
            className="w-2/3 sm:w-1/2 md:w-[260px] lg:w-[300px] h-auto object-contain drop-shadow-md"
          />
        </div>
      </header>

      {/* Divider */}
      <h2 className="text-xl sm:text-2xl md:text-3xl text-center text-red-800 font-bold lg:underline mb-12">
        {t("hero.subtitle2")}
      </h2>

      {/* ======= Content Sections ======= */}
      <main className="max-w-5xl space-y-10 w-full">
        {/* Birth of the Movement */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("birth.heading")}
          </h3>
          <p className="mb-3 text-base sm:text-lg">{t("birth.p1")}</p>
          <p className="text-base sm:text-lg">{t("birth.p2")}</p>
        </section>

        {/* Awareness to Awakening */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("awareness.heading")}
          </h3>
          <p className="mb-3 text-base sm:text-lg">{t("awareness.p1")}</p>
          <p className="text-base sm:text-lg">{t("awareness.p2")}</p>
        </section>

        {/* Historic Protests */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("protests.heading")}
          </h3>
          <p className="text-base sm:text-lg">{t("protests.p1")}</p>
        </section>

        {/* Political Recognition */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("politics.heading")}
          </h3>
          <p className="text-base sm:text-lg">{t("politics.p1")}</p>
        </section>

        {/* Social Empowerment Goals */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("goals.heading")}
          </h3>
          <ul className="list-disc list-inside space-y-2 text-base sm:text-lg">
            <li>{t("goals.points.1")}</li>
            <li>{t("goals.points.2")}</li>
            <li>{t("goals.points.3")}</li>
            <li>{t("goals.points.4")}</li>
            <li>{t("goals.points.5")}</li>
          </ul>
        </section>

        {/* Unity as Strength */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            {t("unity.heading")}
          </h3>
          <p className="mb-3 text-base sm:text-lg">{t("unity.p1")}</p>
          <blockquote className="italic text-center text-red-800 font-semibold text-lg md:text-xl mt-6 p-4 bg-amber-100/60 rounded-xl border border-amber-200">
            “{t("unity.quote")}”
          </blockquote>
        </section>
      </main>
    </div>
  );
}
