"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { key: "technical_skill", label: "Technical Skill" },
  { key: "speed", label: "Speed" },
  { key: "decision_making", label: "Decision Making" },
  { key: "effort", label: "Effort" },
  { key: "communication", label: "Communication" },
  { key: "positioning", label: "Positioning" },
];

interface ReportData {
  session: { name: string; start_date: string; end_date: string };
  players: Array<{
    id: string;
    name: string;
    jersey_number: string;
    position: string;
    ratings: Record<string, number>;
    summary: {
      strengths: string;
      weaknesses: string;
      standout_moments: string;
      overall_assessment: string;
    } | null;
  }>;
  rankings: Array<{ position: string; rank: number; score: number; name: string; jersey_number: string }>;
  lineup: { formation: string; player_slots: string[]; explanation: string } | null;
}

async function fetchReportData(sessionId: string): Promise<ReportData | null> {
  const { data: session } = await supabase.from("sessions").select("*").eq("id", sessionId).single();
  if (!session) return null;

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  const playerIds = (players ?? []).map((p) => p.id);

  const { data: allRatings } = playerIds.length > 0
    ? await supabase.from("coach_ratings").select("*").in("player_id", playerIds)
    : { data: [] };

  const { data: allSummaries } = playerIds.length > 0
    ? await supabase.from("summaries").select("*").in("player_id", playerIds)
    : { data: [] };

  const { data: rankings } = await supabase
    .from("rankings")
    .select("*, players(name, jersey_number)")
    .eq("session_id", sessionId)
    .order("position")
    .order("rank");

  const { data: lineup } = await supabase
    .from("lineups")
    .select("*")
    .eq("session_id", sessionId)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  const enrichedPlayers = (players ?? []).map((player) => {
    const ratings = Object.fromEntries(
      (allRatings ?? []).filter((r) => r.player_id === player.id).map((r) => [r.category, r.rating])
    );
    const summary = (allSummaries ?? []).find((s) => s.player_id === player.id) ?? null;
    return { ...player, ratings, summary };
  });

  const enrichedRankings = (
    (rankings ?? []) as Array<{
      position: string;
      rank: number;
      score: number;
      players: { name: string; jersey_number: string } | null;
    }>
  ).map((r) => ({
    position: r.position,
    rank: r.rank,
    score: r.score,
    name: r.players?.name ?? "Unknown",
    jersey_number: r.players?.jersey_number ?? "",
  }));

  return { session, players: enrichedPlayers, rankings: enrichedRankings, lineup: lineup ?? null };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildCsv(data: ReportData): string {
  const header = [
    "Name",
    "Jersey",
    "Position",
    ...CATEGORIES.map((c) => c.label),
    "Strengths",
    "Weaknesses",
    "Standout Moments",
    "Overall Assessment",
  ];

  const rows = data.players.map((player) => [
    player.name,
    player.jersey_number,
    player.position,
    ...CATEGORIES.map((c) => (player.ratings[c.key] != null ? String(player.ratings[c.key]) : "")),
    player.summary?.strengths ?? "",
    player.summary?.weaknesses ?? "",
    player.summary?.standout_moments ?? "",
    player.summary?.overall_assessment ?? "",
  ]);

  return [header, ...rows]
    .map((row) => row.map((cell) => csvEscape(String(cell))).join(","))
    .join("\n");
}

async function buildPdf(data: ReportData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  function ensureSpace(lineHeight: number) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function addHeading(text: string, size: number) {
    ensureSpace(size / 2);
    doc.setFontSize(size);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, y);
    y += size / 2 + 3;
  }

  function addParagraph(text: string, size = 10) {
    doc.setFontSize(size);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      ensureSpace(size / 2 + 1);
      doc.text(line, margin, y);
      y += size / 2 + 1;
    }
  }

  addHeading(data.session.name, 20);
  addParagraph(`${data.session.start_date} to ${data.session.end_date}`, 10);
  y += 4;

  addHeading("Roster & Ratings", 14);
  for (const player of data.players) {
    ensureSpace(14);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${player.name}  #${player.jersey_number}  (${player.position})`, margin, y);
    y += 5;

    const ratingsLine = CATEGORIES.map((c) => `${c.label}: ${player.ratings[c.key] ?? "-"}`).join("   ");
    addParagraph(ratingsLine, 9);

    if (player.summary) {
      addParagraph(`Strengths: ${player.summary.strengths}`, 9);
      addParagraph(`Weaknesses: ${player.summary.weaknesses}`, 9);
      if (player.summary.standout_moments) {
        addParagraph(`Standout: ${player.summary.standout_moments}`, 9);
      }
      addParagraph(`Overall: ${player.summary.overall_assessment}`, 9);
    }
    y += 4;
  }

  if (data.rankings.length > 0) {
    y += 2;
    addHeading("Position Rankings", 14);
    const byPosition: Record<string, typeof data.rankings> = {};
    for (const r of data.rankings) {
      if (!byPosition[r.position]) byPosition[r.position] = [];
      byPosition[r.position].push(r);
    }
    for (const [position, list] of Object.entries(byPosition)) {
      addParagraph(position, 11);
      for (const r of list) {
        addParagraph(`  ${r.rank}. ${r.name} (#${r.jersey_number}) — ${Number(r.score).toFixed(1)}`, 9);
      }
    }
  }

  if (data.lineup) {
    y += 2;
    addHeading("Suggested Lineup", 14);
    addParagraph(`Formation: ${data.lineup.formation}`, 11);
    for (const slot of data.lineup.player_slots) {
      addParagraph(`  ${slot}`, 9);
    }
    if (data.lineup.explanation) {
      y += 2;
      addParagraph(data.lineup.explanation, 9);
    }
  }

  return doc;
}

export default function ExportReportButton({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState<"pdf" | "csv" | null>(null);
  const [error, setError] = useState("");

  async function handleExport(format: "pdf" | "csv") {
    setLoading(format);
    setError("");

    try {
      const data = await fetchReportData(sessionId);
      if (!data) {
        setError("Couldn't load session data to export.");
        return;
      }

      const safeName = data.session.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

      if (format === "csv") {
        const csv = buildCsv(data);
        downloadBlob(new Blob([csv], { type: "text/csv" }), `${safeName}-report.csv`);
      } else {
        const doc = await buildPdf(data);
        doc.save(`${safeName}-report.pdf`);
      }
    } catch (err) {
      console.error("Export failed:", err);
      setError("Something went wrong generating the export.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleExport("pdf")}
          disabled={loading !== null}
          className="bg-gray-900 border border-gray-800 text-gray-300 rounded-xl py-3 text-xs font-semibold text-center hover:bg-gray-800 transition-colors disabled:opacity-40"
        >
          {loading === "pdf" ? "Exporting..." : "Export PDF"}
        </button>
        <button
          onClick={() => handleExport("csv")}
          disabled={loading !== null}
          className="bg-gray-900 border border-gray-800 text-gray-300 rounded-xl py-3 text-xs font-semibold text-center hover:bg-gray-800 transition-colors disabled:opacity-40"
        >
          {loading === "csv" ? "Exporting..." : "Export CSV"}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
}
