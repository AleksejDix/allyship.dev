-- Update existing NULL values first
UPDATE "public"."Page"
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

UPDATE "public"."User"
SET updated_at = CURRENT_TIMESTAMP,
    data_retention_period = '6 mons'::interval
WHERE updated_at IS NULL OR data_retention_period IS NULL;

UPDATE "public"."user_audit_logs"
SET timestamp = CURRENT_TIMESTAMP
WHERE timestamp IS NULL;

UPDATE "public"."user_notifications"
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

-- Now make the columns non-nullable
ALTER TABLE "public"."Page"
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."User"
    ALTER COLUMN data_retention_period SET NOT NULL,
    ALTER COLUMN data_retention_period SET DEFAULT '6 mons'::interval,
    ALTER COLUMN updated_at SET NOT NULL,
    ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."user_audit_logs"
    ALTER COLUMN timestamp SET NOT NULL,
    ALTER COLUMN timestamp SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."user_notifications"
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
