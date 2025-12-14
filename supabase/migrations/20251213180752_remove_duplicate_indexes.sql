-- Remove duplicate and redundant indexes to clean up schema
-- Identified via pg_stat_user_indexes analysis

-- ============================================================================
-- Page table: Remove duplicate normalized_url constraint
-- ============================================================================
-- Keeping: idx_page_website_normalized_url (has WHERE clause for NULL handling)
-- Removing: page_normalized_url_website_unique (UNIQUE constraint, duplicate)
ALTER TABLE public."Page" DROP CONSTRAINT IF EXISTS page_normalized_url_website_unique;

-- ============================================================================
-- Website table: Remove duplicate space/url index
-- ============================================================================
-- Keeping: Domain_space_id_name_key (space_id, url)
-- Removing: idx_website_url_space (reversed column order, less useful)
DROP INDEX IF EXISTS public.idx_website_url_space;

-- ============================================================================
-- controls table: Remove redundant index on primary key
-- ============================================================================
-- The 'id' column is already the primary key with automatic index
DROP INDEX IF EXISTS public.idx_controls_id;

-- Note: All removed indexes had 0 usage according to pg_stat_user_indexes
-- Total space saved: ~120 KB
