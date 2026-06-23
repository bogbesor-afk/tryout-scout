"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewSessionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      setError("Please fill in session name, start date, and end date.");
      return;
    }
    if (endDate < startDate) {
      setError("End date can't be before start date.");
      return;
    }
    setSaving(true);
    setError("");

    const { data, error: dbError } = await supabase.from("sessions").insert({
      name,
      start_date: startDate,
      end_date: endDate,
      notes,
    }).select().single();

    if (dbError || !data) {
      setError("Something went wrong saving the session. Try again.");
      setSaving(false);
      return;
    }

    router.push(`/sessions/${data.id}`);
  }

  return (
    <div className="px-6 py-8 max-w-md mx-auto">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 mb-6 flex items-center gap-1"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Session</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Spring Tryouts 2026"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any details about this tryout cycle..."
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 text-white rounded-xl py-4 text-base font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Create Session"}
        </button>
      </form>
    </div>
  );
}
