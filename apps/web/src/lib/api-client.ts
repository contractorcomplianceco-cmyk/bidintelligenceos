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
