"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { POSITION_COLORS } from "@/lib/positions";

interface Player {
  id: string;
  name: string;
  jersey_number: string;
  position: string;
  avgRating: number | null;
}

type SortOption = "recent" | "name" | "position" | "rating";

export default function RosterList({ players }: { players: Player[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    let list = players;

    if (lower) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.jersey_number.toLowerCase().includes(lower) ||
          p.position.toLowerCase().includes(lower)
      );
    }

    const sorted = [...list];
    if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "position") {
      sorted.sort((a, b) => a.position.localeCompare(b.position));
    } else if (sort === "rating") {
      sorted.sort((a, b) => (b.avgRating ?? -1) - (a.avgRating ?? -1));
    }
    // "recent" keeps the incoming (created_at desc) order as-is

    return sorted;
  }, [players, query, sort]);

  if (players.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-20">
        <p className="text-sm">No players yet.</p>
        <Link href="/roster/new" className="text-emerald-400 text-sm font-medium mt-2 inline-block">
          Add your first player →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, number, or position"
          className="flex-1 bg-gray-900 border border-gray-800 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-gray-900 border border-gray-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="recent">Recent</option>
          <option value="name">Name</option>
          <option value="position">Position</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 text-sm mt-12">No players match &quot;{query}&quot;.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((player) => (
            <Link
              key={player.id}
              href={`/roster/${player.id}`}
              className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div>
                <p className="font-semibold text-white">{player.name}</p>
                <p className="text-sm text-gray-500">#{player.jersey_number}</p>
              </div>
              <div className="flex items-center gap-3">
                {player.avgRating !== null && (
                  <span className="text-sm font-bold text-emerald-400">{player.avgRating.toFixed(1)}</span>
                )}
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${POSITION_COLORS[player.position] ?? "bg-gray-500/10 text-gray-400"}`}>
                  {player.position}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
