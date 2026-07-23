# CLAUDE.md — Tryout Scout

This file tells Claude Code everything it needs to know about this project and how to work with the person building it. Claude Code should read this at the start of every session and update it whenever a significant decision is made.

---

## Who Is Building This

Benjamin has zero coding or technical experience. This project is both a product build and a learning journey. Claude Code should always explain concepts in plain, beginner-friendly language before implementing them. Do not assume any prior knowledge of terminals, file systems, web frameworks, databases, or programming concepts.

**How to explain things:**
- Use everyday analogies, not technical jargon
- Compare new concepts to things that already make sense (a database table is like a spreadsheet, a component is like a reusable template, a terminal command is like a text instruction you give your computer)
- Keep explanations short — 2–4 sentences before showing any code
- If introducing a new concept (e.g. API route, environment variable, foreign key), define it before using it
- Never use an abbreviation without expanding it first

---

## What We Are Building

**Tryout Scout** is a mobile web app for soccer coaches to capture spoken observations during tryouts and turn them into structured player evaluations and roster recommendations.

**The core workflow:**
1. Coach creates a tryout session (can span 2–3 days)
2. Coach adds players manually (name, jersey number, position)
3. During tryouts, coach records spoken notes on their phone
4. After tryouts, recordings are transcribed automatically
5. AI generates player summaries, position rankings, and a recommended lineup
6. Coach reviews and makes roster decisions

**What it is NOT:**
- Not a native mobile app — it is a mobile web app (works in a phone browser)
- Not multi-user in v1 — one coach per session
- Not a live transcription app — record first, transcribe after
- Not a CSV import tool — manual roster entry only in MVP

---

## Tech Stack

| Layer | Tool | What it does in plain English |
|---|---|---|
| Frontend | Next.js (App Router, TypeScript) | The framework that organizes all the app's pages, forms, and logic |
| Styling | Tailwind CSS | Pre-made CSS classes that make things look good without writing custom style sheets |
| Database | Supabase | An online database that stores all sessions, players, notes, and ratings |
| Transcription | OpenAI Whisper API | Converts spoken audio into written text |
| AI Summaries | OpenAI GPT-4o | Reads player notes and ratings and generates summaries and lineup suggestions |
| Deployment | Vercel | Publishes the app to the internet so coaches can access it |
| Dev Environment | VS Code + Claude Code | Where the code is written and Claude Code is used as the coding assistant |

---

## GitHub Repository

**Remote URL:** `https://github.com/AzhaQari/Tryout-Scout.git`
**Branch:** `main`

---

## Commit and Push Rules

Claude Code must follow these commit rules every session:

1. **After every day's tasks are complete**, commit all changes with a clear message and push to GitHub.
2. **After completing any major feature** (e.g. roster form works, transcription works, timeline renders), commit and push immediately — don't wait until end of day.
3. **Before starting any risky or large change**, commit the current working state first so there is a safe point to return to.
4. **Commit message format:** Use plain English descriptions of what was done. Example: `Add player form with Supabase save` not `fix stuff`.
5. **Never skip a push** when code is working. If something breaks mid-session, having the last working state on GitHub means nothing is lost.

**Standard commit flow:**
```bash
git add -A
git commit -m "Description of what was done"
git push origin main
```

Claude Code should do this without being asked whenever one of the above conditions is met. If GitHub credentials prompt, remind Benjamin to use his Personal Access Token (not his GitHub password).

---

## Key Product Decisions (Final)

These decisions were made during planning and should not be revisited unless Benjamin explicitly asks to reconsider them.

- Mobile web app, not native app
- Single coach per session (no multi-user in MVP)
- Soccer only (no multi-sport in MVP)
- Manual roster entry only (no CSV import)
- Record audio first, transcribe after (not live transcription)
- Transcript is retained; audio file is discarded after transcription
- Jersey number and player name are treated as equivalent identifiers
- Coach ratings carry more weight than AI judgment in all outputs
- PDF and CSV export of a session report (roster, ratings, AI summaries, rankings, lineup)
  were added 2026-07-23 at Benjamin's request — this supersedes the earlier "no export"
  decision. Export runs entirely client-side (jsPDF), no server/API changes needed.
- No offline support required
- Budget target: under $30/month

---

## Database Schema

All tables live in Supabase. These are the core tables for the MVP.

**sessions** — One row per tryout cycle
- `id` (uuid, primary key)
- `name` (text)
- `start_date` (date)
- `end_date` (date)
- `notes` (text, optional)
- `created_at` (timestamp)

**players** — One row per player in a session
- `id` (uuid, primary key)
- `session_id` (uuid, links to sessions)
- `name` (text)
- `jersey_number` (text)
- `position` (text: Goalkeeper / Defender / Midfielder / Forward)
- `notes` (text, optional)
- `created_at` (timestamp)

**recordings** — One row per voice recording
- `id` (uuid, primary key)
- `session_id` (uuid, links to sessions)
- `type` (text: 'long' or 'quick')
- `status` (text: 'pending' / 'processing' / 'done' / 'error')
- `created_at` (timestamp)

**transcripts** — One row per processed recording
- `id` (uuid, primary key)
- `recording_id` (uuid, links to recordings)
- `transcript_text` (text)
- `created_at` (timestamp)

**player_notes** — Links a player to a mention in a transcript
- `id` (uuid, primary key)
- `player_id` (uuid, links to players)
- `transcript_id` (uuid, links to transcripts)
- `note_text` (text)

**coach_ratings** — One row per rating category per player
- `id` (uuid, primary key)
- `player_id` (uuid, links to players)
- `category` (text: technical_skill / speed / decision_making / effort / communication / positioning)
- `rating` (integer, 1–10)
- `notes` (text, optional)

**summaries** — AI-generated player evaluation
- `id` (uuid, primary key)
- `player_id` (uuid, links to players)
- `strengths` (text)
- `weaknesses` (text)
- `standout_moments` (text)
- `overall_assessment` (text)
- `generated_at` (timestamp)

**rankings** — Position-based player rankings per session
- `id` (uuid, primary key)
- `session_id` (uuid)
- `position` (text)
- `player_id` (uuid)
- `rank` (integer)
- `score` (numeric)

**lineups** — Suggested lineup per session
- `id` (uuid, primary key)
- `session_id` (uuid)
- `formation` (text: e.g. '4-3-3')
- `player_slots` (json)
- `explanation` (text)

---

## App Page Structure

```
app/
  page.tsx                        → Homepage
  sessions/
    page.tsx                      → Sessions list
    new/page.tsx                  → Create new session
    [id]/page.tsx                 → Session detail
    [id]/record/page.tsx          → Recording screen
    [id]/timeline/page.tsx        → Session timeline
    [id]/rankings/page.tsx        → Position rankings
    [id]/lineup/page.tsx          → Lineup recommendation
  roster/
    page.tsx                      → Roster list (search + sort, players not tied to a session)
    new/page.tsx                  → Add new player
    [id]/page.tsx                 → Player detail (ratings + AI summary)
  api/
    transcribe/route.ts           → Sends audio to OpenAI Whisper (with roster-name context)
    generate-summary/route.ts     → Generates player summary with GPT-4o
    generate-lineup/route.ts      → Generates lineup recommendation
    rank-players/route.ts         → Generates position rankings
lib/
  soccer-knowledge.ts              → Formations/tactics/evaluation reference given to the AI
  positions.ts                     → Shared position badge colors
```

Note: `roster/[id]/edit` doesn't exist yet (not built). `sessions/page.tsx` just redirects to
the homepage — there's no separate sessions list page, the session list lives in the
hamburger menu.

---

## Build Progress

Track which week and day of the plan is currently active. Update this section at the start of each work session.

**Current phase:** Post-MVP polish. The full core workflow is built and deployed: sessions,
multi-day support, manual roster, recording, transcription, timeline, coach ratings, AI
summaries, position rankings, lineup recommendation, PDF/CSV export, and a consistent dark
mobile-first design across every page.

**Known issue (2026-07-23, unresolved):** The Supabase project the app points to
(`qnvomzwgnjfpnnyltlfo.supabase.co`, from `.env.local` and Vercel's env vars) no longer
resolves in DNS — confirmed via multiple public DNS resolvers, and confirmed on the live
`tryout-scout.vercel.app` site itself (Roster page renders "No players yet" with no real
data). This means the project was very likely deleted or expired (Supabase free-tier
projects get paused after inactivity and can eventually be removed), not a transient outage —
Supabase's own status page is up. **This needs Benjamin to log into supabase.com, check the
project's status, and either restore it or create a new project** and update the connection
values in both `.env.local` and Vercel's project settings. Nothing in the app code can fix
this — it needs dashboard access only Benjamin has.

**Next step:** Restore/recreate the Supabase project, then re-verify the full workflow end to
end now that error handling and data-cleanup fixes are in place.

**12-Week Plan Summary:**
- Week 1: Environment setup
- Week 2: App skeleton and navigation
- Week 3: Supabase database setup
- Week 4: Roster management (add/edit/delete players)
- Week 5: Session creation and multi-day support
- Week 6: Recording flow (start/stop, save to DB)
- Week 7: Transcription via OpenAI Whisper
- Week 8: Timeline and player linking
- Week 9: Coach ratings (6 categories)
- Week 10: AI player summaries
- Week 11: Position rankings and lineup recommendation
- Week 12: Polish and deployment

---

## Environment Variables

These live in a file called `.env.local` in the project root. This file is **never committed to GitHub** — it contains private keys.

Required variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

---

## Coding Conventions

- Use TypeScript throughout (`.ts` and `.tsx` files only)
- Use Tailwind CSS for all styling — no separate CSS files unless necessary
- Use Supabase client from `lib/supabase.ts` for all database calls
- Server components for read-only data fetching; client components (`"use client"`) for interactive UI
- Keep components small and focused on one thing
- No placeholder or stub code left in production — every button should do something real

---

## Instructions for Claude Code

- Always explain what you're about to do in 1–2 plain-English sentences before writing code
- Introduce any new concept or tool with a 1–2 sentence plain-English definition before using it
- After every change, include a "Verify:" step — one sentence telling Benjamin what to check in the browser or in Supabase to confirm it worked
- If an error occurs, explain what the error means in plain English before showing the fix
- Do not make multiple large changes at once — one feature, one file, one task per response
- Commit and push after each completed day or major feature without being asked
- Update the "Build Progress" section of this file when the current phase changes
- Update this file if any significant product decision is made or changed during a session
