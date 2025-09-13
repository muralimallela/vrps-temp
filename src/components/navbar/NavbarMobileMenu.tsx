import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Link {
  name: string;
  href: string;
}

interface Props {
  items: Link[];
  isOpen: boolean;
  onClose: () => void;
}

export const NavbarMobileMenu: React.FC<Props> = ({
  items,
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-gray-200 bg-white">
      <ul className="flex flex-col p-2">
        {items.map((item) => (
          <li key={item.href}>
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
          </li>
        ))}
        <li className="px-4 py-2 flex gap-4">
          <Link href="/login" className="text-gray-700 hover:text-orange-600">
            Login
          </Link>
          <Link
            href="/signup"
            className="ml-auto px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
          >
            Sign Up
          </Link>
        </li>
      </ul>
    </div>
  );
};
