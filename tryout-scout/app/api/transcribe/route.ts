import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  let recordingId: string | undefined;

  try {
    ({ recordingId } = await req.json());

    if (!recordingId) {
      return NextResponse.json({ error: "Missing recordingId" }, { status: 400 });
    }

    // Get the recording from the database
    const { data: recording, error: recordingError } = await supabase
      .from("recordings")
      .select("*")
      .eq("id", recordingId)
      .single();

    if (recordingError || !recording) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 });
    }

    // Mark it as processing
    await supabase.from("recordings").update({ status: "processing" }).eq("id", recordingId);

    // Download the audio file from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("recordings")
      .download(recording.file_path);

    if (downloadError || !fileData) {
      await supabase.from("recordings").update({ status: "error" }).eq("id", recordingId);
      return NextResponse.json({ error: "Failed to download audio" }, { status: 500 });
    }

    // Pull the session's roster so Whisper can be biased toward the correct
    // spelling of names and jersey numbers instead of guessing phonetically.
    const { data: rosterPlayers } = await supabase
      .from("players")
      .select("name, jersey_number")
      .eq("session_id", recording.session_id);

    const rosterPrompt =
      rosterPlayers && rosterPlayers.length > 0
        ? `Player roster for this team: ${rosterPlayers
            .map((p) => `${p.name} (number ${p.jersey_number})`)
            .join(", ")}.`
        : undefined;

    // Send audio to OpenAI Whisper for transcription
    const file = new File([fileData], "recording.webm", { type: "audio/webm" });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      prompt: rosterPrompt,
    });

    const transcriptText = transcription.text;

    // Save the transcript to the database
    const { error: transcriptError } = await supabase.from("transcripts").insert({
      recording_id: recordingId,
      transcript_text: transcriptText,
    });

    if (transcriptError) {
      await supabase.from("recordings").update({ status: "error" }).eq("id", recordingId);
      return NextResponse.json({ error: "Failed to save transcript" }, { status: 500 });
    }

    // Mark recording as done, then discard the audio file — only the
    // transcript is retained per product policy.
    await supabase.from("recordings").update({ status: "done" }).eq("id", recordingId);
    await supabase.storage.from("recordings").remove([recording.file_path]);

    return NextResponse.json({ transcript: transcriptText });
  } catch (err) {
    console.error("Transcription failed:", err);
    if (recordingId) {
      await supabase.from("recordings").update({ status: "error" }).eq("id", recordingId);
    }
    return NextResponse.json({ error: "Something went wrong during transcription." }, { status: 500 });
  }
}
