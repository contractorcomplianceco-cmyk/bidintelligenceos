/**
 * Pull walkthrough status from the CCA VideoConnect API (external add-on service).
 * Server-only — never import in apps/web.
 */

export type VideoConnectWalkthrough = {
  id: string;
  site: string;
  meta?: string | null;
  duration?: string | null;
  date?: string | null;
  scopeItems?: number | null;
  issues?: number | null;
  status: string;
  done?: boolean;
  bidId?: string | null;
};

export type VideoConnectStats = {
  walkthroughsThisWeek: number;
  scopeItemsExtracted: number;
  draftBidsCreated: number;
};

export type VideoConnectStatusResult = {
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
    process.env.VIDEO_CONNECT_API_URL?.trim() || process.env.CCA_VIDEO_CONNECT_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export function videoConnectAppUrl(): string | null {
  const explicit = process.env.VIDEO_CONNECT_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  return apiBase();
}

export function isVideoConnectConfigured(): boolean {
  return Boolean(apiBase());
}

async function fetchJson<T>(
  url: string,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const token = process.env.VIDEO_CONNECT_API_TOKEN?.trim();
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(12_000) });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    return { ok: true, data: (await res.json()) as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Request failed" };
  }
}

async function probeHealth(base: string): Promise<{ connected: boolean; error?: string }> {
  const paths = ["/api/health", "/health", "/api/v1/health"];
  let lastError = "No health endpoint responded";
  for (const path of paths) {
    const result = await fetchJson<{ status?: string; ok?: boolean }>(`${base}${path}`);
    if (result.ok) return { connected: true };
    lastError = result.error;
  }
  return { connected: false, error: lastError };
}

export async function getVideoConnectStatus(): Promise<VideoConnectStatusResult> {
  const base = apiBase();
  if (!base) {
    return {
      configured: false,
      connected: false,
      available: false,
      phase: 5,
      message:
        "VideoConnect is not configured. Set VIDEO_CONNECT_API_URL on the server to enable live walkthrough integration.",
    };
  }

  const probe = await probeHealth(base);
  const appUrl = videoConnectAppUrl() ?? undefined;

  if (!probe.connected) {
    return {
      configured: true,
      connected: false,
      available: false,
      phase: 5,
      message:
        "VideoConnect API is configured but unreachable. Check VIDEO_CONNECT_API_URL and network access.",
      appUrl,
      error: probe.error,
    };
  }

  return {
    configured: true,
    connected: true,
    available: true,
    phase: 5,
    message: "VideoConnect is connected. Walkthrough capture and visual intelligence are available.",
    appUrl,
  };
}

function normalizeWalkthroughs(
  data: VideoConnectWalkthrough[] | { walkthroughs?: VideoConnectWalkthrough[] },
): VideoConnectWalkthrough[] {
  if (Array.isArray(data)) return data;
  return data.walkthroughs ?? [];
}

export async function fetchVideoConnectWalkthroughs(): Promise<VideoConnectWalkthrough[]> {
  const base = apiBase();
  if (!base) return [];

  const paths = ["/api/walkthroughs", "/api/v1/walkthroughs", "/walkthroughs"];
  for (const path of paths) {
    const result = await fetchJson<
      VideoConnectWalkthrough[] | { walkthroughs?: VideoConnectWalkthrough[] }
    >(`${base}${path}`);
    if (result.ok) return normalizeWalkthroughs(result.data);
  }
  return [];
}

export function computeVideoConnectStats(
  walkthroughs: VideoConnectWalkthrough[],
): VideoConnectStats {
  const scopeItemsExtracted = walkthroughs.reduce((sum, w) => sum + (w.scopeItems ?? 0), 0);
  const draftBidsCreated = walkthroughs.filter((w) => w.done || w.bidId).length;
  return {
    walkthroughsThisWeek: walkthroughs.length,
    scopeItemsExtracted,
    draftBidsCreated,
  };
}
