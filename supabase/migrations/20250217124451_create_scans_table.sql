-- Create scans table
CREATE TABLE IF NOT EXISTS "public"."Scan" (
    "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "page_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "url" text NOT NULL,
    "status" "public"."ScanStatus" NOT NULL DEFAULT 'pending',
    "metrics" jsonb,
    "screenshot_light" text,
    "screenshot_dark" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "deleted_at" timestamp with time zone,
    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Scan_page_id_fkey" FOREIGN KEY ("page_id")
        REFERENCES "public"."Page"("id") ON DELETE CASCADE,
    CONSTRAINT "Scan_user_id_fkey" FOREIGN KEY ("user_id")
        REFERENCES "auth"."users"("id")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_scans_page_id" ON "public"."Scan" USING btree ("page_id");
CREATE INDEX IF NOT EXISTS "idx_scans_user_id" ON "public"."Scan" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "idx_scans_status" ON "public"."Scan" USING btree ("status");

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

CREATE POLICY "Users can update scans for pages in their spaces"
    ON "public"."Scan"
    FOR UPDATE
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

CREATE POLICY "Users can delete scans for pages in their spaces"
    ON "public"."Scan"
    FOR DELETE
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

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON "public"."Scan"
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON TABLE public."Scan" TO authenticated, service_role;
GRANT SELECT ON TABLE public."Scan" TO anon;
