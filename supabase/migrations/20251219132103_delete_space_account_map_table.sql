-- Drop the space_account_map table as it's no longer used
-- This table was only for migration from legacy Space system to basejump accounts
-- Migration is complete - no rows exist and no references remain

DROP TABLE IF EXISTS space_account_map;