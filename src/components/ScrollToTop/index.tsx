"use client";

import { useEffect, useState } from "react";
import { HiOutlineChevronUp } from "react-icons/hi2";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[99]">
      <button
        onClick={scrollToTop}
        type="button"
        aria-label="Scroll to top of page"
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-[#6A160A] text-white shadow-lg shadow-[#6A160A]/25 transition-all duration-300 hover:bg-[#0F5F54] hover:scale-110 active:scale-95 border border-white/20 backdrop-blur"
      >
        <HiOutlineChevronUp className="h-6 w-6 stroke-[2.5]" />
      </button>
    </div>
  );
}