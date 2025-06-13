-- Create scan scheduling table
CREATE TABLE IF NOT EXISTS "public"."ScanSchedule" (
    "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "page_id" uuid NOT NULL,
    "frequency" text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'disabled')),
    "next_scan_at" timestamp with time zone,
    "last_scan_at" timestamp with time zone,
    "is_active" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "ScanSchedule_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ScanSchedule_page_id_key" UNIQUE ("page_id"),
    CONSTRAINT "ScanSchedule_page_id_fkey" FOREIGN KEY ("page_id")
        REFERENCES "public"."Page"("id") ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scan_schedule_page_id ON "public"."ScanSchedule" USING btree ("page_id");
CREATE INDEX IF NOT EXISTS idx_scan_schedule_next_scan ON "public"."ScanSchedule" USING btree ("next_scan_at") WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_scan_schedule_frequency ON "public"."ScanSchedule" USING btree ("frequency") WHERE is_active = true;

-- Enable Row-Level Security (RLS)
ALTER TABLE "public"."ScanSchedule" ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Only Space Owners can manage Scan Schedules)
CREATE POLICY "Space owners can view scan schedules"
    ON "public"."ScanSchedule"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."Page" p
            JOIN "public"."Website" w ON p.website_id = w.id
            JOIN "public"."Space" s ON w.space_id = s.id
            WHERE p.id = "ScanSchedule".page_id
            AND s.owner_id = auth.uid()
        )
    );

CREATE POLICY "Space owners can insert scan schedules"
    ON "public"."ScanSchedule"
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

CREATE POLICY "Space owners can update scan schedules"
    ON "public"."ScanSchedule"
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."Page" p
            JOIN "public"."Website" w ON p.website_id = w.id
            JOIN "public"."Space" s ON w.space_id = s.id
            WHERE p.id = "ScanSchedule".page_id
            AND s.owner_id = auth.uid()
        )
    );

CREATE POLICY "Space owners can delete scan schedules"
    ON "public"."ScanSchedule"
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."Page" p
            JOIN "public"."Website" w ON p.website_id = w.id
            JOIN "public"."Space" s ON w.space_id = s.id
            WHERE p.id = "ScanSchedule".page_id
            AND s.owner_id = auth.uid()
        )
    );

-- Function to calculate next scan time based on frequency
CREATE OR REPLACE FUNCTION calculate_next_scan_time(frequency_val text, base_time timestamp with time zone DEFAULT now())
RETURNS timestamp with time zone AS $$
BEGIN
    CASE frequency_val
        WHEN 'daily' THEN
            RETURN base_time + interval '1 day';
        WHEN 'weekly' THEN
            RETURN base_time + interval '1 week';
        WHEN 'biweekly' THEN
            RETURN base_time + interval '2 weeks';
        WHEN 'monthly' THEN
            RETURN base_time + interval '1 month';
        WHEN 'disabled' THEN
            RETURN NULL;
        ELSE
            RETURN NULL;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set next_scan_at when frequency changes
CREATE OR REPLACE FUNCTION update_next_scan_time()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.frequency != OLD.frequency OR NEW.frequency IS DISTINCT FROM OLD.frequency THEN
        NEW.next_scan_at = calculate_next_scan_time(NEW.frequency);
    END IF;
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_next_scan_time
    BEFORE UPDATE ON "public"."ScanSchedule"
    FOR EACH ROW
    EXECUTE FUNCTION update_next_scan_time();

-- Trigger to set updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON "public"."ScanSchedule"
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public."ScanSchedule" TO authenticated, service_role;
GRANT SELECT ON public."ScanSchedule" TO anon;
