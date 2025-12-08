-- Remove all crawler functionality
-- The crawler doesn't work, so we're removing it entirely
-- Keeping only the browsercat-based scan function

-- Drop RPC functions first (they reference tables)
DROP FUNCTION IF EXISTS public.update_crawl_progress(uuid, text, text, integer, integer);
DROP FUNCTION IF EXISTS public.update_crawl_progress_failed(uuid, text, text);
DROP FUNCTION IF EXISTS public.queue_crawl_url(uuid, text, integer, integer);
DROP FUNCTION IF EXISTS public.check_crawl_job_completion(uuid);
DROP FUNCTION IF EXISTS public.pgmq_read(text, integer, integer);
DROP FUNCTION IF EXISTS public.pgmq_delete(text, bigint);

-- Drop tables
DROP TABLE IF EXISTS public."CrawlUrlTracker" CASCADE;
DROP TABLE IF EXISTS public."CrawlJob" CASCADE;

-- Drop pgmq schema if it exists (queue system for crawler)
DROP SCHEMA IF EXISTS pgmq CASCADE;
