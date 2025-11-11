"use client";
import React, { useState } from "react";
import { useHideOnScroll } from "../hooks/useHideOnScroll";
import { NavbarBrand } from "./NavbarBrand";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarActions } from "./NavbarActions";
import { NavbarToggle } from "./NavbarToggle";
import { NavbarMobileMenu } from "./NavbarMobileMenu";
import { LanguageDropdown } from "./LanguageDropdown";
import { useTranslations } from "next-intl";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { hidden, atTop } = useHideOnScroll({ delta: 10, revealTop: 96 });
  const t = useTranslations("Navbar");

  const navLinks = [
    { name: t("home"), href: "/" },
    {
      name: t("about.name"),
      href: "#",
      dropdown: [
        { name: t("about.history"), href: "/history" },
        { name: t("about.vadderaCulture"), href: "/vaddera-culture" },
        { name: t("about.empowerment"), href: "/empowerment" },
      ],
    },
    { name: t("communityMembers"), href: "/community-members" },
    { name: t("photoGalleries"), href: "/photo-galleries" },
    { name: t("newsAndItems"), href: "/news-and-items" },
  ];
  const containerSkin = atTop
    ? "bg-[#f5e6cf] border-b border-transparent"
    : "bg-[#f5e6cf] border-b border-gray-200 shadow-sm";

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 w-full z-50 transition-transform duration-300",
          hidden ? "-translate-y-full" : "translate-y-0",
          containerSkin,
        ].join(" ")}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
          <NavbarBrand />
          <div className="hidden md:flex items-center gap-4">
            <NavbarLinks links={navLinks} />
            <LanguageDropdown />
            <NavbarActions />
          </div>
          <NavbarToggle
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
        <NavbarMobileMenu
          items={navLinks}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      </nav>
      <div className="h-16 md:h-18" />
    </>
  );
};
