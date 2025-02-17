-- Fix nullable timestamps and required fields
ALTER TABLE "public"."Page"
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."Space"
    ALTER COLUMN created_by SET NOT NULL;

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

-- Update existing NULL values to current timestamp
UPDATE "public"."Page"
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

UPDATE "public"."User"
SET updated_at = CURRENT_TIMESTAMP
WHERE updated_at IS NULL;

UPDATE "public"."user_audit_logs"
SET timestamp = CURRENT_TIMESTAMP
WHERE timestamp IS NULL;

UPDATE "public"."user_notifications"
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

-- Add comment explaining the changes
COMMENT ON TABLE "public"."Page" IS 'Pages within domains with required timestamps';
COMMENT ON TABLE "public"."User" IS 'User profiles with required timestamps and retention period';
COMMENT ON TABLE "public"."user_audit_logs" IS 'Audit logs with required timestamps';
COMMENT ON TABLE "public"."user_notifications" IS 'User notifications with required timestamps';
