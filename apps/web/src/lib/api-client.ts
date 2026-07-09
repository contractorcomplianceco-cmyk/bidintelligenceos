import { apiUrl } from "./api-config";
import { getApiAuthHeaders } from "./api-auth";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const authHeaders = await getApiAuthHeaders();
  const res = await fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(
      (body as { error?: string })?.error ?? res.statusText,
      res.status,
      body,
    );
  }

  return body as T;
}

function parseContentDispositionFilename(header: string | null): string | null {
  if (!header) return null;
  const quoted = header.match(/filename="([^"]+)"/i);
  if (quoted?.[1]) return quoted[1];
  const unquoted = header.match(/filename=([^;]+)/i);
  return unquoted?.[1]?.trim() ?? null;
}

export async function apiDownload(path: string, init?: RequestInit): Promise<{ blob: Blob; filename: string | null }> {
  const authHeaders = await getApiAuthHeaders();
  const res = await fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      ...authHeaders,
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    let body: unknown = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
    throw new ApiError(
      (body as { error?: string })?.error ?? res.statusText,
      res.status,
      body,
    );
  }

  const blob = await res.blob();
  const filename = parseContentDispositionFilename(res.headers.get("Content-Disposition"));
  return { blob, filename };
}
