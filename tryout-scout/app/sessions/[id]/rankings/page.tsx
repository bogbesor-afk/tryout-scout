import { supabase } from "@/lib/supabase";
import Link from "next/link";
import GenerateRankingsButton from "@/components/GenerateRankingsButton";

async function getRankings(sessionId: string) {
  const { data } = await supabase
    .from("rankings")
    .select("*, players(name, jersey_number, position)")
    .eq("session_id", sessionId)
    .order("position")
    .order("rank");
  return data ?? [];
}

async function getPlayerCount(sessionId: string) {
  const { count } = await supabase
    .from("players")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId);
  return count ?? 0;
}

export default async function RankingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [rankings, playerCount] = await Promise.all([getRankings(id), getPlayerCount(id)]);

  const byPosition: Record<string, typeof rankings> = {};
  for (const r of rankings) {
    if (!byPosition[r.position]) byPosition[r.position] = [];
    byPosition[r.position].push(r);
  }

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-16 pb-8 max-w-md mx-auto">
      <Link href={`/sessions/${id}`} className="text-sm text-gray-500 mb-6 inline-block">
        ← Back to Session
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Rankings</h1>

      <GenerateRankingsButton sessionId={id} disabled={playerCount === 0} />

      {playerCount === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-sm">Add players to this session before generating rankings.</p>
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-sm">No rankings yet. Rate your players, then generate rankings above.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          {Object.entries(byPosition).map(([position, players]) => (
            <div key={position}>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">{position}</h2>
              <div className="flex flex-col gap-2">
                {players.map((r) => (
                  <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-600 w-6">#{r.rank}</span>
                      <div>
                        <p className="font-semibold text-white">{r.players?.name}</p>
                        <p className="text-xs text-gray-500">#{r.players?.jersey_number}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{Number(r.score).toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
