"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateRankingsButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/rank-players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to generate rankings.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mb-2">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-emerald-500 text-white rounded-xl py-3 text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Rankings"}
      </button>
      {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
}
