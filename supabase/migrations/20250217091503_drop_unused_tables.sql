-- Drop the view first since it depends on the User table
drop view if exists public."UserSpaceView";

-- Drop any foreign key constraints that reference the User table
alter table if exists public.memberships
  drop constraint if exists memberships_user_id_fkey;

-- Now we can safely drop the User table
drop table if exists public."User";
