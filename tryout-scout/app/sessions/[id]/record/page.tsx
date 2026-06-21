"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RecordPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<"idle" | "recording" | "saving" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setRecording(true);
      setStatus("recording");
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } catch {
      setErrorMsg("Microphone access was denied. Please allow microphone access and try again.");
      setStatus("error");
    }
  }

  async function stopRecording() {
    if (!mediaRecorderRef.current) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    setStatus("saving");

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const fileName = `${sessionId}/${Date.now()}.webm`;

      const { error: uploadError } = await supabase.storage
        .from("recordings")
        .upload(fileName, blob);

      if (uploadError) {
        setErrorMsg("Failed to save the recording. Please try again.");
        setStatus("error");
        return;
      }

      const { error: dbError } = await supabase.from("recordings").insert({
        session_id: sessionId,
        type: "long",
        status: "pending",
        file_path: fileName,
      });

      if (dbError) {
        setErrorMsg("Recording saved but failed to log it. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("done");
    };

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 text-sm text-gray-400"
      >
        ← Back
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-2">Record Notes</h1>
      <p className="text-sm text-gray-400 mb-12">
        {status === "idle" && "Tap the button to start recording."}
        {status === "recording" && "Recording... tap to stop."}
        {status === "saving" && "Saving your recording..."}
        {status === "done" && "Recording saved!"}
        {status === "error" && errorMsg}
      </p>

      {(status === "idle" || status === "recording") && (
        <>
          <div className="text-4xl font-mono font-bold text-gray-800 mb-10">
            {formatTime(seconds)}
          </div>

          <button
            onClick={recording ? stopRecording : startRecording}
            className={`w-28 h-28 rounded-full text-white text-4xl shadow-lg transition-all ${
              recording
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {recording ? "⏹" : "🎙"}
          </button>

          <p className="text-xs text-gray-400 mt-6">
            {recording ? "Tap to stop" : "Tap to record"}
          </p>
        </>
      )}

      {status === "done" && (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <div className="text-5xl mb-2">✅</div>
          <button
            onClick={() => {
              setStatus("idle");
              setSeconds(0);
            }}
            className="bg-green-600 text-white rounded-xl py-4 text-base font-semibold hover:bg-green-700 transition-colors"
          >
            Record Another
          </button>
          <button
            onClick={() => router.push(`/sessions/${sessionId}`)}
            className="bg-white border border-gray-200 text-gray-700 rounded-xl py-4 text-base font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Session
          </button>
        </div>
      )}

      {status === "error" && (
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 bg-white border border-gray-200 text-gray-700 rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
