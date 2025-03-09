-- Migration: Disable user logging functionality (minimal version)
-- Description: Replaces only the log_user_action function with a stub

-- Replace the log_user_action function with a stub that does nothing
CREATE OR REPLACE FUNCTION public.log_user_action(user_id uuid, action text, details jsonb DEFAULT NULL::jsonb, ip_address text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Do nothing, logging disabled
    -- This avoids errors with the missing user_audit_logs table
    RAISE NOTICE 'User action logging disabled: %', action;
END;
$$;
