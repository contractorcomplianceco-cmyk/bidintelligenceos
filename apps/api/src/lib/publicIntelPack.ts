/**
 * G6 P0 public intel pack — tag-filter corpus for retrieveEvidence v1.
 * No vector DB; loads JSON at first use (or via loadPublicIntelPack()).
 *
 * FRED/BLS honesty: when refresh.mode is "manual" (keys unset or refresh
 * didn't pull live series), UI/API must say "as of [date], manual".
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { EvidenceChunk } from "./retrieveEvidence.js";

type PackCard = {
  id: string;
  trades: string[];
  region: string;
  topic: string;
  title: string;
  asOfDate: string;
  sourceUrl?: string;
  text: string;
};

type PackRefresh = {
  lastRun?: string;
  mode?: "manual" | "live" | "partial";
  sources?: Array<{ source?: string; series?: string; asOf?: string }>;
  honestyLabel?: string;
  skips?: string[];
};

type PackFile = {
  version: number;
  layer: "public";
  cards: PackCard[];
  refresh?: PackRefresh;
};

export type PublicIntelRefreshHonesty = {
  asOfDate: string;
  mode: "manual" | "live" | "partial";
  /** Short stamp for score panel / API — never invents live pulls. */
  label: string;
  liveSourceCount: number;
};

let cachedChunks: EvidenceChunk[] | null = null;
let cachedHonesty: PublicIntelRefreshHonesty | null = null;

function packPath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "../data/public-intel-cards/p0-cards.json");
}

function readPackFile(): PackFile {
  const raw = readFileSync(packPath(), "utf8");
  return JSON.parse(raw) as PackFile;
}

export function buildPublicIntelRefreshHonesty(pack: PackFile): PublicIntelRefreshHonesty {
  const sources = pack.refresh?.sources ?? [];
  const liveSourceCount = sources.length;
  const cardDates = (pack.cards ?? []).map((c) => c.asOfDate).filter(Boolean);
  const asOfDate =
    pack.refresh?.lastRun ||
    cardDates.sort().at(-1) ||
    new Date().toISOString().slice(0, 10);

  let mode: PublicIntelRefreshHonesty["mode"] =
    pack.refresh?.mode ?? (liveSourceCount > 0 ? "live" : "manual");
  if (!pack.refresh?.mode) {
    if (liveSourceCount === 0) mode = "manual";
    else if ((process.env.FRED_API_KEY || process.env.BLS_API_KEY) && liveSourceCount > 0) {
      mode = "live";
    } else {
      mode = "partial";
    }
  }

  const label =
    pack.refresh?.honestyLabel ||
    (mode === "live"
      ? `Market anchors as of ${asOfDate}, live FRED/BLS refresh`
      : mode === "partial"
        ? `Market anchors as of ${asOfDate}, partial (some series live; treat others as manual)`
        : `Market anchors as of ${asOfDate}, manual — FRED/BLS not live-pulled`);

  return { asOfDate, mode, label, liveSourceCount };
}

/** Honesty stamp for BidOS score panel + health-adjacent surfaces. */
export function getPublicIntelRefreshHonesty(force = false): PublicIntelRefreshHonesty {
  if (cachedHonesty && !force) return cachedHonesty;
  const pack = readPackFile();
  cachedHonesty = buildPublicIntelRefreshHonesty(pack);
  return cachedHonesty;
}

/** Expand multi-trade cards into one EvidenceChunk per trade (plus keep "all"). */
export function cardsToChunks(cards: PackCard[]): EvidenceChunk[] {
  const out: EvidenceChunk[] = [];
  for (const card of cards) {
    const trades = card.trades?.length ? card.trades : ["all"];
    for (const trade of trades) {
      out.push({
        id: trades.length > 1 ? `${card.id}:${trade}` : card.id,
        text: card.text,
        trade: trade.toLowerCase(),
        region: card.region,
        topic: card.topic,
        asOfDate: card.asOfDate,
        layer: "public",
        sourceUrl: card.sourceUrl,
        title: card.title,
      });
    }
  }
  return out;
}

export function loadPublicIntelPack(force = false): EvidenceChunk[] {
  if (cachedChunks && !force) return cachedChunks;
  const pack = readPackFile();
  cachedChunks = cardsToChunks(pack.cards ?? []);
  cachedHonesty = buildPublicIntelRefreshHonesty(pack);
  return cachedChunks;
}

/** Test helper — inject pack without touching disk. */
export function setPublicIntelPackForTests(chunks: EvidenceChunk[] | null): void {
  cachedChunks = chunks;
  if (!chunks) cachedHonesty = null;
}
