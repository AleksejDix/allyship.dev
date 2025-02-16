-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create the cron job for cleanup
SELECT cron.schedule(
    'cleanup-accounts',  -- job name
    '0 0 * * *',        -- daily at midnight
    $$
    select public.cleanup_disabled_accounts();
    $$
);

-- Create the cron job for notification processing
SELECT cron.schedule(
    'process-notifications',  -- job name
    '*/5 * * * *',          -- every 5 minutes
    $$
    select http_post(
        extensions.get_edge_function_url() || '/process-notifications',
        '{}',
        ARRAY[
            ('Authorization', 'Bearer ' || extensions.get_service_role_key())::http_header
        ]
    );
    $$
);
