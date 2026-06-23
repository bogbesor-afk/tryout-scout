"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Session {
  id: string;
  name: string;
}

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (sessionsOpen) {
      supabase
        .from("sessions")
        .select("id, name")
        .order("created_at", { ascending: false })
        .then(({ data }) => setSessions(data ?? []));
    }
  }, [sessionsOpen]);

  function close() {
    setOpen(false);
    setSessionsOpen(false);
  }

  return (
    <>
      {/* Menu button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 flex flex-col gap-1.5 p-2.5"
        aria-label="Open menu"
      >
        <span className="block w-6 h-0.5 bg-white drop-shadow-md" />
        <span className="block w-6 h-0.5 bg-white drop-shadow-md" />
        <span className="block w-6 h-0.5 bg-white drop-shadow-md" />
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={close} />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gray-950 z-50 transform transition-transform duration-300 overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <span className="text-white font-bold text-lg tracking-wide uppercase">Menu</span>
          <button onClick={close} className="text-gray-400 text-2xl leading-none" aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="flex flex-col px-4 py-6 gap-1">
          {/* Home */}
          <Link
            href="/"
            onClick={close}
            className="text-white text-base font-medium px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Home
          </Link>

          {/* Sessions — expandable */}
          <button
            onClick={() => setSessionsOpen((s) => !s)}
            className="flex items-center justify-between text-white text-base font-medium px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors w-full text-left"
          >
            Sessions
            <span className={`text-gray-400 text-sm transition-transform duration-200 ${sessionsOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          {sessionsOpen && (
            <div className="flex flex-col gap-1 ml-4 border-l border-gray-800 pl-3">
              <Link
                href="/sessions/new"
                onClick={close}
                className="text-emerald-400 text-sm font-medium px-3 py-2 rounded-xl hover:bg-gray-800 transition-colors"
              >
                + New Session
              </Link>
              {sessions.length === 0 ? (
                <p className="text-gray-600 text-xs px-3 py-2">No sessions yet</p>
              ) : (
                sessions.map((s) => (
                  <Link
                    key={s.id}
                    href={`/sessions/${s.id}`}
                    onClick={close}
                    className="text-gray-300 text-sm px-3 py-2 rounded-xl hover:bg-gray-800 transition-colors truncate"
                  >
                    {s.name}
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Roster */}
          <Link
            href="/roster"
            onClick={close}
            className="text-white text-base font-medium px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Roster
          </Link>
        </nav>
      </div>
    </>
  );
}
