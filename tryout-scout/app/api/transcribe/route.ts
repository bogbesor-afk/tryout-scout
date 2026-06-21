import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { recordingId } = await req.json();

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

  // Send audio to OpenAI Whisper for transcription
  const file = new File([fileData], "recording.webm", { type: "audio/webm" });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
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

  // Mark recording as done
  await supabase.from("recordings").update({ status: "done" }).eq("id", recordingId);

  return NextResponse.json({ transcript: transcriptText });
}
