/*
  Warnings:

  - Changed the type of `rateType` on the `LineItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."LineItem" DROP COLUMN "rateType",
ADD COLUMN     "rateType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."RateType";
