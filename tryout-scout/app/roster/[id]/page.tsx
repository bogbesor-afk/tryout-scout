import { supabase } from "@/lib/supabase";
import Link from "next/link";
import RatingsForm from "@/components/RatingsForm";
import GenerateSummaryButton from "@/components/GenerateSummaryButton";

const POSITION_COLORS: Record<string, string> = {
  Goalkeeper: "bg-yellow-100 text-yellow-800",
  Defender: "bg-blue-100 text-blue-800",
  Midfielder: "bg-green-100 text-green-800",
  Forward: "bg-red-100 text-red-800",
};

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
    return <div className="px-6 py-8"><p className="text-gray-500">Player not found.</p></div>;
  }

  const ratingsMap = Object.fromEntries(ratings.map((r) => [r.category, r.rating]));

  return (
    <div className="px-6 py-8 max-w-md mx-auto">
      <Link href="/roster" className="text-sm text-gray-400 mb-6 flex items-center gap-1">
        ← Roster
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{player.name}</h1>
          <p className="text-sm text-gray-400">#{player.jersey_number}</p>
        </div>
        <span className={`ml-auto text-xs font-medium px-3 py-1 rounded-full ${POSITION_COLORS[player.position] ?? "bg-gray-100 text-gray-600"}`}>
          {player.position}
        </span>
      </div>

      {summary && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-xl px-4 py-4">
          <h2 className="text-sm font-semibold text-green-800 mb-2">AI Summary</h2>
          {summary.strengths && <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Strengths:</span> {summary.strengths}</p>}
          {summary.weaknesses && <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Weaknesses:</span> {summary.weaknesses}</p>}
          {summary.standout_moments && <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Standout:</span> {summary.standout_moments}</p>}
          {summary.overall_assessment && <p className="text-sm text-gray-700 mt-2 italic">{summary.overall_assessment}</p>}
        </div>
      )}

      <GenerateSummaryButton playerId={id} />

      <h2 className="text-lg font-bold text-gray-900 mb-4">Coach Ratings</h2>
      <RatingsForm playerId={id} categories={CATEGORIES} existingRatings={ratingsMap} />
    </div>
  );
}
