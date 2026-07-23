import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";
import { SOCCER_KNOWLEDGE } from "@/lib/soccer-knowledge";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
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

    const prompt = `You are an experienced soccer coach assistant suggesting a starting lineup.

${SOCCER_KNOWLEDGE}

Players available for this session:
${playerSummaries}

Suggest the formation (e.g. 4-3-3, 4-4-2, 3-5-2, 4-2-3-1) that best fits the squad's actual
composition above — don't force a shape the roster doesn't support (e.g. don't pick 3-5-2 if
there aren't enough natural wide players). List which players should start in which position.
Then write 2-3 sentences explaining your reasoning, referencing the players' ratings and
positions.

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
    const { error: insertError } = await supabase.from("lineups").insert({
      session_id: sessionId,
      formation,
      player_slots: playerSlots,
      explanation,
    });

    if (insertError) {
      return NextResponse.json({ error: "Generated the lineup but failed to save it." }, { status: 500 });
    }

    return NextResponse.json({ formation, playerSlots, explanation });
  } catch (err) {
    console.error("Lineup generation failed:", err);
    return NextResponse.json({ error: "Something went wrong generating the lineup." }, { status: 500 });
  }
}
