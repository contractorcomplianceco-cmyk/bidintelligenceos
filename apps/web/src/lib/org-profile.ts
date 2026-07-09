export type LicenseEntry = { name: string; id?: string; status?: string; expires?: string };

export function parseLicenseEntries(value: unknown): LicenseEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
    .map((entry) => ({
      name: typeof entry.name === "string" ? entry.name : "",
      id: typeof entry.id === "string" ? entry.id : undefined,
      status: typeof entry.status === "string" ? entry.status : undefined,
      expires: typeof entry.expires === "string" ? entry.expires : undefined,
    }))
    .filter((entry) => entry.name.trim().length > 0);
}

export function parseCertifications(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
}
