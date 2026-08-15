import { Metadata } from "next";
import ProfileClient from "@/src/components/profile/ProfileClient";
import { constructNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = constructNoIndexMetadata("Member Profile Settings");

export default function ProfilePage() {
  return <ProfileClient />;
}
