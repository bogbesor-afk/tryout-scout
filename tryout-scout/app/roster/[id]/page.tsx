import { supabase } from "@/lib/supabase";
import Link from "next/link";
import RatingsForm from "@/components/RatingsForm";
import GenerateSummaryButton from "@/components/GenerateSummaryButton";
import { POSITION_COLORS } from "@/lib/positions";

const CATEGORIES = [
  { key: "technical_skill", label: "Technical Skill" },
  { key: "speed", label: "Speed" },
  { key: "decision_making", label: "Decision Making" },
  { key: "effort", label: "Effort" },
  { key: "communication", label: "Communication" },
  { key: "positioning", label: "Positioning" },
];

async function getPlayer(id: string) {
  const { data } = await supabase.from("players").select("*").eq("id", id).single();
  return data;
}

async function getRatings(playerId: string) {
  const { data } = await supabase.from("coach_ratings").select("*").eq("player_id", playerId);
  return data ?? [];
}

async function getSummary(playerId: string) {
  const { data } = await supabase
    .from("summaries")
    .select("*")
    .eq("player_id", playerId)
    .order("generated_at", { ascending: false })
    .limit(1)
    .single();
  return data;
}

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [player, ratings, summary] = await Promise.all([
    getPlayer(id),
    getRatings(id),
    getSummary(id),
  ]);

  if (!player) {
    return <div className="min-h-screen bg-gray-950 px-6 pt-16 pb-8"><p className="text-gray-500">Player not found.</p></div>;
  }

  const ratingsMap = Object.fromEntries(ratings.map((r) => [r.category, r.rating]));

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-16 pb-8 max-w-md mx-auto">
      <Link href="/roster" className="text-sm text-gray-500 mb-6 inline-block">
        ← Roster
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{player.name}</h1>
          <p className="text-sm text-gray-500">#{player.jersey_number}</p>
        </div>
        <span className={`ml-auto text-xs font-medium px-3 py-1 rounded-full ${POSITION_COLORS[player.position] ?? "bg-gray-500/10 text-gray-400"}`}>
          {player.position}
        </span>
      </div>

      {summary && (
        <div className="mb-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-4">
          <h2 className="text-sm font-semibold text-emerald-400 mb-2">AI Summary</h2>
          {summary.strengths && <p className="text-sm text-gray-300 mb-1"><span className="font-medium text-gray-200">Strengths:</span> {summary.strengths}</p>}
          {summary.weaknesses && <p className="text-sm text-gray-300 mb-1"><span className="font-medium text-gray-200">Weaknesses:</span> {summary.weaknesses}</p>}
          {summary.standout_moments && <p className="text-sm text-gray-300 mb-1"><span className="font-medium text-gray-200">Standout:</span> {summary.standout_moments}</p>}
          {summary.overall_assessment && <p className="text-sm text-gray-300 mt-2 italic">{summary.overall_assessment}</p>}
        </div>
      )}

      <GenerateSummaryButton playerId={id} />

      <h2 className="text-lg font-bold text-white mb-4">Coach Ratings</h2>
      <RatingsForm playerId={id} categories={CATEGORIES} existingRatings={ratingsMap} />
    </div>
  );
}
