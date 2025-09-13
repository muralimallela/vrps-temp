"use client";
import React, { useState } from "react";
import { useHideOnScroll } from "../hooks/useHideOnScroll";
import { NavbarBrand } from "./NavbarBrand";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarActions } from "./NavbarActions";
import { NavbarToggle } from "./NavbarToggle";
import { NavbarMobileMenu } from "./NavbarMobileMenu";

const navLinks = [
  { name: "Home", href: "/home" },
  { name: "About", href: "/about" },
  { name: "Community Members", href: "/community-members" },
  { name: "Photo Galleries", href: "/photo-galleries" },
  { name: "News & Items", href: "/news-and-items" },
];

const menuItems = [
  { name: "Home", href: "/home" },
  { name: "About", href: "/about" },
  { name: "Community Members", href: "/community-members" },
  { name: "Photo Galleries", href: "/photo-galleries" },
  { name: "News & Items", href: "/news-and-items" },
];

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { hidden, atTop } = useHideOnScroll({ delta: 10, revealTop: 96 });

  const containerSkin = atTop
    ? "bg-[#f5e6cf] border-b border-transparent"
    : "bg-[#f5e6cf]  border-b border-gray-200 shadow-sm";

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 w-full z-50 transition-transform duration-300 ",
          hidden ? "-translate-y-full" : "translate-y-0",
          containerSkin,
        ].join(" ")}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <NavbarBrand />
          <NavbarLinks links={navLinks} />
          <NavbarActions />
          <NavbarToggle
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
        <NavbarMobileMenu
          items={menuItems}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      </nav>
      <div className="h-16 md:h-18" />
    </>
  );
};
