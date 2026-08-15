import { Metadata } from "next";
import VerifyMemberClient from "@/src/components/verify/VerifyMemberClient";
import { constructNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = constructNoIndexMetadata("Member Identity Verification");

export default async function VerifyMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VerifyMemberClient memberId={id} />;
}
