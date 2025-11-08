"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const NavbarBrand: React.FC = () => {
  const t = useTranslations("Navbar");
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/vrps-logo.png" width={40} height={40} alt="vrps logo" />

      <span className="font-bold text-sm lg:text-lg">
        {t("title")}
      </span>
    </Link>
  );
};
