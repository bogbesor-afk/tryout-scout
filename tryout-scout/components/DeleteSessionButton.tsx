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
