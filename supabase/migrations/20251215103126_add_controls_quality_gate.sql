-- Add quality gate column to controls table
-- This allows marking controls that are production-ready and quality-approved

ALTER TABLE public.controls
ADD COLUMN is_production_ready BOOLEAN DEFAULT FALSE NOT NULL;

-- Add index for filtering production-ready controls
CREATE INDEX idx_controls_production_ready ON public.controls(is_production_ready);

-- Add comment explaining the column
COMMENT ON COLUMN public.controls.is_production_ready IS 'Indicates if control has been reviewed and approved for production use with unique atomic name';
