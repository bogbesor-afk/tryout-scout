import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function getPlayers() {
  const { data } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

const POSITION_COLORS: Record<string, string> = {
  Goalkeeper: "bg-yellow-100 text-yellow-800",
  Defender: "bg-blue-100 text-blue-800",
  Midfielder: "bg-green-100 text-green-800",
  Forward: "bg-red-100 text-red-800",
};

export default async function RosterPage() {
  const players = await getPlayers();

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Roster</h1>
        <Link
          href="/roster/new"
          className="bg-green-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          + Add Player
        </Link>
      </div>

      {players.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-sm">No players yet.</p>
          <Link href="/roster/new" className="text-green-600 text-sm font-medium mt-2 inline-block">
            Add your first player →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {players.map((player) => (
            <Link
              key={player.id}
              href={`/roster/${player.id}`}
              className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-900">{player.name}</p>
                <p className="text-sm text-gray-400">#{player.jersey_number}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${POSITION_COLORS[player.position] ?? "bg-gray-100 text-gray-600"}`}>
                {player.position}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
