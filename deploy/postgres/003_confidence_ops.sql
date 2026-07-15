-- BidOS confidence ops: autopsy, override journal, vector RAG embeddings (idempotent)

CREATE TABLE IF NOT EXISTS bid_autopsies (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id),
  bid_id TEXT NOT NULL REFERENCES bids(id),
  outcome TEXT NOT NULL,
  reason_codes_json TEXT NOT NULL DEFAULT '[]',
  competitor_notes TEXT,
  trade TEXT NOT NULL DEFAULT '',
  scored_snapshot_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS bid_autopsies_org_trade_idx ON bid_autopsies(org_id, trade);
CREATE UNIQUE INDEX IF NOT EXISTS bid_autopsies_bid_uidx ON bid_autopsies(bid_id);

ALTER TABLE bid_scores ADD COLUMN IF NOT EXISTS second_reviewer_user_id TEXT;
ALTER TABLE bid_scores ADD COLUMN IF NOT EXISTS second_reviewer_at TEXT;

CREATE TABLE IF NOT EXISTS score_override_journal (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id),
  bid_id TEXT NOT NULL REFERENCES bids(id),
  score_id TEXT,
  gate_id TEXT,
  from_verdict TEXT,
  to_verdict TEXT,
  override_role TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  reason_text TEXT,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS score_override_journal_bid_idx ON score_override_journal(bid_id);
CREATE INDEX IF NOT EXISTS score_override_journal_org_idx ON score_override_journal(org_id);

-- Lightweight vector store: JSON float[] (works without pgvector). Optional vector column if extension present.
CREATE TABLE IF NOT EXISTS public_intel_embeddings (
  chunk_id TEXT PRIMARY KEY,
  trade TEXT NOT NULL DEFAULT 'all',
  region TEXT NOT NULL DEFAULT 'nationwide',
  topic TEXT NOT NULL DEFAULT '',
  title TEXT,
  source_url TEXT,
  as_of_date TEXT,
  layer TEXT NOT NULL DEFAULT 'public',
  text TEXT NOT NULL,
  embedding_json TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS public_intel_embeddings_trade_topic_idx
  ON public_intel_embeddings(trade, topic);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
    BEGIN
      ALTER TABLE public_intel_embeddings ADD COLUMN IF NOT EXISTS embedding vector(1536);
    EXCEPTION WHEN others THEN
      NULL;
    END;
  END IF;
END $$;

ALTER TABLE bid_autopsies ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_override_journal ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS bid_autopsies_org_isolation ON bid_autopsies';
  EXECUTE
    'CREATE POLICY bid_autopsies_org_isolation ON bid_autopsies FOR ALL
     USING (org_id = current_setting(''app.org_id'', true))
     WITH CHECK (org_id = current_setting(''app.org_id'', true))';
  EXECUTE 'DROP POLICY IF EXISTS score_override_journal_org_isolation ON score_override_journal';
  EXECUTE
    'CREATE POLICY score_override_journal_org_isolation ON score_override_journal FOR ALL
     USING (org_id = current_setting(''app.org_id'', true))
     WITH CHECK (org_id = current_setting(''app.org_id'', true))';
END $$;
