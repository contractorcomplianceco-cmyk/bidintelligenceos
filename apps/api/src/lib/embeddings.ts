/**
 * Lightweight embedding helpers for BidOS vector RAG.
 * Uses BIOS_OPENAI_API_KEY when present; cosine over stored float[] (no pgvector required).
 */

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function parseEmbeddingJson(raw: string): number[] {
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.map(Number).filter((n) => Number.isFinite(n));
  } catch {
    return [];
  }
}

export function openaiApiKey(): string | undefined {
  return process.env.BIOS_OPENAI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim() || undefined;
}

export function embeddingModel(): string {
  return process.env.BIOS_EMBEDDING_MODEL?.trim() || "text-embedding-3-small";
}

/** Embed texts via OpenAI. Returns null vectors if no key (caller falls back to tags). */
export async function embedTexts(texts: string[]): Promise<{ model: string; vectors: number[][] } | null> {
  const key = openaiApiKey();
  if (!key || texts.length === 0) return null;
  const model = embeddingModel();
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, input: texts }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.warn(
      JSON.stringify({
        event: "embed_texts_failed",
        status: res.status,
        // never log key or full body secrets
        detail: errText.slice(0, 120),
      }),
    );
    return null;
  }
  const json = (await res.json()) as {
    data?: { embedding: number[]; index: number }[];
    model?: string;
  };
  const vectors = (json.data ?? [])
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
  return { model: json.model ?? model, vectors };
}
