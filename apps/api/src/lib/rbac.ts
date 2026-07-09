import { adminEmailSet } from "./clerk-config.js";

const INVITE_MANAGER_ROLES = new Set(["owner", "admin"]);

/** Roles that may create or revoke org invites and change member roles. */
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

/** Whether the actor may PATCH another member's role. */
export function canChangeMemberRole(actorRole: string, actorEmail: string): boolean {
  return canManageInvites(actorRole, actorEmail);
}

/**
 * Validates a role change request.
 * Blocks self-demote when actor is the sole owner.
 */
export function validateMemberRoleChange(params: {
  actorUserId: string;
  actorRole: string;
  targetUserId: string;
  targetCurrentRole: string;
  newRole: string;
  ownerCount: number;
}): { ok: true } | { ok: false; error: string } {
  const newRole = normalizeMemberRole(params.newRole);
  if (!isValidMemberRole(newRole)) {
    return { ok: false, error: "Invalid role" };
  }

  const isSelf = params.actorUserId === params.targetUserId;
  const targetIsOwner = params.targetCurrentRole.toLowerCase() === "owner";
  const actorIsOwner = params.actorRole.toLowerCase() === "owner";

  if (isSelf && targetIsOwner && newRole !== "owner") {
    return { ok: false, error: "Owners cannot demote themselves. Transfer ownership first." };
  }

  if (isSelf && actorIsOwner && newRole !== "owner") {
    return { ok: false, error: "Owners cannot change their own role." };
  }

  if (targetIsOwner && newRole !== "owner" && params.ownerCount <= 1) {
    return { ok: false, error: "Cannot demote the sole organization owner." };
  }

  if (newRole === "owner" && !actorIsOwner) {
    return { ok: false, error: "Only owners can assign the owner role." };
  }

  return { ok: true };
}
