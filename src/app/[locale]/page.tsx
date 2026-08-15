import { Metadata } from "next";
import Hero from "../../components/hero/Hero";
import CommunityCarousel from "../../components/community-carousel/CommunityCarousel";
import { VadderaBrief } from "../../components/vaddera-brief/VadderaBrief";
import { ObjectivesBrief } from "../../components/objectives-brief/ObjectivesBrief";
import HistoryBrief from "../../components/history-brief/HistoryBrief";
import AssemblySiegeBrief from "../../components/assembly-siege-brief/AssemblySiegeBrief";
import CultureBrief from "../../components/culture-brief/CultureBrief";
import AwarenessBrief from "../../components/awareness-brief/AwarenessBrief";
import { setRequestLocale } from "next-intl/server";
import { constructMetadata, SEO_PAGE_DATA } from "@/src/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTelugu = locale === "te";
  const data = isTelugu ? SEO_PAGE_DATA.home.te : SEO_PAGE_DATA.home.en;

  return constructMetadata({
    title: data.title,
    description: data.description,
    path: "/",
    locale,
    keywords: data.keywords,
    image: "/VRPS-LOGO-FINAL.png",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <CommunityCarousel />
      <VadderaBrief />
      <ObjectivesBrief />
      <HistoryBrief />
      <hr className="border-t-2 border-white" />
      <AssemblySiegeBrief />
      <hr className="border-t-2 border-white" />
      <CultureBrief />
      <hr className="border-t-2 border-white" />
      <AwarenessBrief />
    </main>
  );
}
