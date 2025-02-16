-- Create the extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS "pg_cron" SCHEMA extensions CASCADE;
CREATE EXTENSION IF NOT EXISTS "http" SCHEMA extensions CASCADE;

-- Grant usage on the extensions schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Set up the search path
ALTER DATABASE postgres SET search_path TO public, extensions;

-- Create a function to get the service role key
CREATE OR REPLACE FUNCTION extensions.get_service_role_key()
RETURNS text
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT current_setting('supabase_auth.jwt_secret', true);
$$;

-- Create a function to get the edge function URL
CREATE OR REPLACE FUNCTION extensions.get_edge_function_url()
RETURNS text
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT 'http://localhost:54321/functions/v1';
$$;
