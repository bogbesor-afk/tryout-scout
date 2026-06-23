"use client";

import { useState } from "react";
import Link from "next/link";

const menuItems = [
  { href: "/sessions", label: "Sessions" },
  { href: "/sessions/new", label: "New Session" },
  { href: "/roster", label: "Roster" },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Menu button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 flex flex-col gap-1.5 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm"
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-gray-800" />
        <span className="block w-5 h-0.5 bg-gray-800" />
        <span className="block w-5 h-0.5 bg-gray-800" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gray-950 z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <span className="text-white font-bold text-lg tracking-wide uppercase">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 text-2xl leading-none"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col px-4 py-6 gap-2">
          {menuItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-white text-base font-medium px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
