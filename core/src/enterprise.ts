/**
 * Enterprise settings seed data and RBAC role templates.
 *
 * RBAC_ROLE_TEMPLATES and RBAC_PERMISSIONS are the canonical permission matrix
 * for live org invites and member role management. ENTERPRISE_* demo fixtures
 * remain for anonymous / demo sessions only.
 */

export interface BrandColor {
  id: string;
  label: string;
  hex: string;
}

export const BRAND_COLORS: BrandColor[] = [
  { id: "sky", label: "Signal Blue", hex: "#0284C7" },
  { id: "indigo", label: "Deep Indigo", hex: "#2563EB" },
  { id: "emerald", label: "Field Green", hex: "#059669" },
  { id: "amber", label: "Safety Amber", hex: "#D97706" },
  { id: "slate", label: "Graphite", hex: "#334155" },
  { id: "rose", label: "Alert Rose", hex: "#E11D48" },
];

export interface EnterpriseLocation {
  id: string;
  name: string;
  region: string;
  activeBids: number;
  winRatePct: number;
  pipelineLabel: string;
  status: "active" | "onboarding";
}

export const ENTERPRISE_LOCATIONS: EnterpriseLocation[] = [
  {
    id: "sea",
    name: "Seattle HQ",
    region: "Pacific Northwest",
    activeBids: 24,
    winRatePct: 38,
    pipelineLabel: "$4.2M",
    status: "active",
  },
  {
    id: "pdx",
    name: "Portland Branch",
    region: "Pacific Northwest",
    activeBids: 15,
    winRatePct: 31,
    pipelineLabel: "$2.6M",
    status: "active",
  },
  {
    id: "den",
    name: "Denver Region",
    region: "Mountain West",
    activeBids: 19,
    winRatePct: 34,
    pipelineLabel: "$3.1M",
    status: "active",
  },
  {
    id: "phx",
    name: "Phoenix Franchise",
    region: "Southwest",
    activeBids: 8,
    winRatePct: 27,
    pipelineLabel: "$1.4M",
    status: "onboarding",
  },
];

/** Canonical RBAC permissions enforced via org member roles. */
export interface RbacPermission {
  id: string;
  label: string;
  description: string;
}

export const RBAC_PERMISSIONS: RbacPermission[] = [
  { id: "view-bids", label: "View bids", description: "Read bid pipeline, documents, and scores" },
  { id: "edit-bids", label: "Edit bids", description: "Create and update bids, intake, and package sections" },
  { id: "manage-jobs", label: "Manage jobs", description: "Deploy won work, scheduling, labor, and closeout" },
  { id: "manage-members", label: "Manage members", description: "Invite teammates and change member roles" },
  { id: "manage-org", label: "Manage organization", description: "Update org profile, branding, and enterprise settings" },
  { id: "export-packages", label: "Export packages", description: "Generate client-facing PDF/DOCX after human review" },
];

export interface RbacRoleTemplate {
  id: "owner" | "admin" | "member" | "viewer";
  name: string;
  description: string;
  /** ids from RBAC_PERMISSIONS granted to this role */
  permissions: string[];
}

/** Live org role templates — owner/admin/member/viewer. */
export const RBAC_ROLE_TEMPLATES: RbacRoleTemplate[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full workspace control, billing, and member administration.",
    permissions: ["view-bids", "edit-bids", "manage-jobs", "manage-members", "manage-org", "export-packages"],
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manage team, org settings, and all bid/job workflows except ownership transfer.",
    permissions: ["view-bids", "edit-bids", "manage-jobs", "manage-members", "manage-org", "export-packages"],
  },
  {
    id: "member",
    name: "Member",
    description: "Build bids, run jobs, and export reviewed packages.",
    permissions: ["view-bids", "edit-bids", "manage-jobs", "export-packages"],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to bids and job status.",
    permissions: ["view-bids"],
  },
];

/** @deprecated Demo-only — use RBAC_ROLE_TEMPLATES for live team RBAC. */
export interface EnterprisePermission {
  id: string;
  label: string;
}

/** @deprecated Demo-only — use RBAC_PERMISSIONS for live team RBAC. */
export const ENTERPRISE_PERMISSIONS: EnterprisePermission[] = RBAC_PERMISSIONS.map(({ id, label }) => ({
  id,
  label,
}));

/** @deprecated Demo-only — use RBAC_ROLE_TEMPLATES for live team RBAC. */
export interface EnterpriseRole {
  id: string;
  name: string;
  description: string;
  members: number;
  permissions: string[];
}

/** @deprecated Demo-only fixture roles for anonymous enterprise tab. */
export const ENTERPRISE_ROLES: EnterpriseRole[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full workspace control and billing.",
    members: 2,
    permissions: ["view-bids", "edit-bids", "manage-jobs", "manage-members", "manage-org", "export-packages"],
  },
  {
    id: "admin",
    name: "Admin",
    description: "Team and org administration.",
    members: 3,
    permissions: ["view-bids", "edit-bids", "manage-jobs", "manage-members", "manage-org", "export-packages"],
  },
  {
    id: "member",
    name: "Member",
    description: "Builds and prices bid packages.",
    members: 8,
    permissions: ["view-bids", "edit-bids", "manage-jobs", "export-packages"],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only field access.",
    members: 5,
    permissions: ["view-bids"],
  },
];
