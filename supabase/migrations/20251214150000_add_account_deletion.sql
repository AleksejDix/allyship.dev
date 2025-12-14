-- Migration: Add account deletion support
-- Description: Adds RLS policy and function for deleting accounts with proper cascading

-- Step 1: Update Website foreign key to CASCADE on delete
-- This ensures websites are deleted when their account is deleted
ALTER TABLE public."Website"
  DROP CONSTRAINT IF EXISTS fk_website_account_id;

ALTER TABLE public."Website"
  ADD CONSTRAINT fk_website_account_id
  FOREIGN KEY (account_id)
  REFERENCES basejump.accounts(id)
  ON DELETE CASCADE;

-- Step 2: Add DELETE policy for accounts table
-- Only account owners can delete accounts
CREATE POLICY "Accounts can be deleted by owners"
  ON basejump.accounts
  FOR DELETE
  TO authenticated
  USING (basejump.has_role_on_account(id, 'owner'::basejump.account_role) = true);

-- Step 3: Create delete_account function
-- This function provides a clean API for account deletion
CREATE OR REPLACE FUNCTION public.delete_account(account_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
BEGIN
  -- Check if user has permission (will be enforced by RLS but good to be explicit)
  IF NOT basejump.has_role_on_account(account_id, 'owner'::basejump.account_role) THEN
    RAISE EXCEPTION 'Only account owners can delete accounts';
  END IF;

  -- Check if this is a personal account (should not be deleted)
  IF EXISTS (
    SELECT 1 FROM basejump.accounts
    WHERE id = account_id
    AND personal_account = true
  ) THEN
    RAISE EXCEPTION 'Personal accounts cannot be deleted';
  END IF;

  -- Delete the account (cascades will handle related records)
  DELETE FROM basejump.accounts WHERE id = account_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_account(uuid) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.delete_account IS 'Deletes a team account and all associated data. Personal accounts cannot be deleted.';
