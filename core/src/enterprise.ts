/**
 * Seed data for the Enterprise & White-Label settings section.
 *
 * Prototype-only. Nothing here is persisted — these structures back local UI
 * state for demonstrating Enterprise-plan capabilities (branding, multi-location
 * rollups, role-based access). All figures are illustrative sample data.
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

export interface EnterprisePermission {
  id: string;
  label: string;
}

export const ENTERPRISE_PERMISSIONS: EnterprisePermission[] = [
  { id: "view-bids", label: "View bids" },
  { id: "edit-pricing", label: "Edit pricing" },
  { id: "approve-packages", label: "Approve packages" },
  { id: "manage-jobs", label: "Manage jobs" },
];

export interface EnterpriseRole {
  id: string;
  name: string;
  description: string;
  members: number;
  /** ids from ENTERPRISE_PERMISSIONS granted to this role */
  permissions: string[];
}

export const ENTERPRISE_ROLES: EnterpriseRole[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full workspace control and billing.",
    members: 2,
    permissions: ["view-bids", "edit-pricing", "approve-packages", "manage-jobs"],
  },
  {
    id: "estimator",
    name: "Estimator",
    description: "Builds and prices bid packages.",
    members: 6,
    permissions: ["view-bids", "edit-pricing"],
  },
  {
    id: "pm",
    name: "Project Manager",
    description: "Runs approvals and job handoff.",
    members: 4,
    permissions: ["view-bids", "approve-packages", "manage-jobs"],
  },
  {
    id: "field",
    name: "Field",
    description: "Read-only field access to won work.",
    members: 12,
    permissions: ["view-bids", "manage-jobs"],
  },
  {
    id: "finance",
    name: "Finance",
    description: "Reviews margins and reporting.",
    members: 3,
    permissions: ["view-bids", "edit-pricing"],
  },
];
