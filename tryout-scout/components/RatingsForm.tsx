"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Category {
  key: string;
  label: string;
}

export default function RatingsForm({
  playerId,
  categories,
  existingRatings,
}: {
  playerId: string;
  categories: Category[];
  existingRatings: Record<string, number>;
}) {
  const router = useRouter();
  const [ratings, setRatings] = useState<Record<string, number>>(existingRatings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    for (const category of categories) {
      const rating = ratings[category.key];
      if (!rating) continue;

      const existing = existingRatings[category.key];

      if (existing !== undefined) {
        await supabase
          .from("coach_ratings")
          .update({ rating })
          .eq("player_id", playerId)
          .eq("category", category.key);
      } else {
        await supabase.from("coach_ratings").insert({
          player_id: playerId,
          category: category.key,
          rating,
        });
      }
    }

    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      {categories.map(({ key, label }) => (
        <div key={key}>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <span className="text-sm font-bold text-green-600">{ratings[key] ?? "—"}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={ratings[key] ?? 5}
            onChange={(e) => setRatings({ ...ratings, [key]: Number(e.target.value) })}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>1</span>
            <span>10</span>
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-600 text-white rounded-xl py-4 text-base font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 mt-2"
      >
        {saving ? "Saving..." : "Save Ratings"}
      </button>

      {saved && <p className="text-green-600 text-sm text-center">Ratings saved!</p>}
    </div>
  );
}
