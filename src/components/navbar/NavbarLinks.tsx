import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Link {
  name: string;
  href: string;
}
interface Props {
  links: Link[];
}

export const NavbarLinks: React.FC<Props> = ({ links }) => {
  const pathname = usePathname();

  return (
    <ul className="hidden md:flex items-center gap-6">
      {links.map((l) => (
        <li key={l.href}>
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
        </li>
      ))}
    </ul>
  );
};
