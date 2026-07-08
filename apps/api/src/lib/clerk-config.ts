/** Clerk is on when AUTH_ENABLED=true and server secret is set (CCA suite pattern). */
export function isClerkAuthEnabled(): boolean {
  return process.env.AUTH_ENABLED === "true" && Boolean(process.env.CLERK_SECRET_KEY?.trim());
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
