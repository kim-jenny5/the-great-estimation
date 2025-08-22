  -- AlterTable
  ALTER TABLE "public"."LineItem" ALTER COLUMN "startDate" SET DATA TYPE TIMESTAMP(6),
  ALTER COLUMN "endDate" SET DATA TYPE TIMESTAMP(6);

  -- AlterTable
  ALTER TABLE "public"."Order" ALTER COLUMN "deliverableDueAt" SET DATA TYPE TIMESTAMP(6);
