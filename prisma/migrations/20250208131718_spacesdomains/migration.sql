/*
  Warnings:

  - Added the required column `page_id` to the `scans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scans" ADD COLUMN     "page_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "domains" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "space_id" UUID NOT NULL,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "domain_id" UUID NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "domains_name_idx" ON "domains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "domains_space_id_name_key" ON "domains"("space_id", "name");

-- CreateIndex
CREATE INDEX "pages_name_idx" ON "pages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pages_domain_id_name_key" ON "pages"("domain_id", "name");

-- AddForeignKey
ALTER TABLE "scans" ADD CONSTRAINT "scans_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;
