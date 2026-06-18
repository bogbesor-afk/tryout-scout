# Tryout Scout — 12-Week Implementation Plan

**Start date:** June 2026  
**Target completion:** September 2026  
**Builder:** Benjamin Ogbesor (zero prior coding experience, using Claude Code in VS Code)

---

## How to Use This Plan

- Work through one day at a time. Do not skip ahead.
- Every day ends with a "verify" step. **Do not move to the next day until it passes.**
- Use Claude Code for all code. Give it one task at a time using the exact prompts provided.
- When something breaks, stop and fix it before adding anything new.
- Keep a `notes.md` file open and write one sentence at the end of each day about what you did.

---

## Glossary of Terms (Read This First)

Before you start Week 1, read these definitions so the plan makes sense.

**Terminal:** A text-based window where you type commands to control your computer. Think of it like giving your computer verbal instructions instead of clicking.

**Command:** A line of text you type in the terminal to make something happen. Example: `npm run dev` tells the app to start running.

**File:** A document on your computer. Code is just text saved in files with special names like `page.tsx`.

**Folder (Directory):** A container that holds files. Your whole project lives in one main folder.

**Component:** A reusable piece of UI (like a button, a card, a form) written as a function in a file.

**Route / Page:** In Next.js, every file inside the `app/` folder automatically becomes a URL in your app. So `app/sessions/page.tsx` becomes `yourapp.com/sessions`.

**Database table:** Like a spreadsheet tab. Each table holds one type of data (e.g., "players" or "sessions") with columns (fields) and rows (entries).

**API:** A way for two programs to talk to each other. When your app sends audio to OpenAI, it uses an API.

**Frontend:** The part of the app the user sees — buttons, forms, screens.

**Backend:** The part that stores data and does processing — the database, the server logic.

**Deploy:** Making your app available on the internet so anyone can visit it.

---

## Week 1: Environment Setup

**Goal:** Get your computer ready. By the end of this week you will see a running app in your browser and have code saved to GitHub.

---

### Day 1 — Install Everything

**What you're doing:** Installing all the software tools you need before writing a single line of code.

**Why each tool:** VS Code is where you write code. Node.js lets you run JavaScript (the language Next.js uses). Git tracks every change you make so you can undo mistakes. Python is installed for future AI-related work. Chrome is the browser you'll use for testing.

**Steps:**

1. Go to [https://code.visualstudio.com](https://code.visualstudio.com) and download VS Code for Mac. Install it.
2. Go to [https://nodejs.org](https://nodejs.org) and download the **LTS version** (the one labeled "Recommended for most users"). Install it.
3. Go to [https://git-scm.com](https://git-scm.com) and download Git for Mac. Install it.
4. Go to [https://www.python.org](https://www.python.org) and download the latest Python 3 version. Install it.
5. Install Google Chrome if you don't already have it.

**Verify:**
Open VS Code. It should launch without errors.

**Then create these accounts (each takes 2 minutes):**
- GitHub: [https://github.com](https://github.com) — stores your code online
- Supabase: [https://supabase.com](https://supabase.com) — your database
- Vercel: [https://vercel.com](https://vercel.com) — deploys your app to the internet
- OpenAI: [https://platform.openai.com](https://platform.openai.com) — powers transcription and AI summaries

Save all usernames and passwords somewhere secure (a notes app, a password manager, or written down).

---

### Day 2 — Set Up VS Code

**What you're doing:** Configuring VS Code with extensions so it's easier to write and read code.

**Why extensions:** Extensions are add-ons that give VS Code extra abilities, like auto-formatting your code, catching typos, and showing errors as you type.

**Steps:**

1. Open VS Code.
2. Click the icon on the left sidebar that looks like four squares (Extensions).
3. Search for and install each of these one by one:
   - **Prettier - Code formatter** — automatically formats your code to look clean
   - **ESLint** — catches common coding mistakes as you type
   - **Tailwind CSS IntelliSense** — helps with styling later (install now, you'll use it in Week 2)
4. Open the terminal inside VS Code: go to the top menu → Terminal → New Terminal. A panel will open at the bottom of the screen.
5. In that terminal, type this and press Enter: `node --version`
   - You should see something like `v20.x.x`. That means Node.js installed correctly.
6. Type `git --version` and press Enter.
   - You should see `git version 2.x.x`. That means Git is installed.

**Prompt to give Claude Code:**
> "I'm setting up my VS Code terminal for the first time. Can you explain what the terminal is, how to type commands in it, and what it means when a command runs successfully versus fails? Use plain English, no jargon."

**Verify:** You can open the terminal in VS Code and run `node --version` without an error.

---

### Day 3 — Create the Next.js App

**What you're doing:** Creating the actual project folder and starter app that will become Tryout Scout.

**Why Next.js:** Next.js is a framework — a pre-built structure that gives you everything you need to build a web app without starting from scratch. It handles routing (which URL shows which page), server logic, and more.

**Steps:**

1. Open VS Code.
2. Open the terminal (Terminal → New Terminal).
3. Navigate to your Desktop by typing this and pressing Enter:
   ```
   cd ~/Desktop
   ```
   (`cd` means "change directory" — you're telling the terminal to move to the Desktop folder.)
4. Type this command and press Enter:
   ```
   npx create-next-app@latest tryout-scout
   ```
   This downloads and sets up a new Next.js app in a folder called `tryout-scout`.
5. You'll be asked a series of questions. Answer them like this:
   - **TypeScript?** → Yes
   - **ESLint?** → Yes
   - **Tailwind CSS?** → Yes
   - **`src/` directory?** → No
   - **App Router?** → Yes
   - **Customize default import alias?** → No
6. Wait for it to finish (takes 1–2 minutes).
7. Open the folder in VS Code: File → Open Folder → choose the `tryout-scout` folder on your Desktop.
8. Open the terminal again and type:
   ```
   npm run dev
   ```
   This starts the app locally. You'll see a URL like `http://localhost:3000`.
9. Open Chrome and go to `http://localhost:3000`. You should see the default Next.js starter page.

**Verify:** The starter page loads in Chrome at `http://localhost:3000`.

---

### Day 4 — Learn the Basics

**What you're doing:** Understanding the structure of what was created so you can modify it.

**Why this matters:** You need to know where things live before you can change them. The Next.js App Router has a specific folder structure — understanding it now prevents confusion later.

**Steps:**

1. In VS Code, open the file [app/page.tsx](app/page.tsx). This is the homepage of your app.
2. Find the text that appears on the starter page in your browser.
3. Change that text to: `Welcome to Tryout Scout`
4. Save the file (Cmd+S). The browser should automatically update.
5. If it updated, your "hot reload" is working — this means you'll see changes live as you code.

**Prompts to give Claude Code:**

> "I just opened app/page.tsx in my Next.js project. Can you explain in plain English what this file does, what `.tsx` means, and how changes in this file show up in the browser?"

> "What is the `app/` folder for in a Next.js App Router project? How does it connect to URLs I see in the browser? Give me 3 simple examples."

> "What is a component in web development? How is it different from a page?"

**Verify:** Changing text in `app/page.tsx` and saving causes the browser to update automatically.

---

### Day 5 — Create Your Notes File

**What you're doing:** Creating a personal notes file you'll update every day to track your progress and questions.

**Why this matters:** As a learner, you'll have questions and observations every day. Writing them down keeps you from losing track and helps Claude Code give you better answers because you have context to share.

**Steps:**

1. In VS Code, right-click the main project folder in the left sidebar and choose "New File."
2. Name it `notes.md`.
3. Copy this template into it:

```markdown
# Tryout Scout — Build Notes

## Week 1

### Day 5
- What I did today:
- What I learned:
- What confused me:
- Questions to answer tomorrow:

---
```

4. Fill in today's entry.
5. Commit to updating this every day at the end of your work session.

**Also do this today:**

Create a file called `PROGRESS.md` in the same folder with this content:

```markdown
# Build Progress

## Completed
- [ ] Week 1, Day 1: Installed tools and created accounts
- [ ] Week 1, Day 2: Configured VS Code
- [ ] Week 1, Day 3: Created Next.js app
- [ ] Week 1, Day 4: Learned basics
- [ ] Week 1, Day 5: Created notes and progress files
```

Check off tasks as you complete them.

**Verify:** Both files exist in the project folder and are visible in VS Code.

---

### Day 6 — Set Up Git and GitHub

**What you're doing:** Connecting your project to GitHub so your code is saved online and you can recover from mistakes.

**Why Git and GitHub:** Git is like a "save history" for your project — every time you commit, you create a snapshot you can return to. GitHub stores those snapshots online so they're never lost.

**Steps:**

1. Go to [https://github.com](https://github.com) and log in.
2. Click the "+" icon in the top right → "New repository."
3. Name it `tryout-scout`. Make it **Private**.
4. Do NOT check "Initialize with README" — your project already has files.
5. Click "Create repository."
6. GitHub will show you a page with commands. Find the section that says "push an existing repository from the command line."
7. Copy those commands one by one into your VS Code terminal and run them.

They will look like this (your username replaces `YOUR_USERNAME`):
```
git remote add origin https://github.com/YOUR_USERNAME/tryout-scout.git
git branch -M main
git push -u origin main
```

8. If asked for a password, use a **Personal Access Token** from GitHub (Settings → Developer Settings → Personal Access Tokens → Tokens classic → Generate new token). Copy and paste it as the password.

**Prompt to give Claude Code:**
> "I'm setting up Git for the first time on this project. Can you explain what `git add`, `git commit`, and `git push` mean in plain English, and walk me through how to save my current files to GitHub step by step?"

**Verify:** Refresh your GitHub repository page. Your project files should appear there.

---

### Day 7 — Week 1 Review

**What you're doing:** Confirming everything from this week works and writing down what you learned.

**Steps:**

1. Stop the dev server (press `Ctrl+C` in the terminal).
2. Close VS Code.
3. Reopen VS Code and open the `tryout-scout` folder.
4. Run `npm run dev` again.
5. Confirm the app loads at `http://localhost:3000`.
6. Open your GitHub repository and confirm files are there.
7. Update your `notes.md` with a Week 1 summary.
8. Check off all Day 1–5 items in `PROGRESS.md`.

**Week 1 is complete when:**
- VS Code opens your project
- `npm run dev` starts the server without errors
- The app loads in Chrome
- GitHub shows your project files

---

## Week 2: App Skeleton

**Goal:** Create all the pages and navigation before building any real features. By the end of this week, you can click between every main screen of the app.

---

### Day 1 — Create Pages

**What you're doing:** Creating the file structure for every main screen in the app.

**Why first:** In Next.js, a page is just a file. Creating the files first gives you something to link between before you build real content.

**Prompt to give Claude Code:**
> "I'm building a soccer tryout app called Tryout Scout using Next.js App Router with TypeScript. I need to create the following pages with empty placeholder content. Each page should just show its own name as a heading for now. Create the folder and file structure for: home page (already exists at app/page.tsx), sessions list page, session detail page, roster page, player detail page, recording timeline page, and recommendations page. Show me the folder structure and the file content for each."

After Claude Code gives you the files, create them in VS Code.

**Verify:** Navigating to each URL in the browser (e.g., `localhost:3000/sessions`) shows the placeholder heading.

---

### Day 2 — Create Navigation

**What you're doing:** Adding a top navigation bar so you can click between pages instead of typing URLs.

**Prompt to give Claude Code:**
> "Add a simple mobile-friendly navigation bar to my Next.js app. It should appear at the top of every page and have links to: Home, Sessions, and Roster. It should be simple, readable on a phone screen, and use a clean style with Tailwind CSS. Where should I put this component and how do I make it appear on every page?"

**Verify:** The nav bar appears on every page and all links work.

---

### Day 3 — Mobile Layout

**What you're doing:** Making sure the app looks good on a phone, not just a desktop.

**Why now:** The coach will use this on their phone during tryouts. Designing for mobile from the start prevents having to redo everything later.

**Prompt to give Claude Code:**
> "My Next.js app needs to look good on mobile phones. Can you update the main layout file to: use a max-width container so it doesn't stretch on big screens, add proper padding on the sides for mobile, make text readable on small screens, and center the content. Use Tailwind CSS. Show me what to change in app/layout.tsx."

**Verify:** Open the app in Chrome and use the Dev Tools device simulator (right-click → Inspect → click the phone icon) to preview on iPhone size.

---

### Day 4 — Design Tokens

**What you're doing:** Choosing colors, fonts, and spacing that will stay consistent throughout the app.

**What "design tokens" means:** These are the basic visual choices — one font, one or two colors, one button style — that you define once and reuse everywhere. Keeping them consistent makes the app look professional.

**Prompt to give Claude Code:**
> "I want to set up a basic visual design for my app. Help me define in Tailwind CSS: one primary color (a strong blue or green), a clean sans-serif font, a standard button style, a standard card style, and a standard input/form field style. The app is a tool for soccer coaches so it should feel functional and professional, not flashy. Show me how to define these in tailwind.config.ts and how to create a small components file with reusable button and card components."

**Verify:** Create one button and one card on a test page and confirm they look clean on mobile.

---

### Day 5 — Homepage

**What you're doing:** Replacing the starter content with a real homepage for Tryout Scout.

**Prompt to give Claude Code:**
> "Replace the content in app/page.tsx with a clean mobile-friendly homepage for Tryout Scout. It should include: the app name 'Tryout Scout' as the main heading, a one-sentence description of what the app does, a large primary button that says 'Create New Session' and links to /sessions/new, and a secondary button that says 'View Sessions' and links to /sessions. Keep it simple and functional. Use Tailwind CSS."

**Verify:** The homepage looks clean on mobile and both buttons navigate correctly.

---

### Day 6 — Sessions Page and Player Page Placeholders

**What you're doing:** Adding placeholder content to the sessions list and player detail pages so they're useful to click around in.

**Prompt to give Claude Code:**
> "Update the sessions list page at app/sessions/page.tsx. Show: a heading 'Tryout Sessions', a message that says 'No sessions yet' when empty, and a button 'Create New Session' that links to /sessions/new. Also update the player detail page at app/players/[id]/page.tsx to show: the player name as a heading, placeholder sections for 'Jersey Number', 'Position', 'Coach Ratings', 'Notes', and 'AI Summary'. Make both pages mobile-friendly using Tailwind CSS."

**Verify:** Both pages load without errors and look reasonable on mobile.

---

### Day 7 — Week 2 Review

1. Click through every page in the app.
2. Confirm navigation works on all pages.
3. Preview on mobile using Chrome Dev Tools.
4. Fix any broken links or crashes.
5. Commit everything to GitHub.
6. Update `PROGRESS.md`.

---

## Week 3: Supabase Setup

**Goal:** Create the database that will store all app data and connect it to your Next.js app.

---

### Day 1 — Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and log in.
2. Click "New Project."
3. Name it `tryout-scout`.
4. Choose a region close to you.
5. Set a database password and **save it** — you'll need it later.
6. Click "Create new project" and wait for it to set up (takes 1–2 minutes).

**Verify:** The Supabase dashboard loads and shows your new project.

---

### Day 2 — Learn Database Concepts

**Prompt to give Claude Code:**
> "I'm about to design a database for my app for the first time. Can you explain in plain English: what a database table is, what a row and a column are, what a primary key is, what a foreign key is, and what a 'relationship' between tables means? Use a simple real-world example from a tryout app (players, sessions, notes) to make it concrete."

After reading the explanation, read the Data Model section in `PRD.md` again so it makes sense.

---

### Day 3 — Create Tables

Go to your Supabase project → Table Editor → New Table. Create these tables:

**sessions**
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key, default: gen_random_uuid() |
| name | text | Required |
| start_date | date | Required |
| end_date | date | Required |
| notes | text | Optional |
| created_at | timestamptz | Default: now() |

**players**
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| session_id | uuid | Foreign key → sessions.id |
| name | text | Required |
| jersey_number | text | Required |
| position | text | Required |
| notes | text | Optional |
| created_at | timestamptz | Default: now() |

**recordings**
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| session_id | uuid | Foreign key → sessions.id |
| type | text | 'long' or 'quick' |
| status | text | 'pending', 'processing', 'done', 'error' |
| created_at | timestamptz | Default: now() |

**transcripts**
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| recording_id | uuid | Foreign key → recordings.id |
| transcript_text | text | The full transcript |
| created_at | timestamptz | Default: now() |

**coach_ratings**
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| player_id | uuid | Foreign key → players.id |
| category | text | e.g. 'technical_skill' |
| rating | integer | 1–10 |
| notes | text | Optional |

**summaries**
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| player_id | uuid | Foreign key → players.id |
| strengths | text | |
| weaknesses | text | |
| standout_moments | text | |
| generated_at | timestamptz | |

**Verify:** All 6 tables appear in the Supabase Table Editor.

---

### Day 4 — Add Sample Data

In the Supabase Table Editor, manually add:
- 1 session row
- 3 player rows (linked to that session)
- 1 recording row (linked to the session)
- 1 transcript row (linked to the recording)

This gives you real data to test with once the app connects.

---

### Day 5 — Connect App to Supabase

**Prompt to give Claude Code:**
> "I need to connect my Next.js app to Supabase. Can you walk me through: installing the Supabase JavaScript client, creating a lib/supabase.ts file with the client setup, and where to put my Supabase URL and anon key from the Supabase dashboard? Also explain what environment variables are and how to use a .env.local file to keep my keys private."

**Important:** After creating `.env.local`, also create `.gitignore` if it doesn't exist and make sure `.env.local` is listed in it. This prevents your private keys from being uploaded to GitHub.

**Verify:** No errors when starting the dev server after adding the Supabase client.

---

### Day 6 — Read Data from Supabase

**Prompt to give Claude Code:**
> "I want to test that my Next.js app can read from Supabase. Can you show me how to: fetch all rows from the 'sessions' table in a Next.js server component, display the session names on the sessions list page, and handle the case where the table is empty? Use the Supabase client I set up in lib/supabase.ts."

**Verify:** The sessions page shows the sample session name you added in Day 4.

---

### Day 7 — Week 3 Review

1. Confirm all 6 tables exist in Supabase.
2. Confirm sample data appears in the app.
3. Confirm `.env.local` is not uploaded to GitHub.
4. Commit progress.
5. Update `PROGRESS.md`.

---

## Week 4: Roster Management

**Goal:** A coach can manually add, view, edit, and delete players. This is the first fully working feature.

---

### Day 1 — Create Player Form

**Prompt to give Claude Code:**
> "Create a 'New Player' form page at app/roster/new/page.tsx. The form should have fields for: player name (text, required), jersey number (text, required), position (dropdown with standard soccer positions: Goalkeeper, Defender, Midfielder, Forward), and optional notes (textarea). Add a Submit button and a Cancel button. Use Tailwind CSS and make it mobile-friendly. For now, just log the form data to the console on submit — we'll wire it to Supabase next."

**Verify:** Form renders and console.log shows data on submit.

---

### Day 2 — Save Player to Database

**Prompt to give Claude Code:**
> "Update the new player form to save the player data to the Supabase 'players' table on submit. For now, hardcode the session_id as the UUID of the test session I created. After a successful save, redirect the user to /roster. Handle loading state (disable the button while saving) and error state (show an error message if the save fails)."

**Verify:** Submit the form, then open Supabase Table Editor and confirm the player row appears.

---

### Day 3 — Display Roster List

**Prompt to give Claude Code:**
> "Update app/roster/page.tsx to fetch and display all players from the Supabase 'players' table. Show each player as a card with their name, jersey number, and position. Add an 'Add Player' button at the top that links to /roster/new. Show an empty state message if no players exist. Make it mobile-friendly."

**Verify:** Players you've added appear in the roster list.

---

### Day 4 — Edit Player

**Prompt to give Claude Code:**
> "Add edit functionality for players. Each player card on the roster page should have an 'Edit' button that links to /roster/[id]/edit. Create that edit page with a form pre-filled with the player's current data. When submitted, update the row in Supabase and redirect back to /roster."

**Verify:** Edit a player's name, save, and confirm the roster shows the updated name.

---

### Day 5 — Delete Player

**Prompt to give Claude Code:**
> "Add a delete button to each player card on the roster page. When clicked, show a simple confirmation dialog ('Are you sure you want to remove this player?'). If confirmed, delete the player from Supabase and remove them from the list. The delete should happen without a full page reload if possible."

**Verify:** Delete a player and confirm they disappear from the list and from Supabase.

---

### Day 6 — Validation and Polish

**Prompt to give Claude Code:**
> "Add proper validation to the new player form and the edit player form. Name, jersey number, and position should all be required. Show clear error messages below each field if the user tries to submit without filling them in. Make the error messages readable and mobile-friendly."

**Verify:** Try submitting an empty form — errors appear. Fill it in correctly — it saves.

---

### Day 7 — Week 4 Review

Add 10 fake players using realistic soccer names and jersey numbers. Test: add, view, edit, delete. Fix anything that looks broken. Commit. Update `PROGRESS.md`.

---

## Week 5: Sessions

**Goal:** A coach can create a session, name it, set start and end dates, and see all sessions in a list.

---

### Day 1 — Create Session Form

**Prompt to give Claude Code:**
> "Create a 'New Session' form at app/sessions/new/page.tsx. Fields: session name (text, required), start date (date picker, required), end date (date picker, required), notes (textarea, optional). Add Submit and Cancel buttons. Mobile-friendly, Tailwind CSS."

---

### Day 2 — Save Session to Database

**Prompt to give Claude Code:**
> "Wire the new session form to save to the Supabase 'sessions' table. Validate that end date is not before start date. After a successful save, redirect to /sessions. Handle loading and error states."

---

### Day 3 — Sessions List

**Prompt to give Claude Code:**
> "Update app/sessions/page.tsx to show all sessions from Supabase. Each session card should show: session name, start and end dates, and a button to view the session detail. Show empty state when no sessions exist."

---

### Day 4 — Session Detail Page

**Prompt to give Claude Code:**
> "Create a session detail page at app/sessions/[id]/page.tsx. Show: session name, date range, notes, a link to the Roster for this session, and a placeholder section for 'Recordings Timeline' (empty for now). Fetch session data from Supabase using the id from the URL."

---

### Day 5 — Connect Session to Roster

**Prompt to give Claude Code:**
> "Update the roster system so players are associated with a specific session. When creating a new player, use the current session's id (passed as a URL param or stored in state). On the session detail page, show a count of how many players are in the roster."

---

### Day 6 — Day-by-Day Timeline Placeholder

**Prompt to give Claude Code:**
> "On the session detail page, add a placeholder timeline section. If the session spans 3 days, show 3 date headers (e.g., 'Day 1 — June 18', 'Day 2 — June 19'). Under each header, show 'No recordings yet.' This is a placeholder — the real content comes in Week 8."

---

### Day 7 — Week 5 Review

Create 2 sessions. Add players to one. Click through the full flow. Commit. Update `PROGRESS.md`.

---

## Week 6: Recording Flow

**Goal:** The coach can start and stop a recording. The recording is saved to the database. Nothing is transcribed yet — that comes in Week 7.

---

### Day 1 — Recording Screen Layout

**Prompt to give Claude Code:**
> "Create a recording screen at app/sessions/[id]/record/page.tsx. It should show: the session name at the top, a large 'Start Recording' button, a 'Quick Note' button, and a status indicator that shows whether recording is active or idle. Make it clean and touch-friendly for use on a phone."

---

### Day 2 — Long Recording Mode

**Prompt to give Claude Code:**
> "Implement long recording mode on the recording screen. When the coach taps 'Start Recording', use the browser's MediaRecorder API to begin recording audio from the microphone. Show a pulsing red indicator while recording. When the coach taps 'Stop Recording', stop the MediaRecorder and save the audio blob in state (don't send it anywhere yet). Show a 'Recording saved — tap to transcribe' message."

---

### Day 3 — Quick Note Mode

**Prompt to give Claude Code:**
> "Add quick note mode. When the coach taps 'Quick Note', start a recording immediately and show a 'Recording...' state. After 30 seconds (or when they tap 'Done'), stop the recording. This should feel faster and simpler than the long recording mode — fewer taps, immediate start."

---

### Day 4 — Save Recording to Database

**Prompt to give Claude Code:**
> "When a recording is stopped, save a row to the Supabase 'recordings' table with: session_id (from the URL), type ('long' or 'quick'), status ('pending'), and created_at. Return the new recording id so we can attach the transcript to it later."

---

### Day 5 — Recording History

**Prompt to give Claude Code:**
> "Add a section below the record buttons that shows all past recordings for this session. Fetch them from the Supabase 'recordings' table. For each recording, show: the type (long/quick), the time it was recorded, and the status (pending/done). This is a simple list for now."

---

### Day 6 — Recording Indicator

**Prompt to give Claude Code:**
> "Improve the recording UI. When actively recording, show: a pulsing red circle, a timer counting up in seconds, and a 'Recording in progress...' label. When idle, show the normal 'Start Recording' button. Make the transition between states visually clear."

---

### Day 7 — Week 6 Review

Test the full record flow from the session page. Create a few recordings. Confirm they appear in Supabase. Commit. Update `PROGRESS.md`.

---

## Week 7: Transcription

**Goal:** Audio recordings get sent to OpenAI Whisper and come back as text stored in the database. Audio is then discarded.

---

### Day 1 — OpenAI API Setup

**Prompt to give Claude Code:**
> "I need to set up the OpenAI API in my Next.js project. Can you walk me through: installing the OpenAI Node.js SDK, adding my OpenAI API key to .env.local (confirm it's already in .gitignore), and creating a simple API route at app/api/transcribe/route.ts that accepts an audio file and returns a transcript using OpenAI's Whisper model?"

---

### Day 2 — Send Audio to Transcription API

**Prompt to give Claude Code:**
> "Update the recording screen so that when a recording is stopped, a 'Transcribe' button appears. When the coach taps it, send the audio blob to the /api/transcribe route and wait for the response. Show a loading state while transcribing ('Transcribing...'). Log the transcript text to the console for now."

---

### Day 3 — Save Transcript to Database

**Prompt to give Claude Code:**
> "After a successful transcription, save the transcript text to the Supabase 'transcripts' table with the recording_id and the transcript text. Update the recording's status in the 'recordings' table from 'pending' to 'done'. Confirm the audio blob is discarded (not stored anywhere) after the transcript is saved."

---

### Day 4 — Show Transcript in App

**Prompt to give Claude Code:**
> "Add a transcript viewer to the recording detail view. When a recording has status 'done', show the full transcript text below the recording metadata. Make it readable on mobile — good font size, good spacing."

---

### Day 5 — Error Handling

**Prompt to give Claude Code:**
> "Add proper error handling to the transcription flow. If the OpenAI API returns an error, update the recording status to 'error' in Supabase and show the coach a clear error message with a 'Try Again' button. Don't show a generic error — give the coach something useful."

---

### Day 6 — Transcript List

**Prompt to give Claude Code:**
> "Update the recording history list on the recording screen to show a preview of the transcript text (first 100 characters) for recordings that have been transcribed. Pending recordings should show 'Awaiting transcription'. Error recordings should show 'Transcription failed — retry'."

---

### Day 7 — Week 7 Review

Record a real spoken note about a player ("Number 7 showed great vision in the first drill"). Transcribe it. Confirm the transcript text appears in the app and in Supabase. Commit. Update `PROGRESS.md`.

---

## Week 8: Timeline and Player Linking

**Goal:** The session timeline view shows all transcripts in order, and the app links notes to players by name or jersey number.

---

### Day 1 — Session Timeline View

**Prompt to give Claude Code:**
> "Build a session timeline page at app/sessions/[id]/timeline/page.tsx. Fetch all transcripts for this session (via recordings) and display them in chronological order. Show each as a card with: timestamp, recording type, and the transcript text. Group them by day (Day 1, Day 2, Day 3)."

---

### Day 2 — Detect Player Mentions

**Prompt to give Claude Code:**
> "Write a utility function that takes a transcript text and a list of players (each with name and jersey_number) and returns all player mentions found in the text. Match on: exact name match, partial name match (first name only), and jersey number mention (e.g. 'number 7' or '#7' or just '7'). Return a list of matched players with the text span that matched them."

---

### Day 3 — Link Notes to Players

**Prompt to give Claude Code:**
> "Using the player mention detection function, update the transcription save flow to: after saving a transcript, run detection against all players in the session, and save each detected mention to the 'player_notes' table with player_id, transcript_id, and the matched text. Do this automatically after every successful transcription."

---

### Day 4 — Highlight Mentions in Timeline

**Prompt to give Claude Code:**
> "On the session timeline, highlight player names and jersey numbers in the transcript text. Highlighted mentions should be a distinct color and be clickable — clicking one opens the player detail page. Use a simple text parsing approach to wrap matched spans in styled elements."

---

### Day 5 — Player Notes Page

**Prompt to give Claude Code:**
> "Update the player detail page to show all notes linked to this player. Fetch rows from the 'player_notes' table where player_id matches. For each note, show the transcript text excerpt and the date/time. Order them chronologically."

---

### Day 6 — Flag Unclear Mentions

**Prompt to give Claude Code:**
> "If the player mention detection finds ambiguous mentions (e.g., jersey number not in roster, name matches more than one player), flag those transcript entries on the timeline with a yellow 'Review needed' badge. Clicking the badge should let the coach manually assign the note to a player."

---

### Day 7 — Week 8 Review

Record a note mentioning 2 players by name and 1 by jersey number. Transcribe. Confirm all 3 are linked on the timeline and appear on each player's page. Commit. Update `PROGRESS.md`.

---

## Week 9: Coach Ratings

**Goal:** The coach can rate each player across 6 categories. Ratings are saved and visible on the player page.

---

### Day 1 — Rating Categories

The 6 rating categories are:
1. Technical Skill
2. Speed / Athleticism
3. Decision-Making
4. Effort / Work Rate
5. Communication
6. Positioning

Each rated 1–10.

**Prompt to give Claude Code:**
> "Create a reusable rating component in components/RatingInput.tsx. It should accept: a category name (string), a current value (1–10 or null), and an onChange handler. Display the category name, a 1–10 slider or set of selectable number buttons, and the current value clearly. Make it touch-friendly on mobile."

---

### Day 2 — Build Rating Section on Player Page

**Prompt to give Claude Code:**
> "Add a 'Coach Ratings' section to the player detail page. Show the RatingInput component for all 6 categories. Fetch any existing ratings from the Supabase 'coach_ratings' table for this player. Show current values pre-filled if ratings exist."

---

### Day 3 — Save Ratings

**Prompt to give Claude Code:**
> "Wire up the rating section to save to Supabase. When a coach changes a rating, upsert (insert or update) the row in 'coach_ratings' for that player_id and category. Show a small 'Saved' indicator when the save succeeds. Save each rating independently so the coach doesn't have to submit a form."

---

### Day 4 — Overall Score

**Prompt to give Claude Code:**
> "Calculate and display an overall score for each player. The overall score is the average of all their coach ratings. Show it prominently on the player detail page as a number out of 10. If no ratings exist yet, show 'Not yet rated'."

---

### Day 5 — Show Ratings on Roster

**Prompt to give Claude Code:**
> "Update the roster list to show the overall score next to each player's name and jersey number. Players with no ratings should show a dash. This lets the coach see at a glance which players still need to be rated."

---

### Day 6 — Edit and Reset Ratings

**Prompt to give Claude Code:**
> "Add a 'Clear ratings' button on the player detail page that resets all coach ratings for that player to null. Confirm with a dialog before clearing. Update the overall score display immediately after."

---

### Day 7 — Week 9 Review

Rate all 10 test players you created earlier across all 6 categories. Confirm overall scores appear in the roster list. Commit. Update `PROGRESS.md`.

---

## Week 10: Player Summaries

**Goal:** The AI generates a written summary for each player — strengths, weaknesses, and standout moments — grounded in their notes and ratings.

---

### Day 1 — Summary API Route

**Prompt to give Claude Code:**
> "Create an API route at app/api/generate-summary/route.ts. It should accept a player_id, fetch all player notes and coach ratings for that player from Supabase, then call the OpenAI Chat API (GPT-4o) with a prompt that asks it to generate a soccer tryout evaluation including: 3 strengths, 3 weaknesses, and 2 standout moments. The prompt should include the player's position and name, all transcript notes, and all coach ratings. Return the result as structured JSON."

---

### Day 2 — Design the AI Prompt

**Prompt to give Claude Code:**
> "Help me write the best prompt for generating player summaries. The prompt should tell the AI: the player's name, jersey number, and position; all notes from the session (as a list); all coach ratings (category and score); that coach ratings should be weighted more heavily than the transcript notes; and that the output should be useful for a soccer coach making roster decisions. The output format should be JSON with fields: strengths (array of strings), weaknesses (array of strings), standout_moments (array of strings), and a one-paragraph overall_assessment."

---

### Day 3 — Generate and Save Summary

**Prompt to give Claude Code:**
> "Add a 'Generate Summary' button to the player detail page. When clicked, call the /api/generate-summary route and save the result to the Supabase 'summaries' table. Show a loading state while generating. After saving, display the summary on the page without a reload."

---

### Day 4 — Display Summary

**Prompt to give Claude Code:**
> "Design a clean summary display section for the player detail page. Show: Strengths as a bulleted list, Weaknesses as a bulleted list, Standout Moments as a bulleted list, and Overall Assessment as a paragraph. Use visual hierarchy (clear headings, good spacing) so it's easy to scan on mobile."

---

### Day 5 — Regenerate Summary

**Prompt to give Claude Code:**
> "Add a 'Regenerate Summary' button below the existing summary. When clicked, call the API again and overwrite the existing summary in Supabase. This lets the coach update the summary after adjusting ratings or after more notes come in."

---

### Day 6 — Summary Quality Check

Test summaries with realistic data. If outputs are too generic, refine the prompt.

**Prompt to give Claude Code:**
> "I tested the player summary generation and the output is too generic / doesn't reflect the specific notes well. Here is the current prompt [paste prompt] and here is an example output [paste output]. Can you improve the prompt to: make it more specific, require the AI to cite actual phrases from the notes, and produce more concrete, actionable evaluations for a soccer coach?"

---

### Day 7 — Week 10 Review

Generate summaries for all 10 test players. Review each one for quality and specificity. Commit. Update `PROGRESS.md`.

---

## Week 11: Rankings and Lineup

**Goal:** The app ranks players within each position and suggests a lineup with reasoning.

---

### Day 1 — Position Rankings

**Prompt to give Claude Code:**
> "Create a rankings page at app/sessions/[id]/rankings/page.tsx. Group all players in this session by position. Within each position group, sort players by their overall coach rating score (highest first). Show each player's name, jersey number, overall score, and a rank number (1st, 2nd, 3rd...). Make it clean and easy to scan."

---

### Day 2 — Ranking with AI Input

**Prompt to give Claude Code:**
> "Update the rankings so that position rankings use a weighted score: 70% coach rating, 30% an AI-generated position-specific score. Create an API route at app/api/rank-players/route.ts that accepts a list of players with their notes and ratings, and asks GPT-4o to score each player for their specific position (e.g., a Goalkeeper is evaluated differently than a Forward). Return ranked lists by position."

---

### Day 3 — Lineup Recommendation Screen

**Prompt to give Claude Code:**
> "Create a lineup recommendation page at app/sessions/[id]/lineup/page.tsx. Show a formation selector at the top with these options: 4-3-3, 4-4-2, 3-5-2. Below the selector, show an API-generated lineup suggestion with player names in each slot. Add a 'Generate Lineup' button."

---

### Day 4 — Generate Lineup API

**Prompt to give Claude Code:**
> "Create an API route at app/api/generate-lineup/route.ts. It should: accept a session_id and a formation string, fetch all players and their weighted scores, ask GPT-4o to fill in the formation slots with the best available players, and return a JSON object with player assignments for each position slot and a one-paragraph explanation of why these players were chosen."

---

### Day 5 — Lineup Display

**Prompt to give Claude Code:**
> "Design the lineup display on the recommendations page. Show: the selected formation, each position slot labeled with the position name, the player assigned to each slot, and the reasoning paragraph below. Make it clean and readable on mobile. Add a 'Regenerate' button."

---

### Day 6 — Polish Rankings and Lineup

Review both pages on mobile. Fix spacing, readability, and any odd layout issues.

**Prompt to give Claude Code:**
> "Review the rankings page and lineup page for mobile usability. Look for: text that's too small, buttons that are hard to tap, spacing that's too tight, and any layout that breaks on narrow screens. Suggest and implement specific Tailwind CSS fixes."

---

### Day 7 — Week 11 Review

Generate a lineup for your test session. Read the reasoning. Does it make sense given the ratings? Commit. Update `PROGRESS.md`.

---

## Week 12: Polish and Launch

**Goal:** The app is stable, usable on a real phone, deployed live, and ready for a coach to use in a real tryout.

---

### Day 1 — Mobile Review

Open the app on your actual phone (not Chrome Dev Tools). Write down every screen that looks off, feels clunky, or is hard to tap. Fix each issue one at a time.

---

### Day 2 — Loading and Error States

**Prompt to give Claude Code:**
> "Review every page in the app and confirm: every page that loads data shows a loading spinner or skeleton while fetching, every action that saves data shows a loading state on the button, and every error has a clear user-facing message. List any pages that are missing these states and implement them."

---

### Day 3 — Navigation and Flow

Walk through the complete workflow: create session → add players → record notes → transcribe → view timeline → rate players → generate summaries → view rankings → generate lineup. Fix anything that interrupts this flow.

---

### Day 4 — Fix Any Broken Flows

Use the issues you found in Days 1–3. Fix them now.

---

### Day 5 — Remove Clutter

**Prompt to give Claude Code:**
> "Review the current state of the app and identify: any placeholder text that was never replaced, any console.log statements I should remove before going live, any pages or components that are incomplete or broken, and any features that were partially started but not finished. List what you find."

Remove or fix each item.

---

### Day 6 — Deploy to Vercel

**Prompt to give Claude Code:**
> "Walk me through deploying my Next.js app to Vercel for the first time. I need to: push my current code to GitHub, connect my GitHub repo to Vercel, add my environment variables (SUPABASE URL, SUPABASE ANON KEY, OPENAI API KEY) in the Vercel dashboard, and trigger a deployment. Walk me through each step in plain English."

**Verify:** Visit the live Vercel URL and test the full workflow.

---

### Day 7 — Final Review and Launch

1. Open the app on your phone using the Vercel URL.
2. Complete the full coach workflow from start to finish.
3. Confirm everything works live.
4. Update `PROGRESS.md` with 100% complete status.
5. Save the live URL somewhere.
6. Celebrate — you built a real working product from zero.

---

## Definition of Done

The MVP is complete when a coach can:

- [x] Create a tryout session with a 2–3 day date range
- [x] Add players manually with name, jersey number, and position
- [x] Record spoken observations on a phone during live tryouts
- [x] Transcribe recordings and discard audio automatically
- [x] See all transcripts in a session timeline organized by day
- [x] See notes linked to individual player pages
- [x] Rate players across 6 categories
- [x] View AI-generated player summaries (strengths, weaknesses, standout moments)
- [x] See players ranked by position
- [x] Get a recommended lineup with reasoning
- [x] Do all of the above comfortably on a phone

---

## Claude Code Prompt Rules

**Always:**
- Give Claude Code one task at a time
- Say what file to change or create
- Say what the result should look like
- Ask it to explain what it's doing if you don't understand

**Never:**
- Ask Claude Code to "build the whole app"
- Move on before verifying the last change works
- Skip the daily verify step

**If something breaks:**
> "The change you made to [file name] broke [describe what's wrong]. Here is the error: [paste error]. Can you help me fix this without breaking anything else?"

---

*Last updated: June 2026*
