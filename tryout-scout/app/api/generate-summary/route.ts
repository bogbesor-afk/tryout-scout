import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { playerId } = await req.json();

  if (!playerId) {
    return NextResponse.json({ error: "Missing playerId" }, { status: 400 });
  }

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single();

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  const { data: ratings } = await supabase
    .from("coach_ratings")
    .select("*")
    .eq("player_id", playerId);

  // Pull all transcripts from the player's session and search for their name/jersey
  const { data: recordings } = await supabase
    .from("recordings")
    .select("id, transcripts(transcript_text)")
    .eq("session_id", player.session_id)
    .eq("status", "done");

  const allTranscriptText = recordings
    ?.flatMap((r: any) => r.transcripts?.map((t: any) => t.transcript_text) ?? [])
    .join(" ") ?? "";

  // Find sentences that mention the player by name or jersey number
  const sentences = allTranscriptText.split(/[.!?]+/).filter(Boolean);
  const relevantSentences = sentences.filter((s) => {
    const lower = s.toLowerCase();
    return (
      lower.includes(player.name.toLowerCase()) ||
      lower.includes(`#${player.jersey_number}`) ||
      lower.includes(`number ${player.jersey_number}`) ||
      lower.includes(`jersey ${player.jersey_number}`)
    );
  });

  const ratingsText = ratings && ratings.length > 0
    ? ratings.map((r) => `${r.category}: ${r.rating}/10`).join(", ")
    : "No ratings provided";

  const notesText = relevantSentences.length > 0
    ? relevantSentences.join(". ").trim()
    : "No specific notes recorded";

  const prompt = `You are a soccer coach assistant. Based on the following information about a player, write a concise evaluation.

Player: ${player.name}
Position: ${player.position}
Jersey: #${player.jersey_number}

Coach Ratings:
${ratingsText}

Coach Notes from Recordings:
${notesText}

Write a short evaluation with these four sections:
1. Strengths (1-2 sentences)
2. Weaknesses (1-2 sentences)
3. Standout Moments (1 sentence, or "None recorded" if no notes)
4. Overall Assessment (1-2 sentences)

Be direct and specific. Use a professional coaching tone.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const responseText = completion.choices[0].message.content ?? "";

  const strengthsMatch = responseText.match(/Strengths[:\s]+([\s\S]*?)(?=Weaknesses|$)/i);
  const weaknessesMatch = responseText.match(/Weaknesses[:\s]+([\s\S]*?)(?=Standout|$)/i);
  const standoutMatch = responseText.match(/Standout Moments[:\s]+([\s\S]*?)(?=Overall|$)/i);
  const overallMatch = responseText.match(/Overall Assessment[:\s]+([\s\S]*?)$/i);

  const strengths = strengthsMatch?.[1]?.trim() ?? "";
  const weaknesses = weaknessesMatch?.[1]?.trim() ?? "";
  const standout_moments = standoutMatch?.[1]?.trim() ?? "";
  const overall_assessment = overallMatch?.[1]?.trim() ?? responseText;

  await supabase.from("summaries").upsert({
    player_id: playerId,
    strengths,
    weaknesses,
    standout_moments,
    overall_assessment,
    generated_at: new Date().toISOString(),
  }, { onConflict: "player_id" });

  return NextResponse.json({ strengths, weaknesses, standout_moments, overall_assessment });
}
