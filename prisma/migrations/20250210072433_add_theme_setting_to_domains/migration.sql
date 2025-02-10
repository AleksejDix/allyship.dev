DO $$ BEGIN
    CREATE TYPE "DomainTheme" AS ENUM ('LIGHT', 'DARK', 'BOTH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add theme column to Domain table with default value
ALTER TABLE "Domain"
ADD COLUMN IF NOT EXISTS "theme" "DomainTheme" NOT NULL DEFAULT 'BOTH';