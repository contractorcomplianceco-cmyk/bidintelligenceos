/**
 * G6 P0 public intel pack — tag-filter corpus for retrieveEvidence v1.
 * No vector DB; loads JSON at first use (or via loadPublicIntelPack()).
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

type PackFile = {
  version: number;
  layer: "public";
  cards: PackCard[];
};

let cachedChunks: EvidenceChunk[] | null = null;

function packPath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "../data/public-intel-cards/p0-cards.json");
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
  const raw = readFileSync(packPath(), "utf8");
  const pack = JSON.parse(raw) as PackFile;
  cachedChunks = cardsToChunks(pack.cards ?? []);
  return cachedChunks;
}

/** Test helper — inject pack without touching disk. */
export function setPublicIntelPackForTests(chunks: EvidenceChunk[] | null): void {
  cachedChunks = chunks;
}
