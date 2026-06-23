import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col justify-between min-h-screen">
      {/* Soccer field background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&q=80')",
        }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center flex-1 px-6 text-center pt-24 pb-32">
        <div className="mb-4 text-5xl">⚽</div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          Tryout Scout
        </h1>
        <p className="text-white/70 text-base max-w-xs leading-relaxed">
          Capture, evaluate, and build your roster — all from your phone.
        </p>
      </div>

      {/* Buttons pinned to bottom */}
      <div className="relative px-6 pb-28 flex flex-col gap-3 w-full max-w-sm mx-auto">
        <Link
          href="/sessions/new"
          className="bg-emerald-500 text-white rounded-2xl py-4 text-base font-semibold text-center shadow-lg hover:bg-emerald-600 transition-colors"
        >
          + New Tryout Session
        </Link>
        <Link
          href="/sessions"
          className="bg-white/15 backdrop-blur-sm border border-white/30 text-white rounded-2xl py-4 text-base font-semibold text-center hover:bg-white/25 transition-colors"
        >
          View Sessions
        </Link>
        <Link
          href="/roster"
          className="bg-white/15 backdrop-blur-sm border border-white/30 text-white rounded-2xl py-4 text-base font-semibold text-center hover:bg-white/25 transition-colors"
        >
          View Roster
        </Link>
      </div>
    </div>
  );
}
