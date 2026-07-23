import { supabase } from "@/lib/supabase";
import Link from "next/link";
import TranscribeButton from "@/components/TranscribeButton";
import DeleteSessionButton from "@/components/DeleteSessionButton";
import ExportReportButton from "@/components/ExportReportButton";
import { POSITION_COLORS } from "@/lib/positions";

async function getSession(id: string) {
  const { data } = await supabase.from("sessions").select("*").eq("id", id).single();
  return data;
}

async function getPlayers(sessionId: string) {
  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  return data ?? [];
}

async function getPendingRecordings(sessionId: string) {
  const { data } = await supabase
    .from("recordings")
    .select("*")
    .eq("session_id", sessionId)
    .eq("status", "pending");
  return data ?? [];
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession(id);
  const players = await getPlayers(id);
  const pendingRecordings = await getPendingRecordings(id);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 px-6 pt-16 pb-8 max-w-md mx-auto">
        <p className="text-gray-500">Session not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-16 pb-8 max-w-md mx-auto">
      <Link href="/sessions" className="text-sm text-gray-500 mb-6 inline-block">
        ← Sessions
      </Link>

      <h1 className="text-2xl font-bold text-white mb-1">{session.name}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {formatDate(session.start_date)} — {formatDate(session.end_date)}
      </p>

      {session.notes && (
        <p className="text-sm text-gray-400 mb-8 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">{session.notes}</p>
      )}

      {pendingRecordings.length > 0 && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
          <p className="text-sm font-medium text-amber-400 mb-2">
            {pendingRecordings.length} recording{pendingRecordings.length > 1 ? "s" : ""} ready to transcribe
          </p>
          <TranscribeButton recordings={pendingRecordings} />
        </div>
      )}

      {/* Players */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-200">
            Players ({players.length})
          </h2>
          <Link
            href={`/sessions/${id}/players/new`}
            className="text-sm text-emerald-400 font-semibold"
          >
            + Add Player
          </Link>
        </div>

        {players.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">
            No players yet. Add your first player above.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {players.map((player) => (
              <Link
                key={player.id}
                href={`/roster/${player.id}`}
                className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-white">{player.name}</p>
                  <p className="text-sm text-gray-500">#{player.jersey_number}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${POSITION_COLORS[player.position] ?? "bg-gray-500/10 text-gray-400"}`}>
                  {player.position}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href={`/sessions/${id}/record`}
          className="bg-emerald-500 text-white rounded-xl py-3.5 text-sm font-semibold text-center hover:bg-emerald-600 transition-colors"
        >
          Start Recording
        </Link>

        <div className="grid grid-cols-3 gap-2">
          <Link
            href={`/sessions/${id}/timeline`}
            className="bg-gray-900 border border-gray-800 text-gray-300 rounded-xl py-3 text-xs font-semibold text-center hover:bg-gray-800 transition-colors"
          >
            Timeline
          </Link>
          <Link
            href={`/sessions/${id}/rankings`}
            className="bg-gray-900 border border-gray-800 text-gray-300 rounded-xl py-3 text-xs font-semibold text-center hover:bg-gray-800 transition-colors"
          >
            Rankings
          </Link>
          <Link
            href={`/sessions/${id}/lineup`}
            className="bg-gray-900 border border-gray-800 text-gray-300 rounded-xl py-3 text-xs font-semibold text-center hover:bg-gray-800 transition-colors"
          >
            Lineup
          </Link>
        </div>

        <ExportReportButton sessionId={id} />

        <DeleteSessionButton sessionId={id} />
      </div>
    </div>
  );
}
