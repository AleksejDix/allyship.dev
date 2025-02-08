-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "memberships" ADD COLUMN     "role" "MembershipRole" NOT NULL DEFAULT 'MEMBER';
