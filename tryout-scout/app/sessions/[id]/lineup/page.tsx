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

export default async function LineupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lineup = await getLineup(id);

  return (
    <div className="px-6 py-8">
      <Link href={`/sessions/${id}`} className="text-sm text-gray-400 mb-6 flex items-center gap-1">
        ← Back to Session
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lineup</h1>

      <GenerateLineupButton sessionId={id} />

      {!lineup ? (
        <div className="text-center text-gray-400 mt-12">
          <div className="text-4xl mb-3">⚽</div>
          <p className="text-sm">No lineup yet. Add players to this session and rate them first.</p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-center">
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Formation</p>
            <p className="text-3xl font-bold text-green-700">{lineup.formation}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Starting XI</h2>
            <div className="flex flex-col gap-2">
              {(lineup.player_slots as string[]).map((slot, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-800">
                  <span className="text-green-600 font-bold">•</span>
                  {slot}
                </div>
              ))}
            </div>
          </div>

          {lineup.explanation && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Reasoning</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{lineup.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
