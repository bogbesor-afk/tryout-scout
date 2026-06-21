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
    <div className="px-6 py-8">
      <Link href={`/sessions/${id}`} className="text-sm text-gray-400 mb-6 flex items-center gap-1">
        ← Back to Session
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Timeline</h1>

      {recordings.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm">No transcripts yet.</p>
          <Link
            href={`/sessions/${id}/record`}
            className="text-green-600 text-sm font-medium mt-2 inline-block"
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
              <div key={recording.id} className="bg-white border border-gray-200 rounded-xl px-4 py-4">
                <p className="text-xs text-gray-400 mb-2">{formatTime(recording.created_at)}</p>
                <p className="text-sm text-gray-800 leading-relaxed">{transcript.transcript_text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
