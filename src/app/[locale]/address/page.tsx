import { Metadata } from "next";
import AddressClient from "@/src/components/address/AddressClient";
import { constructNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = constructNoIndexMetadata("Member Address Settings");

export default function AddressPage() {
  return <AddressClient />;
}
