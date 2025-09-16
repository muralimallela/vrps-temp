import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export const NavbarActions: React.FC = () => (
  <div className="hidden md:flex items-center gap-4">
    <SignedOut>
      <span className="text-gray-700 hover:text-orange-600 cursor-pointer">
        <SignInButton>
          <button className="cursor-pointer">Sign in</button>
        </SignInButton>
      </span>
      <span className="px-4 py-2 rounded-lg bg-orange-600 cursor-pointer text-white hover:bg-orange-700 transition">
        <SignUpButton>
          <button className="cursor-pointer">Sign up</button>
        </SignUpButton>
      </span>
    </SignedOut>
    <SignedIn>
      <div className="border-3 border-white rounded-[100%] aspect-square p-0 flex content-center">
        <UserButton />
      </div>
    </SignedIn>
  </div>
);
