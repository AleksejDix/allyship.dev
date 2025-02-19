-- Create scans table
CREATE TABLE IF NOT EXISTS "public"."Scan" (
    "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "page_id" uuid NOT NULL,
    "status" "public"."ScanStatus" NOT NULL DEFAULT 'pending',
    "metrics" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "screenshot_light" text,
    "screenshot_dark" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Scan_page_id_fkey" FOREIGN KEY ("page_id")
        REFERENCES "public"."Page"("id") ON DELETE CASCADE
);

-- Optimized indexes
CREATE INDEX IF NOT EXISTS "idx_scans_page_status" ON "public"."Scan" ("page_id", "status");
CREATE INDEX IF NOT EXISTS "idx_scans_created_at" ON "public"."Scan" USING brin ("created_at");

-- Enable Row Level Security
ALTER TABLE "public"."Scan" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view scans for pages in their spaces"
    ON "public"."Scan"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."Page" p
            JOIN "public"."Website" w ON p.website_id = w.id
            JOIN "public"."Space" s ON w.space_id = s.id
            WHERE p.id = "Scan".page_id
            AND s.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create scans for pages in their spaces"
    ON "public"."Scan"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "public"."Page" p
            JOIN "public"."Website" w ON p.website_id = w.id
            JOIN "public"."Space" s ON w.space_id = s.id
            WHERE p.id = page_id
            AND s.owner_id = auth.uid()
        )
    );

-- Grant permissions
GRANT ALL ON TABLE public."Scan" TO authenticated, service_role;
GRANT SELECT ON TABLE public."Scan" TO anon;
