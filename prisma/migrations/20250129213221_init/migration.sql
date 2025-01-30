/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BillingEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `memberships` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BillingEvent" DROP CONSTRAINT "BillingEvent_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_invitedBy_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_userId_fkey";

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscriptionId";

-- DropTable
DROP TABLE "BillingEvent";

-- DropTable
DROP TABLE "Invitation";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "memberships";

-- DropEnum
DROP TYPE "BillingEventType";

-- DropEnum
DROP TYPE "InviteStatus";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
