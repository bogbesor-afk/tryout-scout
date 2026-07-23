"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    const { data: players } = await supabase
      .from("players")
      .select("id")
      .eq("session_id", sessionId);
    const playerIds = (players ?? []).map((p) => p.id);

    const { data: recordings } = await supabase
      .from("recordings")
      .select("id, file_path, status")
      .eq("session_id", sessionId);
    const recordingIds = (recordings ?? []).map((r) => r.id);
    const remainingFilePaths = (recordings ?? [])
      .filter((r) => r.status !== "done")
      .map((r) => r.file_path);

    if (playerIds.length > 0) {
      await supabase.from("coach_ratings").delete().in("player_id", playerIds);
      await supabase.from("summaries").delete().in("player_id", playerIds);
      await supabase.from("player_notes").delete().in("player_id", playerIds);
    }

    if (recordingIds.length > 0) {
      await supabase.from("transcripts").delete().in("recording_id", recordingIds);
    }

    if (remainingFilePaths.length > 0) {
      await supabase.storage.from("recordings").remove(remainingFilePaths);
    }

    await supabase.from("rankings").delete().eq("session_id", sessionId);
    await supabase.from("lineups").delete().eq("session_id", sessionId);
    await supabase.from("recordings").delete().eq("session_id", sessionId);
    await supabase.from("players").delete().eq("session_id", sessionId);
    await supabase.from("sessions").delete().eq("id", sessionId);

    router.push("/");
  }

  if (confirming) {
    return (
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 bg-red-600 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="flex-1 bg-gray-800 text-gray-300 rounded-xl py-3 text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-full mt-2 border border-red-500/20 text-red-400 rounded-xl py-3 text-sm font-semibold hover:bg-red-500/10 transition-colors"
    >
      Delete Session
    </button>
  );
}
