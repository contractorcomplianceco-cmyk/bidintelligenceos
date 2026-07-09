import { adminEmailSet } from "./clerk-config.js";

const INVITE_MANAGER_ROLES = new Set(["owner", "admin"]);

/** Roles that may create or revoke org invites. */
export function canManageInvites(role: string, email: string): boolean {
  if (INVITE_MANAGER_ROLES.has(role.toLowerCase())) return true;
  return adminEmailSet().has(email.toLowerCase());
}

export function isValidMemberRole(role: string): boolean {
  return ["owner", "admin", "member", "viewer"].includes(role.toLowerCase());
}

export function normalizeMemberRole(role: string): string {
  const lower = role.toLowerCase();
  return isValidMemberRole(lower) ? lower : "member";
}
