import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { POSITION_COLORS } from "@/lib/positions";

async function getPlayers() {
  const { data } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function RosterPage() {
  const players = await getPlayers();

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-16 pb-8 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Roster</h1>
        <Link
          href="/roster/new"
          className="bg-emerald-500 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-emerald-600 transition-colors"
        >
          + Add Player
        </Link>
      </div>

      {players.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-sm">No players yet.</p>
          <Link href="/roster/new" className="text-emerald-400 text-sm font-medium mt-2 inline-block">
            Add your first player →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {players.map((player) => (
            <Link
              key={player.id}
              href={`/roster/${player.id}`}
              className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div>
                <p className="font-semibold text-white">{player.name}</p>
                <p className="text-sm text-gray-500">#{player.jersey_number}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${POSITION_COLORS[player.position] ?? "bg-gray-500/10 text-gray-400"}`}>
                {player.position}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
