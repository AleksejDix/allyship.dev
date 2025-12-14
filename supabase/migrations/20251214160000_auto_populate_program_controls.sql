-- Migration: Auto-populate program_controls on program creation
-- Description: Automatically creates program_controls entries when a new program is created,
--              based on the framework_controls mapping for that framework

-- Step 1: Create the trigger function
-- This function finds all controls associated with the framework and creates program_controls entries
CREATE OR REPLACE FUNCTION public.auto_populate_program_controls()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert program_controls for each control associated with the framework
  INSERT INTO public.program_controls (program_id, control_id)
  SELECT
    NEW.id,           -- The newly created program's ID
    fc.control_id     -- Each control associated with this framework
  FROM public.framework_controls fc
  WHERE fc.framework_id = NEW.framework_id;

  RETURN NEW;
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION public.auto_populate_program_controls IS
  'Trigger function that automatically populates program_controls when a program is created. Creates one program_control entry for each control mapped to the program''s framework.';

-- Step 2: Create the trigger
-- Fire AFTER INSERT to ensure the program exists before creating related records
DROP TRIGGER IF EXISTS trigger_auto_populate_program_controls ON public.programs;

CREATE TRIGGER trigger_auto_populate_program_controls
  AFTER INSERT ON public.programs
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_populate_program_controls();

-- Add comment for trigger
COMMENT ON TRIGGER trigger_auto_populate_program_controls ON public.programs IS
  'Automatically populates program_controls table when a new program is created';
