-- Create integrations table for storing customer OAuth connections
-- Each organization can connect multiple services (Supabase, Slack, GitHub, etc.)

CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Organization relationship
  organization_id UUID NOT NULL,

  -- Integration details
  integration_type TEXT NOT NULL, -- 'supabase' | 'slack' | 'github' | 'vercel' | 'aws' | etc.
  name TEXT NOT NULL, -- User-friendly name (e.g., "Production Supabase", "Marketing Slack")

  -- Encrypted credentials and configuration
  config JSONB NOT NULL DEFAULT '{}', -- Stores encrypted tokens, API keys, URLs, etc.

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'error' | 'paused' | 'disconnected'
  error_message TEXT, -- Last error if status is 'error'

  -- Scan scheduling (optional - for future use)
  scan_schedule TEXT, -- Cron expression (e.g., '0 2 * * *' for daily at 2am)
  last_checked_at TIMESTAMPTZ,
  next_check_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT integration_type_valid CHECK (
    integration_type IN (
      'supabase',
      'slack',
      'github',
      'vercel',
      'netlify',
      'aws',
      'google_workspace',
      'azure',
      'cloudflare',
      'website'
    )
  ),

  CONSTRAINT status_valid CHECK (
    status IN ('active', 'error', 'paused', 'disconnected')
  )
);

-- Indexes for performance
CREATE INDEX idx_integrations_organization ON public.integrations(organization_id);
CREATE INDEX idx_integrations_type ON public.integrations(integration_type);
CREATE INDEX idx_integrations_status ON public.integrations(status);
CREATE INDEX idx_integrations_next_check ON public.integrations(next_check_at)
  WHERE status = 'active';

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies (Row Level Security)
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Users can only see integrations for their organization
CREATE POLICY "Users can view their organization's integrations"
  ON public.integrations
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.user_organizations
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert integrations for their organization
CREATE POLICY "Users can create integrations for their organization"
  ON public.integrations
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM public.user_organizations
      WHERE user_id = auth.uid()
    )
  );

-- Users can update integrations for their organization
CREATE POLICY "Users can update their organization's integrations"
  ON public.integrations
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.user_organizations
      WHERE user_id = auth.uid()
    )
  );

-- Users can delete integrations for their organization
CREATE POLICY "Users can delete their organization's integrations"
  ON public.integrations
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.user_organizations
      WHERE user_id = auth.uid()
    )
  );

-- Comments for documentation
COMMENT ON TABLE public.integrations IS 'Stores OAuth connections and credentials for third-party services';
COMMENT ON COLUMN public.integrations.config IS 'JSONB field storing encrypted credentials (access_token, refresh_token, etc.) and integration metadata';
COMMENT ON COLUMN public.integrations.integration_type IS 'Type of integration: supabase, slack, github, etc.';
COMMENT ON COLUMN public.integrations.scan_schedule IS 'Cron expression for automated scanning schedule';
