import {
  pgTable,
  text,
  boolean,
  doublePrecision,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  vertical: text("vertical").notNull().default("general-contractor"),
  profileJson: text("profile_json").notNull().default("{}"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull().default("owner"),
  },
  (t) => [index("organization_members_org_idx").on(t.orgId)],
);

export const bids = pgTable(
  "bids",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id),
    name: text("name").notNull(),
    recipient: text("recipient").notNull().default(""),
    type: text("type").notNull().default(""),
    location: text("location").notNull().default(""),
    amount: doublePrecision("amount").notNull().default(0),
    date: text("date").notNull(),
    status: text("status").notNull().default("Draft"),
    outcome: text("outcome"),
    reason: text("reason"),
    margin: doublePrecision("margin"),
    notes: text("notes"),
    expectedDecisionDate: text("expected_decision_date"),
    contactPerson: text("contact_person"),
    clarificationRequested: boolean("clarification_requested").default(false),
    lastTouch: text("last_touch"),
    nextAction: text("next_action"),
    nextActionDate: text("next_action_date"),
    confidence: doublePrecision("confidence"),
    fit: doublePrecision("fit"),
    riskScore: doublePrecision("risk_score"),
    publicPrivate: text("public_private"),
    daysRemaining: integer("days_remaining"),
    scopeSummary: text("scope_summary"),
    analysisStatus: text("analysis_status").default("none"),
    aiGenerated: boolean("ai_generated").default(false),
    humanReviewed: boolean("human_reviewed").default(false),
    deletedAt: text("deleted_at"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [index("bids_org_idx").on(t.orgId)],
);

export const jobs = pgTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id),
    bidId: text("bid_id"),
    name: text("name").notNull(),
    client: text("client").notNull().default(""),
    location: text("location").notNull().default(""),
    vertical: text("vertical").notNull().default("general-contractor"),
    contractValue: doublePrecision("contract_value").notNull().default(0),
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
  },
  (t) => [index("jobs_org_idx").on(t.orgId)],
);

export const bidAnalyses = pgTable("bid_analyses", {
  id: text("id").primaryKey(),
  bidId: text("bid_id")
    .notNull()
    .references(() => bids.id),
  orgId: text("org_id").notNull(),
  status: text("status").notNull().default("queued"),
  summary: text("summary"),
  payloadJson: text("payload_json").notNull().default("{}"),
  aiGenerated: boolean("ai_generated").default(true),
  humanReviewed: boolean("human_reviewed").default(false),
  createdAt: text("created_at").notNull(),
});

export const voiceConnectDrafts = pgTable("voice_connect_drafts", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  bidId: text("bid_id"),
  transcript: text("transcript").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
});

export const bidScores = pgTable(
  "bid_scores",
  {
    id: text("id").primaryKey(),
    bidId: text("bid_id").notNull(),
    orgId: text("org_id").notNull(),
    totalScore: doublePrecision("total_score").notNull(),
    verdict: text("verdict").notNull(),
    categoriesJson: text("categories_json").notNull().default("[]"),
    gatesJson: text("gates_json").notNull().default("[]"),
    complianceJson: text("compliance_json").notNull().default("{}"),
    aiGenerated: boolean("ai_generated").notNull().default(true),
    humanReviewed: boolean("human_reviewed").notNull().default(false),
    reviewedBy: text("reviewed_by"),
    reviewedAt: text("reviewed_at"),
    lockedAt: text("locked_at").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("bid_scores_bid_idx").on(t.bidId)],
);

export const bidDocuments = pgTable(
  "bid_documents",
  {
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
    aiGenerated: boolean("ai_generated").default(true),
    humanReviewed: boolean("human_reviewed").default(false),
    deletedAt: text("deleted_at"),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("bid_documents_bid_idx").on(t.bidId), index("bid_documents_org_idx").on(t.orgId)],
);
