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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 px-6 pt-16 text-center max-w-md mx-auto">
      <button
        onClick={() => router.back()}
        className="absolute top-16 left-6 text-sm text-gray-500"
      >
        ← Back
      </button>

      <h1 className="text-xl font-bold text-white mb-2">Record Notes</h1>
      <p className="text-sm text-gray-500 mb-12">
        {status === "idle" && "Tap the button to start recording."}
        {status === "recording" && "Recording... tap to stop."}
        {status === "saving" && "Saving your recording..."}
        {status === "done" && "Recording saved!"}
        {status === "error" && errorMsg}
      </p>

      {(status === "idle" || status === "recording") && (
        <>
          <div className="text-4xl font-mono font-bold text-gray-300 mb-10">
            {formatTime(seconds)}
          </div>

          <button
            onClick={recording ? stopRecording : startRecording}
            aria-label={recording ? "Stop recording" : "Start recording"}
            className={`flex items-center justify-center w-28 h-28 rounded-full shadow-lg transition-all ${
              recording
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {recording ? (
              <span className="block w-7 h-7 bg-white rounded-md" />
            ) : (
              <span className="block w-9 h-9 bg-white rounded-full" />
            )}
          </button>

          <p className="text-xs text-gray-500 mt-6">
            {recording ? "Tap to stop" : "Tap to record"}
          </p>
        </>
      )}

      {status === "done" && (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 mx-auto mb-2">
            <span className="text-emerald-400 text-2xl">✓</span>
          </div>
          <button
            onClick={() => {
              setStatus("idle");
              setSeconds(0);
            }}
            className="bg-emerald-500 text-white rounded-xl py-4 text-base font-semibold hover:bg-emerald-600 transition-colors"
          >
            Record Another
          </button>
          <button
            onClick={() => router.push(`/sessions/${sessionId}`)}
            className="bg-gray-900 border border-gray-800 text-gray-300 rounded-xl py-4 text-base font-semibold hover:bg-gray-800 transition-colors"
          >
            Back to Session
          </button>
        </div>
      )}

      {status === "error" && (
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 bg-gray-900 border border-gray-800 text-gray-300 rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
