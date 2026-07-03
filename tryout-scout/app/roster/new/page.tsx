"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

export default function NewPlayerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [position, setPosition] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !jerseyNumber || !position) {
      setError("Please fill in name, jersey number, and position.");
      return;
    }
    setSaving(true);
    setError("");

    const { error: dbError } = await supabase.from("players").insert({
      name,
      jersey_number: jerseyNumber,
      position,
      notes,
      session_id: null,
    });

    if (dbError) {
      setError("Something went wrong saving the player. Try again.");
      setSaving(false);
      return;
    }

    router.push("/roster");
  }

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-16 pb-8">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 mb-6"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-white mb-6">Add Player</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Player Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Marcus Johnson"
            className="w-full bg-gray-900 border border-gray-800 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Jersey Number
          </label>
          <input
            type="text"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
            placeholder="e.g. 10"
            className="w-full bg-gray-900 border border-gray-800 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Position
          </label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select a position</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Notes <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any initial observations..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-800 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-500 text-white rounded-xl py-4 text-base font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Player"}
        </button>
      </form>
    </div>
  );
}
