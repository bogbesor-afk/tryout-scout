"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Recording {
  id: string;
  status: string;
}

export default function TranscribeButton({
  recordings,
}: {
  recordings: Recording[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleTranscribe() {
    setLoading(true);
    setError("");

    for (const recording of recordings) {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordingId: recording.id }),
      });

      if (!res.ok) {
        setError("Something went wrong transcribing. Try again.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setDone(true);
    router.refresh();
  }

  if (done) return <p className="text-sm text-emerald-400 font-medium">Transcription complete!</p>;

  return (
    <div>
      <button
        onClick={handleTranscribe}
        disabled={loading}
        className="bg-amber-500 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Transcribing..." : "Transcribe Now"}
      </button>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
