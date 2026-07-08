-- BidIntelligenceOS Postgres schema + org_id RLS (idempotent)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  vertical TEXT NOT NULL DEFAULT 'general-contractor',
  profile_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS organization_members (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL DEFAULT 'owner'
);
CREATE INDEX IF NOT EXISTS organization_members_org_idx ON organization_members(org_id);

CREATE TABLE IF NOT EXISTS bids (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  recipient TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  outcome TEXT,
  reason TEXT,
  margin DOUBLE PRECISION,
  notes TEXT,
  expected_decision_date TEXT,
  contact_person TEXT,
  clarification_requested BOOLEAN DEFAULT FALSE,
  last_touch TEXT,
  next_action TEXT,
  next_action_date TEXT,
  confidence DOUBLE PRECISION,
  fit DOUBLE PRECISION,
  risk_score DOUBLE PRECISION,
  public_private TEXT,
  days_remaining INTEGER,
  scope_summary TEXT,
  analysis_status TEXT DEFAULT 'none',
  ai_generated BOOLEAN DEFAULT FALSE,
  human_reviewed BOOLEAN DEFAULT FALSE,
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS bids_org_idx ON bids(org_id);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id),
  bid_id TEXT,
  name TEXT NOT NULL,
  client TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  vertical TEXT NOT NULL DEFAULT 'general-contractor',
  contract_value DOUBLE PRECISION NOT NULL DEFAULT 0,
  start_date TEXT NOT NULL,
  target_completion TEXT NOT NULL,
  project_manager TEXT NOT NULL DEFAULT '',
  crew_lead TEXT NOT NULL DEFAULT '',
  current_phase TEXT NOT NULL DEFAULT '',
  phase_index INTEGER NOT NULL DEFAULT 0,
  total_phases INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Mobilizing',
  payload_json TEXT NOT NULL DEFAULT '{}',
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS jobs_org_idx ON jobs(org_id);

CREATE TABLE IF NOT EXISTS bid_analyses (
  id TEXT PRIMARY KEY,
  bid_id TEXT NOT NULL REFERENCES bids(id),
  org_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  summary TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  ai_generated BOOLEAN DEFAULT TRUE,
  human_reviewed BOOLEAN DEFAULT FALSE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS voice_connect_drafts (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  bid_id TEXT,
  transcript TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bid_scores (
  id TEXT PRIMARY KEY,
  bid_id TEXT NOT NULL REFERENCES bids(id),
  org_id TEXT NOT NULL,
  total_score DOUBLE PRECISION NOT NULL,
  verdict TEXT NOT NULL,
  categories_json TEXT NOT NULL DEFAULT '[]',
  gates_json TEXT NOT NULL DEFAULT '[]',
  compliance_json TEXT NOT NULL DEFAULT '{}',
  ai_generated BOOLEAN NOT NULL DEFAULT TRUE,
  human_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed_by TEXT,
  reviewed_at TEXT,
  locked_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS bid_scores_bid_idx ON bid_scores(bid_id);

CREATE TABLE IF NOT EXISTS bid_documents (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id),
  bid_id TEXT NOT NULL REFERENCES bids(id),
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  storage_path TEXT NOT NULL,
  extracted_text TEXT,
  extraction_status TEXT NOT NULL DEFAULT 'pending',
  ai_generated BOOLEAN DEFAULT TRUE,
  human_reviewed BOOLEAN DEFAULT FALSE,
  deleted_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS bid_documents_bid_idx ON bid_documents(bid_id);
CREATE INDEX IF NOT EXISTS bid_documents_org_idx ON bid_documents(org_id);

-- Row-level security (org_id isolation; session var app.org_id set per request)
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_connect_drafts ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'organization_members', 'bids', 'jobs', 'bid_analyses',
    'bid_scores', 'bid_documents', 'voice_connect_drafts'
  ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I_org_isolation ON %I', t, t);
    IF t = 'organization_members' THEN
      EXECUTE format(
        'CREATE POLICY %I_org_isolation ON %I FOR ALL USING (
          org_id = current_setting(''app.org_id'', true)
          OR user_id = current_setting(''app.user_id'', true)
        ) WITH CHECK (org_id = current_setting(''app.org_id'', true))',
        t, t
      );
    ELSE
      EXECUTE format(
        'CREATE POLICY %I_org_isolation ON %I FOR ALL USING (org_id = current_setting(''app.org_id'', true)) WITH CHECK (org_id = current_setting(''app.org_id'', true))',
        t, t
      );
    END IF;
  END LOOP;
END $$;
