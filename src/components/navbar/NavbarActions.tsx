"use client";
import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NavbarActionsProps {
  isMobile?: boolean;
}

type AppUser = {
  roles: string[];
  isMember: boolean;
};

export const NavbarActions: React.FC<NavbarActionsProps> = ({ isMobile }) => {
  const t = useTranslations("Navbar");
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/users/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setAppUser(data.data);
      }
    };
    load();
  }, []);


  const authButtons = (
    <>
      <span className="text-gray-700 hover:text-orange-600 cursor-pointer">
        <SignInButton mode="modal">
          <button className="cursor-pointer">{t("login")}</button>
        </SignInButton>
      </span>

      <span className="px-4 py-2 rounded-lg bg-orange-600 cursor-pointer text-white hover:bg-orange-700 transition">
        <SignUpButton mode="modal">
          <button className="cursor-pointer">{t("signup")}</button>
        </SignUpButton>
      </span>
    </>
  );

  const userLinks = (
    <>
      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setIsAccountOpen(false)}>
        Profile
      </Link>
      <Link href="/address" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setIsAccountOpen(false)}>
        Address
      </Link>
      <Link href="/donations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setIsAccountOpen(false)}>
        Support VRPS
      </Link>
      <Link href="/membership" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setIsAccountOpen(false)}>
        Become a Member
      </Link>
      {appUser?.isMember && (
        <Link href="/id-card" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setIsAccountOpen(false)}>
          My Member ID Card
        </Link>
      )}
      {appUser?.roles?.includes("admin") && (
        <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setIsAccountOpen(false)}>
          Admin
        </Link>
      )}
    </>
  );

  // Desktop view
  if (!isMobile) {
    return (
      <div className="hidden md:flex items-center gap-4">
        <SignedOut>{authButtons}</SignedOut>
        <SignedIn>
          <div className="flex items-center gap-3 relative">
            <button
              type="button"
              onClick={() => setIsAccountOpen((prev) => !prev)}
              className="rounded-md border border-[#e7d1ba] bg-white px-3 py-1.5 text-sm font-semibold text-[#6A160A] hover:bg-[#fff3e5]"
            >
              Account
            </button>
            {isAccountOpen && (
              <div className="absolute right-12 top-10 z-50 w-44 rounded-lg border border-gray-200 bg-white shadow-lg">
                {userLinks}
              </div>
            )}
            <div className="border-3 border-white rounded-full p-0 flex items-center justify-center">
              <UserButton />
            </div>
          </div>
        </SignedIn>
      </div>
    );
  }

  // Mobile view
  return (
    <div className="flex flex-col gap-3 mt-3 border-t border-gray-200 pt-3 px-4">
      <SignedOut>{authButtons}</SignedOut>
      <SignedIn>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setIsAccountOpen((prev) => !prev)}
            className="rounded-md border border-[#e7d1ba] bg-white px-3 py-2 text-left text-sm font-semibold text-[#6A160A]"
          >
            Account
          </button>
          {isAccountOpen && (
            <div className="rounded-md border border-gray-200 bg-white">
              {userLinks}
            </div>
          )}
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
};
