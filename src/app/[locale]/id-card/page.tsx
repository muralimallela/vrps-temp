import { Metadata } from "next";
import IdCardClient from "@/src/components/id-card/IdCardClient";
import { constructNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = constructNoIndexMetadata("Digital Member ID Card");

export default function IdCardPage() {
  return <IdCardClient />;
}
