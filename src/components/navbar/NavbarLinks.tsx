"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface DropdownItem {
  name: string;
  href: string;
}

interface LinkItem {
  name: string;
  href: string;
  dropdown?: DropdownItem[];
}

interface Props {
  links: LinkItem[];
}

export const NavbarLinks: React.FC<Props> = ({ links }) => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <ul className="hidden md:flex items-center gap-6 relative">
      {links.map((l) => (
        <li
          key={l.href}
          className="relative group"
          onMouseEnter={() => setOpenDropdown(l.name)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <Link
            href={l.href}
            className={`py-2 transition-colors ${
              pathname === l.href
                ? "text-orange-600 font-semibold"
                : "text-gray-700 hover:text-orange-500"
            }`}
            aria-current={pathname === l.href ? "page" : undefined}
          >
            {l.name}
          </Link>

          {/* ✅ Dropdown Menu */}
          {l.dropdown && openDropdown === l.name && (
            <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
              {l.dropdown.map((sub) => (
                <li key={sub.href}>
                  <Link
                    href={sub.href}
                    className={`block px-4 py-2 text-sm hover:bg-orange-50 ${
                      pathname === sub.href
                        ? "text-orange-600 font-semibold"
                        : "text-gray-700 hover:text-orange-500"
                    }`}
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};
