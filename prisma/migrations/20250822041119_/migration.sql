-- Backfill line items for Jenny's Nike order, idempotently

-- Find Jenny and her order
WITH j AS (
  SELECT "id" AS user_id FROM "User" WHERE "email" = 'jennykimdev@gmail.com' LIMIT 1
),
ord AS (
  SELECT o."id" AS order_id
  FROM "Order" o
  JOIN j ON o."creatorId" = j.user_id
  WHERE o."name" = 'Nike – Back to School – Q3 2025'
  LIMIT 1
),

-- Typed inline items table
items(name, product_name, start_tz, end_tz, rate_type, rate, quantity) AS (
  VALUES
    ('Back to School',       'Newsletter',         TIMESTAMPTZ '2025-08-01', NULL,                     'Flat', 100::numeric, 1),
    ('Labor Day',            'Newsletter',         TIMESTAMPTZ '2025-08-18', NULL,                     'Flat', 150::numeric, 1),
    ('Fall Fashion Feature', 'Sponsored Article',  TIMESTAMPTZ '2025-08-25', TIMESTAMPTZ '2025-11-14', 'CPM',   75::numeric,10),
    ('Homepage Takeover',    'Display Ads',        TIMESTAMPTZ '2025-08-15', TIMESTAMPTZ '2025-08-17', 'Flat', 300::numeric, 1),
    ('Sidebar Ad',           'Display Ads',        TIMESTAMPTZ '2025-08-20', TIMESTAMPTZ '2025-08-31', 'Flat', 200::numeric, 1)
),

-- Insert any missing line items for that order
ins AS (
  INSERT INTO "LineItem" (
    "id","orderId","productId","name","startDate","endDate",
    "rateType","rate","quantity","subtotal","createdAt","updatedAt"
  )
  SELECT
    gen_random_uuid(),
    ord.order_id,
    p."id",
    i.name,
    (i.start_tz AT TIME ZONE 'UTC'),
    CASE WHEN i.end_tz IS NULL THEN NULL ELSE (i.end_tz AT TIME ZONE 'UTC') END,
    i.rate_type,
    i.rate,
    i.quantity,
    (i.rate * i.quantity)::numeric,
    now(), now()
  FROM items i
  CROSS JOIN ord
  JOIN "Product" p ON p."name" = i.product_name
  WHERE NOT EXISTS (
    SELECT 1 FROM "LineItem" li
    WHERE li."orderId" = ord.order_id AND li."name" = i.name
  )
  ON CONFLICT ("orderId","name") DO NOTHING
  RETURNING 1
)

-- Recompute totals for the order
UPDATE "Order" o
SET
  "totalSpend"     = s.spend,
  "lineItemsCount" = s.items,
  "productsCount"  = s.products,
  "totalBudget"    = (CEIL(s.spend * 1.5 / 50.0) * 50)::numeric,
  "updatedAt"      = now()
FROM (
  SELECT
    li."orderId" AS order_id,
    COALESCE(SUM(li."subtotal"),0)::numeric AS spend,
    COUNT(*) AS items,
    COUNT(DISTINCT li."productId") AS products
  FROM "LineItem" li
  WHERE li."orderId" = (SELECT order_id FROM ord)
  GROUP BY li."orderId"
) s
WHERE o."id" = s.order_id;
