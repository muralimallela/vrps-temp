import React from "react";
import Link from "next/link";
import Image from "next/image";

export const NavbarBrand: React.FC = () => (
  <Link href="/" className="flex items-center gap-2">
    <Image src="/vrps-logo.png" width={40} height={40} alt="vrps logo"/>

    <span className="font-medium">Vaddera Reservation Porata Samithi</span>
  </Link>
);
