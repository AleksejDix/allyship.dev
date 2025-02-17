-- Create pages table (without scan-related fields)
CREATE TABLE IF NOT EXISTS "public"."Page" (
    "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "url" text NOT NULL,
    "website_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "deleted_at" timestamp with time zone,
    CONSTRAINT "Page_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Page_website_id_url_key" UNIQUE ("website_id", "url"),
    CONSTRAINT "Page_website_id_fkey" FOREIGN KEY ("website_id")
        REFERENCES "public"."Website"("id") ON DELETE CASCADE
);

-- Create necessary indexes for performance
CREATE INDEX IF NOT EXISTS idx_pages_website_id ON "public"."Page" USING btree ("website_id");
CREATE INDEX IF NOT EXISTS idx_pages_url ON "public"."Page" USING btree ("url");

-- Enable Row-Level Security (RLS)
ALTER TABLE "public"."Page" ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Only Space Owners can manage Pages)
CREATE POLICY "Space owners can view pages"
    ON "public"."Page"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."Website" w
            JOIN "public"."Space" s ON w.space_id = s.id
            WHERE w.id = "Page".website_id
            AND s.owner_id = auth.uid()
        )
    );

CREATE POLICY "Space owners can insert pages"
    ON "public"."Page"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "public"."Website" w
            JOIN "public"."Space" s ON w.space_id = s.id
            WHERE w.id = website_id
            AND s.owner_id = auth.uid()
        )
    );

CREATE POLICY "Space owners can update pages"
    ON "public"."Page"
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."Website" w
            JOIN "public"."Space" s ON w.space_id = s.id
            WHERE w.id = "Page".website_id
            AND s.owner_id = auth.uid()
        )
    );

CREATE POLICY "Space owners can delete pages"
    ON "public"."Page"
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."Website" w
            JOIN "public"."Space" s ON w.space_id = s.id
            WHERE w.id = "Page".website_id
            AND s.owner_id = auth.uid()
        )
    );

-- Ensure updated_at is always refreshed on updates
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON "public"."Page"
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Restrict permissions (More Secure)
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Page" TO authenticated, service_role;
GRANT SELECT ON public."Page" TO anon;
