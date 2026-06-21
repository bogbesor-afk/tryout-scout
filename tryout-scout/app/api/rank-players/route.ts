import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("session_id", sessionId);

  if (!players || players.length === 0) {
    return NextResponse.json({ error: "No players found for this session" }, { status: 404 });
  }

  const { data: allRatings } = await supabase
    .from("coach_ratings")
    .select("*")
    .in("player_id", players.map((p) => p.id));

  const positions = [...new Set(players.map((p) => p.position))];

  await supabase.from("rankings").delete().eq("session_id", sessionId);

  const rankings = [];

  for (const position of positions) {
    const positionPlayers = players.filter((p) => p.position === position);

    const scored = positionPlayers.map((player) => {
      const playerRatings = (allRatings ?? []).filter((r) => r.player_id === player.id);
      const avg =
        playerRatings.length > 0
          ? playerRatings.reduce((sum, r) => sum + r.rating, 0) / playerRatings.length
          : 0;
      return { player, score: avg };
    });

    scored.sort((a, b) => b.score - a.score);

    for (let i = 0; i < scored.length; i++) {
      rankings.push({
        session_id: sessionId,
        position,
        player_id: scored[i].player.id,
        rank: i + 1,
        score: scored[i].score,
      });
    }
  }

  await supabase.from("rankings").insert(rankings);

  return NextResponse.json({ rankings });
}
