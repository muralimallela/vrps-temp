import { Metadata } from "next";
import DonationsHistoryClient from "@/src/components/donations/DonationsHistoryClient";
import { constructNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = constructNoIndexMetadata("My Contribution History");

export default function DonationHistoryPage() {
  return <DonationsHistoryClient />;
}
