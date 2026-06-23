import Link from "next/link";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

export default function Home() {
  return (
    <div>
      {/* Hero section */}
      <div
        className="relative min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center justify-center px-6 gap-8"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&q=80')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        {/* Title block */}
        <div className="relative flex flex-col items-center text-center gap-3">
          <p className="text-emerald-400 text-xs tracking-[0.3em] uppercase font-medium">
            AI-Powered Evaluation
          </p>
          <h1 className={`${bebas.className} text-7xl text-white leading-none tracking-wider drop-shadow-2xl`}>
            Tryout Scout
          </h1>
          <p className="text-white/70 text-sm max-w-xs leading-relaxed mt-1">
            Record voice notes during tryouts, rate your players, and let AI build your roster.
          </p>
        </div>

        {/* CTA */}
        <div className="relative w-full max-w-xs">
          <Link
            href="/sessions/new"
            className="block bg-emerald-500 text-white rounded-2xl py-4 text-base font-semibold text-center shadow-xl hover:bg-emerald-600 transition-colors"
          >
            + New Tryout Session
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
