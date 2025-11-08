"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const languages = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
];

interface Props {
  mobile?: boolean; // 👈 optional flag for mobile view
  onSelect?: () => void; // 👈 callback to close menu
}

export const LanguageDropdown: React.FC<Props> = ({
  mobile = false,
  onSelect,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = pathname.split("/")[1] || "en";

  const handleChange = (newLocale: string) => {
    setIsOpen(false);
    onSelect?.();
    if (newLocale === currentLocale) return;

    const parts = pathname.split("/");
    parts[1] = newLocale;
    const newPath = parts.join("/") || "/";
    router.push(newPath);
  };

  // ✅ Mobile version — simple list of buttons
  if (mobile) {
    return (
      <div className="flex gap-3 px-4 py-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentLocale === lang.code
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  // ✅ Desktop dropdown
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm font-medium"
      >
        {languages.find((l) => l.code === currentLocale)?.label ?? "English"} ▼
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                currentLocale === lang.code ? "font-semibold" : ""
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
