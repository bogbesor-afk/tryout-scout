import { supabase } from "@/lib/supabase";
import Link from "next/link";

async function getTranscripts(sessionId: string) {
  const { data } = await supabase
    .from("recordings")
    .select("id, created_at, transcripts(transcript_text)")
    .eq("session_id", sessionId)
    .eq("status", "done")
    .order("created_at", { ascending: true });
  return data ?? [];
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recordings = await getTranscripts(id);

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-16 pb-8 max-w-md mx-auto">
      <Link href={`/sessions/${id}`} className="text-sm text-gray-500 mb-6 inline-block">
        ← Back to Session
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Timeline</h1>

      {recordings.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-sm">No transcripts yet.</p>
          <Link
            href={`/sessions/${id}/record`}
            className="text-emerald-400 text-sm font-medium mt-2 inline-block"
          >
            Start recording →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {recordings.map((recording: any) => {
            const transcript = recording.transcripts?.[0];
            if (!transcript) return null;
            return (
              <div key={recording.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4">
                <p className="text-xs text-gray-500 mb-2">{formatTime(recording.created_at)}</p>
                <p className="text-sm text-gray-300 leading-relaxed">{transcript.transcript_text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
