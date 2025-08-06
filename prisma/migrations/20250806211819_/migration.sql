/*
  Warnings:

  - You are about to drop the column `type` on the `LineItem` table. All the data in the column will be lost.
  - Added the required column `rateType` to the `LineItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."RateType" AS ENUM ('Flat', 'CPM', 'CPC', 'CPA');

-- AlterTable
ALTER TABLE "public"."LineItem" DROP COLUMN "type",
ADD COLUMN     "rateType" "public"."RateType" NOT NULL;
