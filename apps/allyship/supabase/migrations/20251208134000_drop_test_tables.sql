-- Drop test tables from AllyStudio extension
-- These tables will be replaced by the new multi-framework compliance system
-- (organizations → assessments → violations structure)

-- Drop tables in correct order (respecting foreign key dependencies)
DROP TABLE IF EXISTS public.test_element_results CASCADE;
DROP TABLE IF EXISTS public.test_results CASCADE;
DROP TABLE IF EXISTS public.test_summaries CASCADE;
DROP TABLE IF EXISTS public.test_executions CASCADE;
