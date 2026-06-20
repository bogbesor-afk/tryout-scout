import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="mb-6 text-6xl">⚽</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Tryout Scout</h1>
      <p className="text-gray-500 mb-10 text-base">
        Capture, evaluate, and build your roster — all from your phone.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/sessions/new"
          className="bg-green-600 text-white rounded-xl py-4 text-base font-semibold hover:bg-green-700 transition-colors"
        >
          + New Tryout Session
        </Link>
        <Link
          href="/sessions"
          className="bg-white border border-gray-200 text-gray-700 rounded-xl py-4 text-base font-semibold hover:bg-gray-50 transition-colors"
        >
          View Sessions
        </Link>
        <Link
          href="/roster"
          className="bg-white border border-gray-200 text-gray-700 rounded-xl py-4 text-base font-semibold hover:bg-gray-50 transition-colors"
        >
          View Roster
        </Link>
      </div>
    </div>
  );
}
