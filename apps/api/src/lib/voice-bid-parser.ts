export type VoiceBidDraft = {
  name: string;
  recipient: string;
  type: string;
  location: string;
  amount: number;
  notes: string;
  scopeSummary: string;
  publicPrivate: "Public" | "Private";
};

export function parseVoiceTranscriptToBid(transcript: string): VoiceBidDraft {
  const text = transcript.trim();
  const lower = text.toLowerCase();

  const amountMatch = text.match(/\$?\s*([\d,]+(?:\.\d+)?)\s*(million|mil|m|k)?/i);
  let amount = 0;
  if (amountMatch) {
    const raw = Number(amountMatch[1].replace(/,/g, ""));
    const unit = (amountMatch[2] ?? "").toLowerCase();
    amount = unit.startsWith("m") ? raw * 1_000_000 : unit === "k" ? raw * 1_000 : raw;
  }

  const locationMatch = text.match(/\b(?:in|at)\s+([A-Za-z .'-]+,\s*[A-Z]{2})\b/i);
  const location = locationMatch?.[1]?.trim() ?? "";

  const tradeMatch = text.match(/\b(hvac|electrical|plumbing|roofing|concrete|gc|general contractor)\b/i);
  const type = tradeMatch?.[1] ?? "General";

  const forMatch = text.match(/\b(?:for|with)\s+([A-Za-z0-9 .&'-]{3,40})/i);
  const recipient = forMatch?.[1]?.trim() ?? "";

  const publicPrivate: "Public" | "Private" =
    /public|municipal|county|school|federal|rfp|solicitation/i.test(text) ? "Public" : "Private";

  const nameBase = recipient ? `${recipient} ${type} opportunity` : `${type} opportunity`;
  const name = nameBase.slice(0, 80);

  return {
    name,
    recipient,
    type,
    location,
    amount,
    notes: `VoiceConnect capture: ${text.slice(0, 500)}`,
    scopeSummary: text,
    publicPrivate,
  };
}
