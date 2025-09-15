import Image from "next/image";
import BriefSection from "../brief/BriefSection";

export default function AwarenessBrief() {
  return (
    <BriefSection
      title="From Awareness to Empowerment"
      description="The early phase of VRPS focused on awareness building. Activists organized meetings in villages, towns, and urban colonies where Vaddera families lived. They explained:"
      points={[
        "Why reservations were essential.",
        "How other backward communities progressed with state support.",
        "How the Vadderas could no longer remain silent.",
      ]}
      imageSrc="/history.png"
      imageAlt="Awareness efforts"
    />
  );
}
