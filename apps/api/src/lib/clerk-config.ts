/** Clerk is on when AUTH_ENABLED=true and server secret is set (CCA suite pattern). */
export function isClerkAuthEnabled(): boolean {
  return process.env.AUTH_ENABLED === "true" && Boolean(process.env.CLERK_SECRET_KEY?.trim());
}

/** Allowlisted emails for dual-mode smoke login when BIOS_SMOKE_PASSWORD is set. */
export const SMOKE_LOGIN_ALLOWLIST = ["carmen@ccacontact.com", "rose@ccacontact.com"] as const;

/** Dual overlay: Clerk stays on; allowlisted emails may use legacy POST /login. */
export function isSmokeLegacyLoginEnabled(): boolean {
  return Boolean(process.env.BIOS_SMOKE_PASSWORD?.trim());
}

export function isSmokeAllowlistedEmail(email: string): boolean {
  return (SMOKE_LOGIN_ALLOWLIST as readonly string[]).includes(email.trim().toLowerCase());
}

export function adminEmailSet(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function mapClerkRole(email: string | null | undefined): string {
  if (!email) return "reviewer";
  return adminEmailSet().has(email.toLowerCase()) ? "owner" : "reviewer";
}
