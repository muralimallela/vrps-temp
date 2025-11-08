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

interface NavbarActionsProps {
  isMobile?: boolean;
}

export const NavbarActions: React.FC<NavbarActionsProps> = ({ isMobile }) => {
  const t = useTranslations("Navbar");

  // ✅ Common UI for sign-in & sign-up buttons
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

  // Desktop view
  if (!isMobile) {
    return (
      <div className="hidden md:flex items-center gap-4">
        <SignedOut>{authButtons}</SignedOut>
        <SignedIn>
          <div className="border-3 border-white rounded-full p-0 flex items-center justify-center">
            <UserButton />
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
        <div className="flex justify-center">
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
};
