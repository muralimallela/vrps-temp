import Image from "next/image";
import BriefSection from "../brief/BriefSection";

export default function CultureBrief() {
  return (
    
    <BriefSection
      title="Cultural and Social Significance"
      content={
        <>
          VRPS is more than just a political organization; it is a cultural
          renaissance. It revived pride in Vaddera identity, connected youth
          with the legacy of Ambedkar and Obanna, and created a new wave of
          confidence.
          <br />
          <span className="font-bold">
            The movement gave the community a platform to say loudly and
            clearly:
          </span>
          <br />
          <span className="italic">
            “We will no longer remain invisible. Our hammer and chisel have
            built this nation; now we demand our rightful place in it.”
          </span>
        </>
      }
      imageSrc="/culture.png"
      imageAlt="Cultural significance"
    />
  );
}
