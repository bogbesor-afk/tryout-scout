# Tryout Scout — Product Requirements Document

**Version:** 1.0  
**Date:** June 2026  
**Status:** Active MVP Build

---

## 1. Product Overview

Tryout Scout is a mobile web app that helps a soccer coach capture tryout observations by voice, organize them by player, and turn them into structured evaluations and roster recommendations. The app is designed for one coach at a time in the MVP, with support for a single roster and tryout sessions that may span multiple days.

---

## 2. Problem Statement

Soccer tryouts move too fast for manual note-taking to work well. Coaches need to watch the field, remember who did what, and make fair decisions later — but clipboards, spreadsheets, and scattered notes create friction and lead to missed details. Tryout Scout solves this by letting the coach speak naturally during tryouts and converting those observations into organized player profiles and roster recommendations.

---

## 3. Product Goals

- Make it easy for a coach to capture observations without looking down or typing.
- Store and organize notes by player across a 2–3 day tryout session.
- Generate useful player summaries, position rankings, and lineup recommendations.
- Keep the experience fast, simple, and usable on a phone in real tryout conditions.
- Deliver a polished MVP that a real coach can use within 2–3 months.

---

## 4. Non-Goals (MVP)

The MVP will **not** include:

- Audio file storage after transcription
- Multi-coach collaboration
- PDF export
- Multi-sport support
- CSV roster import
- Full admin dashboards
- Offline support
- Advanced transcript editing
- Complex analytics beyond evaluation and ranking outputs

---

## 5. Target User

**Primary:** A high school or club soccer coach running tryouts with 15–30 players.

The coach wants a fast way to capture observations in real time and a cleaner way to make roster decisions afterward. The MVP assumes a single user managing one tryout roster.

---

## 6. Core User Needs

1. Add players manually with name, jersey number, and position.
2. Record spoken notes quickly during tryouts (long-form and quick-note).
3. Have notes transcribed automatically after recording.
4. See a timeline of notes by session and day.
5. Review player summaries and rankings after tryouts.
6. Get a recommended lineup that reflects coach ratings first, AI judgment second.

---

## 7. MVP Scope

The MVP includes:

- One roster per tryout cycle
- One coach account (login optional for MVP)
- Manual player entry only
- Fixed soccer positions with optional formation grouping
- Long-record mode and quick-note mode
- Transcript retention only (audio discarded after transcription)
- Session timeline (chronological view of all transcripts)
- AI-generated player summaries (strengths, weaknesses, standout moments)
- Position rankings (players ranked within their position)
- Recommended lineup with plain-English reasoning
- Clean, functional mobile web interface

---

## 8. User Workflow

### Before Tryouts
The coach creates a session, sets the date range (1–3 days), and manually enters all players with name, jersey number, and position.

### During Tryouts
The coach opens the recording screen, taps to start a long recording or quick note, speaks naturally, and taps stop. The app saves the audio and queues it for transcription. The coach never needs to type.

### After Tryouts
The app transcribes recordings and discards the audio files. The coach reviews the session timeline, sees which notes were linked to which players, adjusts coach ratings, and views AI-generated summaries and the recommended lineup.

---

## 9. Functional Requirements

### 9.1 Sessions
- Create, edit, and view tryout sessions
- Sessions support multi-day spans (2–3 days)
- Display transcripts chronologically in a session timeline

### 9.2 Roster Management
- Add players manually: name, jersey number, position, optional notes
- Jersey number and player name treated as equivalent identifiers throughout the app
- Fixed soccer positions with optional formation-based grouping

### 9.3 Recording and Transcription
- Start and stop long recordings (stream-of-consciousness mode)
- Capture quick notes (short individual observations)
- Send recordings to OpenAI speech-to-text after the session or on demand
- Save transcripts and recording metadata in the database
- Discard audio files after successful transcription

### 9.4 Evaluation and AI Output
- Generate player summaries from transcript data and coach ratings
- Allow coach ratings across 6 categories: technical skill, speed, decision-making, effort, communication, positioning
- Rank players within each position
- Generate a recommended lineup for a selected formation
- Provide plain-English reasoning grounded in coach ratings and transcript evidence

### 9.5 Review and Organization
- View a chronological session timeline with all transcripts and timestamps
- View individual player profile pages with notes, ratings, and summaries
- Flag unclear or unresolved player mentions for later review
- Show an overview of top players by position

---

## 10. Data Model

| Table | Key Columns |
|---|---|
| `sessions` | id, name, start_date, end_date, notes |
| `players` | id, session_id, name, jersey_number, position, notes |
| `recordings` | id, session_id, created_at, status, type (long/quick) |
| `transcripts` | id, recording_id, transcript_text, created_at, processed_at |
| `player_notes` | id, player_id, transcript_id, note_text |
| `coach_ratings` | id, player_id, category, rating (1–10), notes |
| `summaries` | id, player_id, strengths, weaknesses, standout_moments, generated_at |
| `rankings` | id, session_id, position, player_id, rank, score |
| `lineups` | id, session_id, formation, player_slots (JSON), explanation |

---

## 11. AI Behavior

The AI acts as an assistant, not the decision-maker. Its job is to:

1. Clean up raw transcript text
2. Identify player name and jersey number mentions
3. Summarize strengths and weaknesses per player
4. Compare players by position
5. Propose a lineup based primarily on coach ratings
6. Explain why a player is ranked where they are

**Coach ratings are always weighted more heavily than AI inference.**

---

## 12. Technical Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | Next.js (App Router, TypeScript) | Structured, beginner-friendly, strong ecosystem |
| Database / Auth | Supabase | Managed backend, free tier, real-time capable |
| Transcription | OpenAI Whisper API | Accurate, simple API, pay-per-use |
| AI Summaries | OpenAI GPT-4o | Strong reasoning, structured output |
| Deployment | Vercel | One-click deploys for Next.js, free tier available |
| Dev Environment | VS Code + Claude Code | Build and learn simultaneously |

---

## 13. Budget Constraints

Target: **under $30/month**

- Supabase Free tier → upgrade to Pro ($25/month) only if needed
- OpenAI API: pay-per-use (minimal cost for one coach MVP)
- Vercel: free for hobby projects

---

## 14. Success Criteria

The MVP is successful when a coach can:

1. Create a session with a 2–3 day date range
2. Enter a roster of 20–30 players manually
3. Record spoken observations during live tryouts
4. Review transcripts organized by session and player
5. See AI-generated player summaries
6. See position rankings
7. Get a recommended lineup with reasoning
8. Complete the full workflow comfortably on a phone

---

## 15. Risks

| Risk | Mitigation |
|---|---|
| Speech recognition mishears names or jersey numbers | Flag low-confidence mentions for coach review |
| Long recordings hard to split by player | Use name/number detection heuristics; coach can review |
| AI overstates confidence | Coach ratings always weighted more heavily |
| Mobile usability suffers under complex flows | Design for touch-first, minimize required taps |
| Scope creep delays MVP | Follow weekly plan strictly; defer all non-MVP features |

---

## 16. Open Questions (Post-MVP)

- Should CSV roster import be added in v2?
- Should unclear player mentions go to a review queue?
- Should session reports export to PDF?
- Should the app support multiple coaches sharing a session?
- Should formation templates be customizable?
- Should other sports be supported?

---

## 17. Milestones

| Phase | Weeks | Goal |
|---|---|---|
| Setup | 1 | Dev environment ready, app running locally |
| Structure | 2 | App skeleton, navigation, basic pages |
| Database | 3 | Supabase tables defined and connected |
| Roster | 4 | Players can be added and managed |
| Sessions | 5 | Sessions created with multi-day support |
| Recording | 6 | Recording flow works in the browser |
| Transcription | 7 | Audio transcribed and stored |
| Timeline | 8 | Timeline and player linking working |
| Ratings | 9 | Coach ratings built and saved |
| Summaries | 10 | AI player summaries generated |
| Rankings + Lineup | 11 | Rankings and lineup recommendation working |
| Polish + Launch | 12 | Mobile-ready, tested, deployed live |
