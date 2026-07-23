import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";
import { SOCCER_KNOWLEDGE } from "@/lib/soccer-knowledge";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Matches a player's name against a transcript sentence word-by-word, since
// coaches often refer to a player by first name only or by jersey number,
// not their full name exactly as entered in the roster.
function mentionsPlayer(sentence: string, name: string, jerseyNumber: string) {
  const lower = sentence.toLowerCase();
  const nameWords = name.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const nameMatch = nameWords.some((word) => new RegExp(`\\b${word}\\b`).test(lower));
  const numberMatch = new RegExp(`\\b(#|number|jersey)\\s*${jerseyNumber}\\b`).test(lower);
  return nameMatch || numberMatch;
}

export async function POST(req: NextRequest) {
  try {
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

    const allTranscriptText = (recordings as Array<{ transcripts: { transcript_text: string }[] | null }> | null)
      ?.flatMap((r) => r.transcripts?.map((t) => t.transcript_text) ?? [])
      .join(" ") ?? "";

    // Full session roster, so the model has the correct spelling of every
    // name/number in play and can untangle a mention meant for someone else.
    const { data: rosterPlayers } = await supabase
      .from("players")
      .select("name, jersey_number, position")
      .eq("session_id", player.session_id);

    const rosterText = (rosterPlayers ?? [])
      .map((p) => `${p.name} (#${p.jersey_number}, ${p.position})`)
      .join(", ");

    const sentences = allTranscriptText.split(/[.!?]+/).filter(Boolean);
    const relevantSentences = sentences.filter((s) =>
      mentionsPlayer(s, player.name, player.jersey_number)
    );

    const ratingsText = ratings && ratings.length > 0
      ? ratings.map((r) => `${r.category}: ${r.rating}/10`).join(", ")
      : "No ratings provided";

    const notesText = relevantSentences.length > 0
      ? relevantSentences.join(". ").trim()
      : "No specific notes recorded";

    const prompt = `You are an experienced soccer coach assistant helping evaluate a tryout player.

${SOCCER_KNOWLEDGE}

Full session roster (for reference, in case a coach's note mentions the wrong player by
mistake or a name was misheard in transcription): ${rosterText || "not available"}

Player being evaluated: ${player.name}
Position: ${player.position}
Jersey: #${player.jersey_number}

Coach Ratings:
${ratingsText}

Coach Notes from Recordings (may contain minor transcription errors in names/numbers —
use the roster above and context to interpret sensibly):
${notesText}

Write a short evaluation with these four sections, using position-specific criteria from
the framework above where relevant:
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

    const { error: upsertError } = await supabase.from("summaries").upsert({
      player_id: playerId,
      strengths,
      weaknesses,
      standout_moments,
      overall_assessment,
      generated_at: new Date().toISOString(),
    }, { onConflict: "player_id" });

    if (upsertError) {
      return NextResponse.json({ error: "Generated the summary but failed to save it." }, { status: 500 });
    }

    return NextResponse.json({ strengths, weaknesses, standout_moments, overall_assessment });
  } catch (err) {
    console.error("Summary generation failed:", err);
    return NextResponse.json({ error: "Something went wrong generating the summary." }, { status: 500 });
  }
}
