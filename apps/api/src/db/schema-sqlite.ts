import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  vertical: text("vertical").notNull().default("general-contractor"),
  profileJson: text("profile_json").notNull().default("{}"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const organizationMembers = sqliteTable("organization_members", {
  id: text("id").primaryKey(),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role").notNull().default("owner"),
});

export const orgInvites = sqliteTable("org_invites", {
  id: text("id").primaryKey(),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id),
  email: text("email").notNull(),
  role: text("role").notNull().default("member"),
  invitedByUserId: text("invited_by_user_id")
    .notNull()
    .references(() => users.id),
  tokenHash: text("token_hash").notNull().unique(),
  status: text("status").notNull().default("pending"),
  expiresAt: text("expires_at").notNull(),
  acceptedAt: text("accepted_at"),
  acceptedByUserId: text("accepted_by_user_id").references(() => users.id),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const bids = sqliteTable("bids", {
  id: text("id").primaryKey(),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id),
  name: text("name").notNull(),
  recipient: text("recipient").notNull().default(""),
  type: text("type").notNull().default(""),
  location: text("location").notNull().default(""),
  amount: real("amount").notNull().default(0),
  date: text("date").notNull(),
  status: text("status").notNull().default("Draft"),
  outcome: text("outcome"),
  reason: text("reason"),
  margin: real("margin"),
  notes: text("notes"),
  expectedDecisionDate: text("expected_decision_date"),
  contactPerson: text("contact_person"),
  clarificationRequested: integer("clarification_requested", { mode: "boolean" }).default(false),
  lastTouch: text("last_touch"),
  nextAction: text("next_action"),
  nextActionDate: text("next_action_date"),
  confidence: real("confidence"),
  fit: real("fit"),
  riskScore: real("risk_score"),
  publicPrivate: text("public_private"),
  daysRemaining: integer("days_remaining"),
  scopeSummary: text("scope_summary"),
  analysisStatus: text("analysis_status").default("none"),
  aiGenerated: integer("ai_generated", { mode: "boolean" }).default(false),
  humanReviewed: integer("human_reviewed", { mode: "boolean" }).default(false),
  deletedAt: text("deleted_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id),
  bidId: text("bid_id"),
  name: text("name").notNull(),
  client: text("client").notNull().default(""),
  location: text("location").notNull().default(""),
  vertical: text("vertical").notNull().default("general-contractor"),
  contractValue: real("contract_value").notNull().default(0),
  startDate: text("start_date").notNull(),
  targetCompletion: text("target_completion").notNull(),
  projectManager: text("project_manager").notNull().default(""),
  crewLead: text("crew_lead").notNull().default(""),
  currentPhase: text("current_phase").notNull().default(""),
  phaseIndex: integer("phase_index").notNull().default(0),
  totalPhases: integer("total_phases").notNull().default(1),
  status: text("status").notNull().default("Mobilizing"),
  payloadJson: text("payload_json").notNull().default("{}"),
  deletedAt: text("deleted_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const bidAnalyses = sqliteTable("bid_analyses", {
  id: text("id").primaryKey(),
  bidId: text("bid_id")
    .notNull()
    .references(() => bids.id),
  orgId: text("org_id").notNull(),
  status: text("status").notNull().default("queued"),
  summary: text("summary"),
  payloadJson: text("payload_json").notNull().default("{}"),
  aiGenerated: integer("ai_generated", { mode: "boolean" }).default(true),
  humanReviewed: integer("human_reviewed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),
});

export const voiceConnectDrafts = sqliteTable("voice_connect_drafts", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  bidId: text("bid_id"),
  transcript: text("transcript").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
});

export const bidScores = sqliteTable("bid_scores", {
  id: text("id").primaryKey(),
  bidId: text("bid_id").notNull(),
  orgId: text("org_id").notNull(),
  totalScore: real("total_score").notNull(),
  verdict: text("verdict").notNull(),
  categoriesJson: text("categories_json").notNull().default("[]"),
  gatesJson: text("gates_json").notNull().default("[]"),
  complianceJson: text("compliance_json").notNull().default("{}"),
  aiGenerated: integer("ai_generated", { mode: "boolean" }).notNull().default(true),
  humanReviewed: integer("human_reviewed", { mode: "boolean" }).notNull().default(false),
  reviewedBy: text("reviewed_by"),
  reviewedAt: text("reviewed_at"),
  lockedAt: text("locked_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const bidDocuments = sqliteTable("bid_documents", {
  id: text("id").primaryKey(),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id),
  bidId: text("bid_id")
    .notNull()
    .references(() => bids.id),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull().default(0),
  storagePath: text("storage_path").notNull(),
  extractedText: text("extracted_text"),
  extractionStatus: text("extraction_status").notNull().default("pending"),
  aiGenerated: integer("ai_generated", { mode: "boolean" }).default(true),
  humanReviewed: integer("human_reviewed", { mode: "boolean" }).default(false),
  deletedAt: text("deleted_at"),
  createdAt: text("created_at").notNull(),
});
