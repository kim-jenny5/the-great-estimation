-- Recompute totals for every order from live line items
WITH sums AS (
  SELECT
    li."orderId"                         AS order_id,
    COALESCE(SUM(li."subtotal"), 0)::numeric AS spend,
    COUNT(*)                             AS items,
    COUNT(DISTINCT li."productId")       AS products
  FROM "public"."LineItem" li
  GROUP BY li."orderId"
)
UPDATE "public"."Order" o
SET
  "totalSpend"     = s.spend,
  "lineItemsCount" = s.items,
  "productsCount"  = s.products,
  "totalBudget"    = (CEIL(s.spend * 1.5 / 50.0) * 50)::numeric,
  "updatedAt"      = now()
FROM sums s
WHERE o."id" = s.order_id;
