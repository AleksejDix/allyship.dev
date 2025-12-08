/**
 * Supabase client for accessing main AllyShip database
 *
 * This connects to the main AllyShip database where we store:
 * - organizations
 * - integrations (this table!)
 * - assessments
 * - controls
 * - frameworks
 * etc.
 */

import { createClient } from '@supabase/supabase-js'

/**
 * Get Supabase client for server-side operations
 * Uses service role key for full access
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Get Supabase client with user context (RLS enabled)
 * Uses anon key + user JWT
 */
export function getSupabaseClient(accessToken?: string) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables')
  }

  const client = createClient(supabaseUrl, supabaseAnonKey)

  // If access token provided, set user session
  if (accessToken) {
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: '' // Not needed for server-side
    })
  }

  return client
}

/**
 * Database types for TypeScript
 */
export interface Integration {
  id: string
  organization_id: string
  integration_type: 'supabase' | 'slack' | 'github' | 'vercel' | 'netlify' | 'aws' | 'google_workspace' | 'azure' | 'cloudflare' | 'website'
  name: string
  config: {
    // Encrypted credentials
    access_token?: string
    refresh_token?: string
    api_key?: string
    client_secret?: string

    // Integration metadata
    project_id?: string
    project_name?: string
    organization_id?: string
    workspace_id?: string

    // Token expiration
    expires_at?: string

    // Scan configuration
    scan_schedule?: string
    enabled_checks?: string[]

    // Additional config
    [key: string]: any
  }
  status: 'active' | 'error' | 'paused' | 'disconnected'
  error_message?: string | null
  scan_schedule?: string | null
  last_checked_at?: string | null
  next_check_at?: string | null
  created_at: string
  updated_at: string
}

export interface CreateIntegrationInput {
  organization_id: string
  integration_type: Integration['integration_type']
  name: string
  config: Integration['config']
  scan_schedule?: string
  status?: Integration['status']
}

export interface UpdateIntegrationInput {
  name?: string
  config?: Integration['config']
  status?: Integration['status']
  error_message?: string | null
  scan_schedule?: string
  last_checked_at?: string
  next_check_at?: string
}
