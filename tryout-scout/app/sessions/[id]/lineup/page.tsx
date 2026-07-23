import { supabase } from "@/lib/supabase";
import Link from "next/link";
import GenerateLineupButton from "@/components/GenerateLineupButton";

async function getLineup(sessionId: string) {
  const { data } = await supabase
    .from("lineups")
    .select("*")
    .eq("session_id", sessionId)
    .order("id", { ascending: false })
    .limit(1)
    .single();
  return data;
}

async function getPlayerCount(sessionId: string) {
  const { count } = await supabase
    .from("players")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId);
  return count ?? 0;
}

export default async function LineupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lineup, playerCount] = await Promise.all([getLineup(id), getPlayerCount(id)]);

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-16 pb-8 max-w-md mx-auto">
      <Link href={`/sessions/${id}`} className="text-sm text-gray-500 mb-6 inline-block">
        ← Back to Session
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Lineup</h1>

      <GenerateLineupButton sessionId={id} disabled={playerCount === 0} />

      {playerCount === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-sm">Add players to this session before generating a lineup.</p>
        </div>
      ) : !lineup ? (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-sm">No lineup yet. Rate your players, then generate a lineup above.</p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4 text-center">
            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide">Formation</p>
            <p className="text-3xl font-bold text-emerald-400">{lineup.formation}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Starting XI</h2>
            <div className="flex flex-col gap-2">
              {(lineup.player_slots as string[]).map((slot, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-emerald-400 font-bold">•</span>
                  {slot}
                </div>
              ))}
            </div>
          </div>

          {lineup.explanation && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Reasoning</h2>
              <p className="text-sm text-gray-300 leading-relaxed">{lineup.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
