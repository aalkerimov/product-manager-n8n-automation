-- =============================================================================
-- init-db.sql
-- Creates the automation_os schema for the advanced (PostgreSQL) stack.
-- Run once after creating the database.
-- =============================================================================

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS automation_os;
SET search_path TO automation_os, public;

-- ---------------------------------------------------------------------------
-- Customer Feedback Brain
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS feedback_items (
    id              TEXT PRIMARY KEY,
    source          TEXT NOT NULL,           -- webhook | csv | typeform | intercom
    text            TEXT NOT NULL,
    customer_segment TEXT,
    rating          INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    received_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dedup_hash      TEXT UNIQUE NOT NULL,   -- hash of normalised text
    classified_at   TIMESTAMPTZ,
    classification  JSONB,                  -- full AI classification result
    confidence      NUMERIC(4,3),
    is_duplicate    BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback_items (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_source  ON feedback_items (source);
CREATE INDEX IF NOT EXISTS idx_feedback_segment ON feedback_items (customer_segment);
CREATE INDEX IF NOT EXISTS idx_feedback_dedup   ON feedback_items (dedup_hash);

CREATE TABLE IF NOT EXISTS feedback_reports (
    id          SERIAL PRIMARY KEY,
    period_start TIMESTAMPTZ NOT NULL,
    period_end  TIMESTAMPTZ NOT NULL,
    report_json JSONB NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    sent_at     TIMESTAMPTZ,
    sent_to     TEXT[]
);

-- ---------------------------------------------------------------------------
-- Competitor Change Monitor
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS competitor_snapshots (
    id          SERIAL PRIMARY KEY,
    company     TEXT NOT NULL,
    page_type   TEXT NOT NULL,              -- pricing | changelog | careers | blog
    url         TEXT NOT NULL,
    content_text TEXT NOT NULL,             -- stripped HTML text
    content_hash TEXT NOT NULL,             -- SHA-256 of content_text
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_snapshots_url     ON competitor_snapshots (url, captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_company ON competitor_snapshots (company);

CREATE TABLE IF NOT EXISTS competitor_changes (
    id              SERIAL PRIMARY KEY,
    company         TEXT NOT NULL,
    page_type       TEXT NOT NULL,
    url             TEXT NOT NULL,
    previous_hash   TEXT NOT NULL,
    new_hash        TEXT NOT NULL,
    diff_summary    TEXT,
    importance_score INTEGER,               -- 1–10
    possible_reason TEXT,
    recommended_response TEXT,
    detected_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notified_at     TIMESTAMPTZ,
    notification_channel TEXT
);

CREATE INDEX IF NOT EXISTS idx_changes_company    ON competitor_changes (company, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_changes_importance ON competitor_changes (importance_score DESC);

-- ---------------------------------------------------------------------------
-- Weekly Product Brief
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS product_briefs (
    id          SERIAL PRIMARY KEY,
    period_start TIMESTAMPTZ NOT NULL,
    period_end  TIMESTAMPTZ NOT NULL,
    brief_json  JSONB NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    sent_at     TIMESTAMPTZ,
    sent_to     TEXT[]
);

-- ---------------------------------------------------------------------------
-- Workflow execution log (for error tracking across all workflows)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS execution_log (
    id              SERIAL PRIMARY KEY,
    workflow_name   TEXT NOT NULL,
    execution_id    TEXT,
    status          TEXT NOT NULL,          -- success | error | timeout
    error_message   TEXT,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at     TIMESTAMPTZ,
    metadata        JSONB
);

CREATE INDEX IF NOT EXISTS idx_exec_log_workflow ON execution_log (workflow_name, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_exec_log_status   ON execution_log (status);

-- ---------------------------------------------------------------------------
-- Human approval queue
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS approval_requests (
    id              TEXT PRIMARY KEY,       -- UUID from n8n
    workflow_name   TEXT NOT NULL,
    title           TEXT NOT NULL,
    summary         TEXT,
    details_json    JSONB,
    status          TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected | timeout
    approver_email  TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    decided_at      TIMESTAMPTZ,
    comment         TEXT
);

CREATE INDEX IF NOT EXISTS idx_approval_status  ON approval_requests (status);
CREATE INDEX IF NOT EXISTS idx_approval_created ON approval_requests (created_at DESC);

-- Grant usage to the automation_os user if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'automation_os') THEN
        GRANT USAGE ON SCHEMA automation_os TO automation_os;
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA automation_os TO automation_os;
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA automation_os TO automation_os;
    END IF;
END $$;
