-- Ensure extension (for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Make reference data & rows idempotent-safe (optional but recommended)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Product_name_key') THEN
    ALTER TABLE "Product" ADD CONSTRAINT "Product_name_key" UNIQUE ("name");
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Order_creatorId_name_key') THEN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_creatorId_name_key" UNIQUE ("creatorId","name");
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LineItem_orderId_name_key') THEN
    ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_orderId_name_key" UNIQUE ("orderId","name");
  END IF;
END$$;

-- 1) CREATE Jenny (STRICT insert; will error if email already exists)
WITH jenny AS (
  INSERT INTO "User" ("id","name","email","createdAt","updatedAt")
  VALUES (gen_random_uuid(),'Jenny Kim','jennykimdev@gmail.com', now(), now())
  ON CONFLICT ("email") DO NOTHING
  RETURNING "id"
),

-- 2) Ensure Products (8) exist (idempotent)
ins_products AS (
  INSERT INTO "Product" ("id","name","createdAt","updatedAt") VALUES
    (gen_random_uuid(),'Newsletter',now(),now()),
    (gen_random_uuid(),'Sponsored Article',now(),now()),
    (gen_random_uuid(),'Display Ads',now(),now()),
    (gen_random_uuid(),'Social Media Post',now(),now()),
    (gen_random_uuid(),'Podcast Ad',now(),now()),
    (gen_random_uuid(),'Homepage Takeover',now(),now()),
    (gen_random_uuid(),'Branded Video',now(),now()),
    (gen_random_uuid(),'Event Sponsorship',now(),now())
  ON CONFLICT ("name") DO NOTHING
  RETURNING 1
),

-- 3) Define deterministic line items as a typed inline table
items AS (
  -- name,                 product_name,        start_tz,                 end_tz,                   rate_type, rate, quantity
  VALUES
    ('Back to School',     'Newsletter',        TIMESTAMPTZ '2025-08-01', NULL,                     'Flat',    100::numeric, 1),
    ('Labor Day',          'Newsletter',        TIMESTAMPTZ '2025-08-18', NULL,                     'Flat',    150::numeric, 1),
    ('Fall Fashion Feature','Sponsored Article',TIMESTAMPTZ '2025-08-25', TIMESTAMPTZ '2025-11-14', 'CPM',      75::numeric,10),
    ('Homepage Takeover',  'Display Ads',       TIMESTAMPTZ '2025-08-15', TIMESTAMPTZ '2025-08-17', 'Flat',    300::numeric, 1),
    ('Sidebar Ad',         'Display Ads',       TIMESTAMPTZ '2025-08-20', TIMESTAMPTZ '2025-08-31', 'Flat',    200::numeric, 1)
),

-- 4) CREATE Jenny's Order (unique on [creatorId,name])
ord AS (
  INSERT INTO "Order" (
    "id","name","creatorId","status",
    "totalBudget","totalSpend","productsCount","lineItemsCount",
    "deliverableDueAt","createdAt","updatedAt"
  )
  VALUES (
    gen_random_uuid(),
    'Nike – Back to School – Q3 2025',
    (SELECT "id" FROM jenny),
    'In progress',
    0::numeric, 0::numeric, 0, 0,
    (TIMESTAMPTZ '2025-08-18 00:00:00+00') AT TIME ZONE 'UTC',
    now(), now()
  )
  ON CONFLICT ("creatorId","name") DO NOTHING
  RETURNING "id"
),

-- 5) INSERT Line Items (single SELECT; no UNION). Cast tz → timestamp w/o tz to match Prisma @db.Timestamp(6)
ins_li AS (
  INSERT INTO "LineItem" (
    "id","orderId","productId","name","startDate","endDate",
    "rateType","rate","quantity","subtotal","createdAt","updatedAt"
  )
  SELECT
    gen_random_uuid(),
    (SELECT "id" FROM ord),
    p."id"                                   AS productId,
    i.column1                                AS name,
    (i.column3 AT TIME ZONE 'UTC')           AS startDate,       -- timestamptz -> timestamp
    CASE WHEN i.column4 IS NULL
         THEN NULL
         ELSE (i.column4 AT TIME ZONE 'UTC')
    END                                      AS endDate,
    i.column5                                AS rateType,
    i.column6                                AS rate,
    i.column7                                AS quantity,
    (i.column6 * i.column7)::numeric         AS subtotal,
    now(), now()
  FROM items i
  JOIN "Product" p
    ON p."name" = i.column2
  ON CONFLICT ("orderId","name") DO NOTHING
  RETURNING 1
),

-- 6) Recalculate totals & counts deterministically
sums AS (
  SELECT
    (SELECT "id" FROM ord) AS order_id,
    COALESCE(SUM("subtotal"),0)::numeric AS spend,
    COUNT(*) AS items,
    COUNT(DISTINCT "productId") AS products
  FROM "LineItem"
  WHERE "orderId" = (SELECT "id" FROM ord)
)
UPDATE "Order" o
SET "totalSpend"     = s.spend,
    "lineItemsCount" = s.items,
    "productsCount"  = s.products,
    "totalBudget"    = (CEIL(s.spend * 1.5 / 50.0) * 50)::numeric,
    "updatedAt"      = now()
FROM sums s
WHERE o."id" = s.order_id;
