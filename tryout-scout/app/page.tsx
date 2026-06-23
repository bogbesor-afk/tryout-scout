import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero section — full screen with fixed background */}
      <div
        className="sticky top-0 h-screen bg-cover bg-center -z-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&q=80')",
        }}
      />
      <div className="fixed inset-0 bg-black/55 -z-10" />

      {/* Hero content */}
      <div className="relative flex flex-col items-center px-6 pt-16 gap-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 text-5xl">⚽</div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">
            Tryout Scout
          </h1>
          <p className="text-white text-sm max-w-xs leading-relaxed bg-black/30 rounded-xl px-4 py-3">
            Record voice notes during tryouts, rate your players, and let AI build your roster.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
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

      {/* Scrollable info section */}
      <div className="relative bg-gray-950 text-white px-6 py-16 flex flex-col gap-12">

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2">Built for coaches, not clipboards.</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
            Tryout Scout replaces the notepad and spreadsheet with a smarter workflow — right from your phone.
          </p>
        </div>

        {/* Feature cards */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-900 rounded-2xl px-5 py-5">
            <div className="text-3xl mb-3">🎙</div>
            <h3 className="font-bold text-white mb-1">Record on the fly</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tap once to start recording. Call out observations about any player while you watch — no typing, no distraction.
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl px-5 py-5">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-bold text-white mb-1">Auto-transcribed</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every recording is automatically converted to text using AI. Read back exactly what you said, organized by time.
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl px-5 py-5">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-bold text-white mb-1">Rate each player</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Score players 1–10 across six categories: technical skill, speed, decision making, effort, communication, and positioning.
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl px-5 py-5">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-bold text-white mb-1">AI-generated evaluations</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get a written strengths, weaknesses, and overall assessment for every player — generated from your ratings and voice notes.
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl px-5 py-5">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-bold text-white mb-1">Position rankings</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              See your top goalkeeper, defenders, midfielders, and forwards ranked by score — so roster decisions are easy to justify.
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl px-5 py-5">
            <div className="text-3xl mb-3">⚽</div>
            <h3 className="font-bold text-white mb-1">Lineup recommendation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI suggests a formation and starting lineup based on your best players, with a written explanation of the reasoning.
            </p>
          </div>
        </div>

        <div className="text-center pt-4 pb-8">
          <p className="text-gray-500 text-xs">Tryout Scout · Built for soccer coaches</p>
        </div>
      </div>
    </div>
  );
}
