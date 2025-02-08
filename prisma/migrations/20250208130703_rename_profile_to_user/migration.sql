/*
  Warnings:

  - You are about to drop the column `profile_id` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `scans` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `spaces` table. All the data in the column will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[space_id,user_id]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `scans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `spaces` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "scans" DROP CONSTRAINT "scans_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "spaces" DROP CONSTRAINT "spaces_profile_id_fkey";

-- DropIndex
DROP INDEX "memberships_space_id_profile_id_key";

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "profile_id",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "scans" DROP COLUMN "profile_id",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "spaces" DROP COLUMN "profile_id",
ADD COLUMN     "user_id" UUID NOT NULL;

-- DropTable
DROP TABLE "profiles";

-- CreateTable
CREATE TABLE "users" (
    "first_name" TEXT,
    "last_name" TEXT,
    "id" UUID NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "memberships_space_id_user_id_key" ON "memberships"("space_id", "user_id");

-- AddForeignKey
ALTER TABLE "scans" ADD CONSTRAINT "scans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
