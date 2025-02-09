/*
  Warnings:

  - You are about to drop the column `results` on the `Scan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Scan" DROP COLUMN "results",
ADD COLUMN     "metrics" JSONB;
