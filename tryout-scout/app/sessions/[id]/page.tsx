import { supabase } from "@/lib/supabase";
import Link from "next/link";

async function getSession(id: string) {
  const { data } = await supabase.from("sessions").select("*").eq("id", id).single();
  return data;
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

  if (!session) {
    return (
      <div className="px-6 py-8">
        <p className="text-gray-500">Session not found.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <Link href="/sessions" className="text-sm text-gray-400 mb-6 flex items-center gap-1">
        ← Sessions
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{session.name}</h1>
      <p className="text-sm text-gray-400 mb-6">
        {formatDate(session.start_date)} — {formatDate(session.end_date)}
      </p>

      {session.notes && (
        <p className="text-sm text-gray-600 mb-8 bg-gray-50 rounded-xl px-4 py-3">{session.notes}</p>
      )}

      <div className="flex flex-col gap-3">
        <Link
          href={`/sessions/${id}/record`}
          className="bg-green-600 text-white rounded-xl py-4 text-base font-semibold text-center hover:bg-green-700 transition-colors"
        >
          🎙 Start Recording
        </Link>
        <Link
          href={`/sessions/${id}/timeline`}
          className="bg-white border border-gray-200 text-gray-700 rounded-xl py-4 text-base font-semibold text-center hover:bg-gray-50 transition-colors"
        >
          📝 View Timeline
        </Link>
        <Link
          href={`/sessions/${id}/rankings`}
          className="bg-white border border-gray-200 text-gray-700 rounded-xl py-4 text-base font-semibold text-center hover:bg-gray-50 transition-colors"
        >
          🏆 Rankings
        </Link>
        <Link
          href={`/sessions/${id}/lineup`}
          className="bg-white border border-gray-200 text-gray-700 rounded-xl py-4 text-base font-semibold text-center hover:bg-gray-50 transition-colors"
        >
          ⚽ Lineup
        </Link>
      </div>
    </div>
  );
}
