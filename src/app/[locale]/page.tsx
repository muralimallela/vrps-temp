import Hero from "../../components/hero/Hero";
import CommunityCarousel from "../../components/community-carousel/CommunityCarousel";
import { VadderaBrief } from "../../components/vaddera-brief/VadderaBrief";
import HistoryBrief from "../../components/history-brief/HistoryBrief";
import CultureBrief from "../../components/culture-brief/CultureBrief";
import AwarenessBrief from "../../components/awareness-brief/AwarenessBrief";

export default function Page() {
  return (
    <>
      <Hero />
      <CommunityCarousel />
      <VadderaBrief />
      <HistoryBrief />
      <hr className=" border-20 border-white" />
      <CultureBrief />
      <hr className=" border-20 border-white" />
      <AwarenessBrief />
      <hr className=" border-20 border-white" />
    </>
  );
}
