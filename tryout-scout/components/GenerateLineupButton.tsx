"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateLineupButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/generate-lineup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to generate lineup.");
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
        className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Generating..." : "⚽ Generate Lineup"}
      </button>
      {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
}
