"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { LanguageDropdown } from "./LanguageDropdown";
import { NavbarActions } from "./NavbarActions";

interface DropdownItem {
  name: string;
  href: string;
}

interface NavLink {
  name: string;
  href: string;
  dropdown?: DropdownItem[];
}

interface Props {
  items: NavLink[];
  isOpen: boolean;
  onClose: () => void;
}

export const NavbarMobileMenu: React.FC<Props> = ({
  items,
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="md:hidden border-t border-gray-200 bg-white shadow-sm">
      <ul className="flex flex-col p-2">
        {items.map((item) => (
          <li key={item.href} className="border-b border-gray-100">
            {item.dropdown ? (
              <>
                {/* Main Dropdown Button */}
                <button
                  className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-700 hover:text-orange-500 font-medium"
                  onClick={() => handleDropdownToggle(item.name)}
                >
                  <span>{item.name}</span>
                  {openDropdown === item.name ? (
                    <IoChevronUp className="text-gray-600" size={18} />
                  ) : (
                    <IoChevronDown className="text-gray-600" size={18} />
                  )}
                </button>

                {/* ✅ Dropdown Items */}
                {openDropdown === item.name && (
                  <ul className="pl-6 bg-gray-50 border-l border-orange-200 transition-all duration-200">
                    {item.dropdown.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className={`block px-4 py-2 rounded-md text-sm ${
                            pathname === sub.href
                              ? "text-orange-600 font-semibold"
                              : "text-gray-700 hover:text-orange-500"
                          }`}
                          onClick={onClose}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={`block px-4 py-3 rounded-md ${
                  pathname === item.href
                    ? "text-orange-600 font-semibold"
                    : item.name === "Log Out"
                    ? "text-red-600 hover:text-red-700"
                    : "text-gray-700 hover:text-orange-500"
                }`}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={onClose}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}

        {/* ✅ Language selector */}
        <li className="px-4 py-2">
          <LanguageDropdown mobile onSelect={onClose} />
        </li>

        {/* ✅ Actions (e.g. Login/Logout) */}
        <li className="px-4 py-2">
          <NavbarActions isMobile />
        </li>
      </ul>
    </div>
  );
};
