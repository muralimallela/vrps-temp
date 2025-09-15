import Image from "next/image";
import BriefSection from "../brief/BriefSection";

export default function HistoryBrief() {
  return (
    <BriefSection
      title="History of VRPS (Vaddera Reservation Porata Samithi)"
      subtitle="Origins and Early History"
      description="The Vaddera Reservation Porata Samithi (VRPS) emerged as a strong socio-political movement representing the aspirations of the Vaddera community. The slogan “Gunnu Debba, Kalandebba – Kulaaniki Avasaaraṁ” (both the hammer blow and the chisel blow are equally necessary for the community) became a rallying cry for unity and self-respect."
      imageSrc="/history.png"
      imageAlt="History of VRPS"
    />
  );
}
