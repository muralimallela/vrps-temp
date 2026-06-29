"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HiOutlineBars3,
  HiOutlineChartBarSquare,
  HiOutlineCreditCard,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineNewspaper,
  HiOutlineUserGroup,
  HiOutlineXMark,
} from "react-icons/hi2";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: HiOutlineChartBarSquare },
  { href: "/admin/users", label: "Users", icon: HiOutlineUserGroup },
  { href: "/admin/committee", label: "Executive Committee", icon: HiOutlineUserGroup },
  { href: "/admin/memberships", label: "Memberships", icon: HiOutlineCreditCard },
  { href: "/admin/donations", label: "Donations", icon: HiOutlineHeart },
  { href: "/admin/news", label: "News & Gallery", icon: HiOutlineNewspaper },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    const hrefWithoutLocale = href.split("/").slice(1).join("/");
    return pathWithoutLocale === hrefWithoutLocale;
  };

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close admin menu" : "Open admin menu"}
        className="fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-xl bg-[#0F5F54] text-white shadow-lg shadow-[#0F5F54]/20 transition hover:bg-[#0D4A42] lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiOutlineXMark className="h-6 w-6" /> : <HiOutlineBars3 className="h-6 w-6" />}
      </button>

      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-[#ead9c2] bg-[#fffaf3] text-[#2B0904] shadow-sm transition-transform duration-300 lg:sticky lg:translate-x-0`}
      >
        <div className="border-b border-[#ead9c2] px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#5A1C16] text-white shadow-sm">
              <HiOutlineChartBarSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#5A1C16]">VRPS Admin</h1>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.16em] text-[#9A7650]">
                Management Panel
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 p-4" aria-label="Admin navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-[#0F5F54] text-white shadow-md shadow-[#0F5F54]/15"
                    : "text-[#694136] hover:bg-[#f8ead8] hover:text-[#5A1C16]"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    active ? "text-white" : "text-[#A56C4D] transition group-hover:text-[#5A1C16]"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-[#ead9c2] p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-[#694136] transition hover:bg-[#f8ead8] hover:text-[#5A1C16]"
          >
            <HiOutlineHome className="h-5 w-5 text-[#A56C4D]" />
            <span>Back to website</span>
          </Link>
          <div className="flex items-center gap-3 rounded-xl border border-[#ead9c2] bg-white px-3.5 py-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#f3e1cc] text-sm font-bold text-[#5A1C16]">
              A
            </div>
            <div>
              <p className="text-xs text-[#9A7650]">Logged in as</p>
              <p className="text-sm font-semibold text-[#5A1C16]">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
