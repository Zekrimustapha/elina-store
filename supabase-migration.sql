-- =============================================================
-- ELINA COLLECTIONS — Production Fix Migration
-- Run this in the Supabase SQL Editor (safe, idempotent).
-- Fixes:
--   (A) create_order_if_allowed now STORES the real per-order
--       product/shipping/total prices passed by the API
--       (root cause of the fixed "4500" total).
--   (B) Adds the new call-center statuses to the check constraint
--       while KEEPING legacy statuses valid for historical orders.
-- Does NOT touch/rewrite existing order rows.
-- =============================================================

-- 1) STATUS CONSTRAINT ----------------------------------------
-- Allow the new active statuses (NoAnswer1/2/3) plus keep the
-- legacy ones (Processing/Shipped/Delivered) so old orders remain readable.
ALTER TABLE orders DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE orders ADD CONSTRAINT valid_status CHECK (
  status IN (
    'New',
    'Confirmed',
    'NoAnswer1',
    'NoAnswer2',
    'NoAnswer3',
    'Cancelled',
    -- legacy values kept ONLY for historical compatibility:
    'Processing',
    'Shipped',
    'Delivered'
  )
);

-- 2) SHIPPING CONSTRAINT --------------------------------------
-- The app supports 600 (standard) and 1100 (remote). Keep as-is,
-- but make it tolerant in case future wilaya tiers are added.
-- (Left unchanged intentionally — only re-assert to be safe.)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS valid_shipping_price;
ALTER TABLE orders ADD CONSTRAINT valid_shipping_price CHECK (shipping_price IN (600, 1100));

-- 3) ORDER CREATION FUNCTION (real prices stored) -------------
-- Replaces any previously-deployed version. The API passes the
-- server-computed prices; the DB stores exactly those values.
CREATE OR REPLACE FUNCTION create_order_if_allowed(
  p_full_name       TEXT,
  p_phone_number    TEXT,
  p_normalized_phone TEXT,
  p_wilaya          TEXT,
  p_commune         TEXT,
  p_address         TEXT,
  p_size            TEXT,
  p_product_name    TEXT,
  p_product_price   INTEGER,
  p_shipping_price  INTEGER,
  p_total_price     INTEGER,
  p_notes           TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_existing_order_id UUID;
  v_new_order_id UUID;
BEGIN
  -- Serialize concurrent submissions for the same phone number
  PERFORM pg_advisory_xact_lock(hashtext(p_normalized_phone));

  -- 24-hour duplicate protection (ignores cancelled orders)
  SELECT id INTO v_existing_order_id
  FROM orders
  WHERE normalized_phone = p_normalized_phone
    AND created_at > NOW() - INTERVAL '24 hours'
    AND status != 'Cancelled'
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_existing_order_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'is_duplicate', true,
      'message', 'Order already exists within 24 hours'
    );
  END IF;

  INSERT INTO orders (
    full_name, phone_number, normalized_phone, wilaya, commune, address,
    size, product_name, product_price, shipping_price, total_price, notes, status
  ) VALUES (
    p_full_name, p_phone_number, p_normalized_phone, p_wilaya, p_commune, p_address,
    p_size, p_product_name, p_product_price, p_shipping_price, p_total_price, p_notes, 'New'
  )
  RETURNING id INTO v_new_order_id;

  RETURN jsonb_build_object(
    'success', true,
    'is_duplicate', false,
    'order_id', v_new_order_id,
    'total_price', p_total_price,
    'message', 'Order created successfully'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION create_order_if_allowed TO service_role;

-- =============================================================
-- OPTIONAL (do NOT run blindly) — historical total backfill.
-- Only run if you accept recomputing shipping from the stored
-- wilaya using the app's remote-wilaya list. Review before use.
-- =============================================================
-- UPDATE orders o
-- SET shipping_price = CASE
--       WHEN split_part(o.wilaya, ' - ', 1) IN
--         ('01','03','07','11','30','33','32','39','37','45','47','49','50','51','52','53','54','55','56','57','58')
--       THEN 1100 ELSE 600 END,
--     total_price = o.product_price + CASE
--       WHEN split_part(o.wilaya, ' - ', 1) IN
--         ('01','03','07','11','30','33','32','39','37','45','47','49','50','51','52','53','54','55','56','57','58')
--       THEN 1100 ELSE 600 END
-- WHERE o.total_price = 4500;  -- only touch the wrongly-fixed rows
