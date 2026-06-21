import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function getSessions() {
  const { data } = await supabase
    .from("sessions")
    .select("*")
    .order("start_date", { ascending: false });
  return data ?? [];
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
        <Link
          href="/sessions/new"
          className="bg-green-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          + New
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm">No sessions yet.</p>
          <Link href="/sessions/new" className="text-green-600 text-sm font-medium mt-2 inline-block">
            Create your first session →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="bg-white border border-gray-200 rounded-xl px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <p className="font-semibold text-gray-900">{session.name}</p>
              <p className="text-sm text-gray-400 mt-0.5">
                {formatDate(session.start_date)} — {formatDate(session.end_date)}
              </p>
              {session.notes && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{session.notes}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
