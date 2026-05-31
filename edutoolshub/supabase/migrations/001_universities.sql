-- Universities table for College GPA Requirement Checker
-- Applied via Supabase migration: create_universities_tables

CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  state_province TEXT,
  city TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Public', 'Private')),
  qs_ranking INTEGER,
  min_gpa NUMERIC(3,2) NOT NULL,
  avg_gpa NUMERIC(3,2) NOT NULL,
  gpa_scale NUMERIC(2,1) NOT NULL DEFAULT 4.0,
  acceptance_rate NUMERIC(5,2),
  sat_range TEXT,
  act_range TEXT,
  popular_programs TEXT[] NOT NULL DEFAULT '{}',
  admission_policy TEXT,
  admission_notes TEXT,
  website_url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  last_fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_year INTEGER NOT NULL DEFAULT 2026,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_fetch_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  universities_updated INTEGER NOT NULL DEFAULT 0,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_universities_country ON universities(country);
CREATE INDEX IF NOT EXISTS idx_universities_min_gpa ON universities(min_gpa);
CREATE INDEX IF NOT EXISTS idx_universities_qs_ranking ON universities(qs_ranking);
CREATE INDEX IF NOT EXISTS idx_universities_type ON universities(type);
CREATE INDEX IF NOT EXISTS idx_universities_state_province ON universities(state_province);

ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_fetch_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read universities" ON universities
  FOR SELECT USING (true);
