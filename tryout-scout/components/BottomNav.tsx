"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", icon: "⚽" },
  { href: "/sessions", label: "Sessions", icon: "📋" },
  { href: "/roster", label: "Roster", icon: "👥" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      {links.map(({ href, label, icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 text-xs font-medium w-full py-2 transition-colors ${
              active ? "text-green-600" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <span className="text-xl">{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
