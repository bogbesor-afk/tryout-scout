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

export default async function RankingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rankings = await getRankings(id);

  const byPosition: Record<string, typeof rankings> = {};
  for (const r of rankings) {
    if (!byPosition[r.position]) byPosition[r.position] = [];
    byPosition[r.position].push(r);
  }

  return (
    <div className="px-6 py-8">
      <Link href={`/sessions/${id}`} className="text-sm text-gray-400 mb-6 flex items-center gap-1">
        ← Back to Session
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rankings</h1>

      <GenerateRankingsButton sessionId={id} />

      {rankings.length === 0 ? (
        <div className="text-center text-gray-400 mt-12">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-sm">No rankings yet. Add players to this session and rate them first.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          {Object.entries(byPosition).map(([position, players]) => (
            <div key={position}>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">{position}</h2>
              <div className="flex flex-col gap-2">
                {players.map((r) => (
                  <div key={r.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-300 w-6">#{r.rank}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{r.players?.name}</p>
                        <p className="text-xs text-gray-400">#{r.players?.jersey_number}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-600">{Number(r.score).toFixed(1)}</span>
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
