import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    return NextResponse.json({ error: "No players found" }, { status: 404 });
  }

  const { data: allRatings } = await supabase
    .from("coach_ratings")
    .select("*")
    .in("player_id", players.map((p) => p.id));

  const playerSummaries = players.map((player) => {
    const ratings = (allRatings ?? []).filter((r) => r.player_id === player.id);
    const ratingsText = ratings.length > 0
      ? ratings.map((r) => `${r.category}: ${r.rating}/10`).join(", ")
      : "no ratings";
    return `- ${player.name} (#${player.jersey_number}, ${player.position}): ${ratingsText}`;
  }).join("\n");

  const prompt = `You are a soccer coach assistant. Based on the following player data, suggest the best starting lineup.

Players:
${playerSummaries}

Suggest a formation (e.g. 4-3-3, 4-4-2, 3-5-2) and list which players should start in which position. Then write 2-3 sentences explaining your reasoning.

Format your response exactly like this:
Formation: [formation]
Lineup:
- [position]: [player name]
- [position]: [player name]
(continue for all starters)
Explanation: [your reasoning]`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const responseText = completion.choices[0].message.content ?? "";

  const formationMatch = responseText.match(/Formation:\s*(.+)/i);
  const explanationMatch = responseText.match(/Explanation:\s*([\s\S]+)$/i);
  const lineupMatch = responseText.match(/Lineup:\s*([\s\S]*?)(?=Explanation:|$)/i);

  const formation = formationMatch?.[1]?.trim() ?? "4-3-3";
  const explanation = explanationMatch?.[1]?.trim() ?? "";
  const lineupText = lineupMatch?.[1]?.trim() ?? "";

  const playerSlots = lineupText
    .split("\n")
    .filter((line) => line.trim().startsWith("-"))
    .map((line) => line.replace(/^-\s*/, "").trim());

  await supabase.from("lineups").delete().eq("session_id", sessionId);
  await supabase.from("lineups").insert({
    session_id: sessionId,
    formation,
    player_slots: playerSlots,
    explanation,
  });

  return NextResponse.json({ formation, playerSlots, explanation });
}
