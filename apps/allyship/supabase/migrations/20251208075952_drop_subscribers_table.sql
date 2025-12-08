-- Drop subscribers table
-- This table was created for Stripe billing but never implemented
-- Email subscriptions are handled via Resend API directly

-- Drop policies
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."subscribers";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."subscribers";
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON "public"."subscribers";

-- Drop triggers
DROP TRIGGER IF EXISTS "set_updated_at" ON "public"."subscribers";

-- Drop the table (CASCADE will handle constraints and indexes)
DROP TABLE IF EXISTS "public"."subscribers" CASCADE;
