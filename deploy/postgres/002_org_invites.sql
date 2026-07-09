-- Phase 5: org invites for RBAC / team onboarding
CREATE TABLE IF NOT EXISTS org_invites (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by_user_id TEXT NOT NULL REFERENCES users(id),
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TEXT NOT NULL,
  accepted_at TEXT,
  accepted_by_user_id TEXT REFERENCES users(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS org_invites_org_idx ON org_invites(org_id);

CREATE UNIQUE INDEX IF NOT EXISTS org_invites_org_email_pending_idx
  ON org_invites(org_id, email)
  WHERE status = 'pending';

ALTER TABLE org_invites ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS org_invites_org_isolation ON org_invites';
  EXECUTE
    'CREATE POLICY org_invites_org_isolation ON org_invites FOR ALL
     USING (org_id = current_setting(''app.org_id'', true))
     WITH CHECK (org_id = current_setting(''app.org_id'', true))';
END $$;
