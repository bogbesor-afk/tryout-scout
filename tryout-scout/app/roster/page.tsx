import Link from "next/link";
import { supabase } from "@/lib/supabase";
import RosterList from "@/components/RosterList";

async function getPlayersWithRatings() {
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: false });

  if (!players || players.length === 0) return [];

  const { data: ratings } = await supabase
    .from("coach_ratings")
    .select("player_id, rating")
    .in("player_id", players.map((p) => p.id));

  return players.map((player) => {
    const playerRatings = (ratings ?? []).filter((r) => r.player_id === player.id);
    const avgRating = playerRatings.length > 0
      ? playerRatings.reduce((sum, r) => sum + r.rating, 0) / playerRatings.length
      : null;
    return { ...player, avgRating };
  });
}

export default async function RosterPage() {
  const players = await getPlayersWithRatings();

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

      <RosterList players={players} />
    </div>
  );
}
