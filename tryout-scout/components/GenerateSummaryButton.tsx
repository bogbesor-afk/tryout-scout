"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateSummaryButton({ playerId }: { playerId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/generate-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    });

    if (!res.ok) {
      setError("Failed to generate summary. Try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mb-6">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-emerald-500 text-white rounded-xl py-3 text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate AI Summary"}
      </button>
      {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
}
