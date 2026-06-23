import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero section */}
      <div
        className="min-h-screen bg-cover bg-center bg-fixed flex flex-col justify-center px-6 py-10 gap-6"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&q=80')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />

        <div className="relative flex flex-col items-center text-center gap-4 -mt-32">
          <h1 className="text-6xl font-black text-white tracking-widest uppercase drop-shadow-xl">
            Tryout Scout
          </h1>
          <p className="text-white text-sm max-w-xs leading-relaxed bg-black/30 rounded-xl px-4 py-3">
            Record voice notes during tryouts, rate your players, and let AI build your roster.
          </p>
        </div>

        <div className="relative flex flex-col gap-3 w-full max-w-sm mx-auto">
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

      {/* Info section */}
      <div className="bg-gray-950 text-white px-6 py-16 flex flex-col gap-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2">Built for coaches, not clipboards.</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
            Tryout Scout replaces the notepad and spreadsheet with a smarter workflow — right from your phone.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { title: "Record on the fly", desc: "Tap once to start recording. Call out observations about any player while you watch — no typing, no distraction." },
            { title: "Auto-transcribed", desc: "Every recording is automatically converted to text using AI. Read back exactly what you said, organized by time." },
            { title: "Rate each player", desc: "Score players 1–10 across six categories: technical skill, speed, decision making, effort, communication, and positioning." },
            { title: "AI-generated evaluations", desc: "Get a written strengths, weaknesses, and overall assessment for every player — generated from your ratings and voice notes." },
            { title: "Position rankings", desc: "See your top goalkeeper, defenders, midfielders, and forwards ranked by score — so roster decisions are easy to justify." },
            { title: "Lineup recommendation", desc: "AI suggests a formation and starting lineup based on your best players, with a written explanation of the reasoning." },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-gray-900 rounded-2xl px-5 py-5 border-l-4 border-emerald-500">
              <h3 className="font-bold text-white mb-1">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs pt-4 pb-4">Tryout Scout · Built for soccer coaches</p>
      </div>
    </div>
  );
}
