export type LicenseEntry = { name: string; id?: string; status?: string; expires?: string };

export type LeadershipEntry = {
  name: string;
  role?: string;
  tenure?: string;
  phone?: string;
  email?: string;
};

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function parseStringField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseServiceAreas(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(/[,;\n]/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function parseLeadershipEntries(value: unknown): LeadershipEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
    .map((entry) => ({
      name: typeof entry.name === "string" ? entry.name : "",
      role: typeof entry.role === "string" ? entry.role : undefined,
      tenure: typeof entry.tenure === "string" ? entry.tenure : undefined,
      phone: typeof entry.phone === "string" ? entry.phone : undefined,
      email: typeof entry.email === "string" ? entry.email : undefined,
    }))
    .filter((entry) => entry.name.trim().length > 0);
}

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
