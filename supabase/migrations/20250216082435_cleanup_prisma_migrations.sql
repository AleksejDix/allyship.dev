-- Drop the Prisma migrations table if it exists
DROP TABLE IF EXISTS "_prisma_migrations";

-- Clean up any related sequences or dependencies that might have been created
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop any sequences that might have been created by Prisma
    FOR r IN (SELECT sequence_name
              FROM information_schema.sequences
              WHERE sequence_name LIKE '%prisma%')
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
END $$;
