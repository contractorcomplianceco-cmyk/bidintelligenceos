/**
 * Pull capture status from the CCA VoiceConnect API (external add-on service).
 * Server-only — never import in apps/web.
 */

export type VoiceConnectCapture = {
  id: string;
  title: string;
  meta?: string | null;
  duration?: string | null;
  date?: string | null;
  itemsTagged?: number | null;
  status: string;
  done?: boolean;
  bidId?: string | null;
};

export type VoiceConnectStats = {
  capturesThisWeek: number;
  itemsAutoTagged: number;
  draftBidsCreated: number;
};

export type VoiceConnectStatusResult = {
  configured: boolean;
  connected: boolean;
  available: boolean;
  phase: number;
  message: string;
  appUrl?: string;
  error?: string;
};

function apiBase(): string | null {
  const raw =
    process.env.VOICE_CONNECT_API_URL?.trim() || process.env.CCA_VOICE_CONNECT_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export function voiceConnectAppUrl(): string | null {
  const explicit = process.env.VOICE_CONNECT_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  return apiBase();
}

export function isVoiceConnectConfigured(): boolean {
  return Boolean(apiBase());
}

async function fetchJson<T>(
  url: string,
  init?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const headers: Record<string, string> = { Accept: "application/json", ...(init?.headers as Record<string, string> | undefined) };
    const token = process.env.VOICE_CONNECT_API_TOKEN?.trim();
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, {
      ...init,
      headers,
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    return { ok: true, data: (await res.json()) as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Request failed" };
  }
}

async function probeHealth(base: string): Promise<{ connected: boolean; error?: string }> {
  const getPaths = ["/api/health", "/health", "/api/v1/health"];
  let lastError = "No health endpoint responded";
  for (const path of getPaths) {
    const result = await fetchJson<{ status?: string; ok?: boolean }>(`${base}${path}`);
    if (result.ok) return { connected: true };
    lastError = result.error;
  }

  const summaryProbe = await fetchJson<{ summary?: unknown }>(`${base}/api/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  if (summaryProbe.ok) return { connected: true };

  return { connected: false, error: lastError };
}

export async function getVoiceConnectStatus(): Promise<VoiceConnectStatusResult> {
  const base = apiBase();
  if (!base) {
    return {
      configured: false,
      connected: false,
      available: false,
      phase: 5,
      message:
        "VoiceConnect is not configured. Set VOICE_CONNECT_API_URL on the server to enable live field capture integration.",
    };
  }

  const probe = await probeHealth(base);
  const appUrl = voiceConnectAppUrl() ?? undefined;

  if (!probe.connected) {
    return {
      configured: true,
      connected: false,
      available: false,
      phase: 5,
      message:
        "VoiceConnect API is configured but unreachable. Check VOICE_CONNECT_API_URL and network access.",
      appUrl,
      error: probe.error,
    };
  }

  return {
    configured: true,
    connected: true,
    available: true,
    phase: 5,
    message: "VoiceConnect is connected. Voice field capture and draft bid handoff are available.",
    appUrl,
  };
}

function normalizeCaptures(
  data: VoiceConnectCapture[] | { captures?: VoiceConnectCapture[]; walkthroughs?: VoiceConnectCapture[] },
): VoiceConnectCapture[] {
  if (Array.isArray(data)) return data;
  return data.captures ?? data.walkthroughs ?? [];
}

export async function fetchVoiceConnectCaptures(): Promise<VoiceConnectCapture[]> {
  const base = apiBase();
  if (!base) return [];

  const paths = ["/api/captures", "/api/v1/captures", "/api/walkthroughs", "/captures"];
  for (const path of paths) {
    const result = await fetchJson<
      VoiceConnectCapture[] | { captures?: VoiceConnectCapture[]; walkthroughs?: VoiceConnectCapture[] }
    >(`${base}${path}`);
    if (result.ok) {
      const normalized = normalizeCaptures(result.data);
      if (normalized.length > 0) return normalized;
    }
  }
  return [];
}

export function computeVoiceConnectStats(captures: VoiceConnectCapture[]): VoiceConnectStats {
  const itemsAutoTagged = captures.reduce((sum, c) => sum + (c.itemsTagged ?? 0), 0);
  const draftBidsCreated = captures.filter((c) => c.done || c.bidId).length;
  return {
    capturesThisWeek: captures.length,
    itemsAutoTagged,
    draftBidsCreated,
  };
}
