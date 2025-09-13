import React from "react";

interface Props {
  isOpen: boolean;
  onClick: () => void;
}

export const NavbarToggle: React.FC<Props> = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100"
    aria-label="Toggle menu"
    aria-expanded={isOpen}
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  </button>
);
