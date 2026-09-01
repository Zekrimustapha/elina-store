-- =============================================
-- ELINA COLLECTIONS - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor
-- =============================================

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  normalized_phone TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  commune TEXT NOT NULL,
  address TEXT NOT NULL,
  size TEXT NOT NULL,
  product_name TEXT NOT NULL DEFAULT 'Ensemble Elegance - Collection 2026',
  product_price INTEGER NOT NULL DEFAULT 3400,
  shipping_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  notes TEXT DEFAULT '',
  
  -- Constraints
  CONSTRAINT valid_product_price CHECK (product_price = 3400),
  CONSTRAINT valid_shipping_price CHECK (shipping_price IN (600, 1100)),
  CONSTRAINT valid_total_price CHECK (total_price = product_price + shipping_price),
  CONSTRAINT valid_status CHECK (status IN ('New', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'))
);

-- 2. Create index on normalized_phone for fast 24-hour duplicate lookups
CREATE INDEX IF NOT EXISTS idx_orders_normalized_phone_created 
ON orders (normalized_phone, created_at DESC);

-- 3. Create index on status for order management queries
CREATE INDEX IF NOT EXISTS idx_orders_status 
ON orders (status);

-- 4. Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_orders_created_at 
ON orders (created_at DESC);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 6. DENY ALL access for anonymous users
DROP POLICY IF EXISTS "Deny all for anon" ON orders;

-- 7. Create the atomic order creation function
CREATE OR REPLACE FUNCTION create_order_if_allowed(
  p_full_name TEXT,
  p_phone_number TEXT,
  p_normalized_phone TEXT,
  p_wilaya TEXT,
  p_commune TEXT,
  p_address TEXT,
  p_size TEXT,
  p_product_name TEXT,
  p_product_price INTEGER,
  p_shipping_price INTEGER,
  p_total_price INTEGER,
  p_notes TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_existing_order_id UUID;
  v_new_order_id UUID;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_normalized_phone));
  
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
    full_name,
    phone_number,
    normalized_phone,
    wilaya,
    commune,
    address,
    size,
    product_name,
    product_price,
    shipping_price,
    total_price,
    notes,
    status
  ) VALUES (
    p_full_name,
    p_phone_number,
    p_normalized_phone,
    p_wilaya,
    p_commune,
    p_address,
    p_size,
    p_product_name,
    p_product_price,
    p_shipping_price,
    p_total_price,
    p_notes,
    'New'
  )
  RETURNING id INTO v_new_order_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'is_duplicate', false,
    'order_id', v_new_order_id,
    'message', 'Order created successfully'
  );
END;
$$;

-- 8. Grant execute permission on the function to the service role
GRANT EXECUTE ON FUNCTION create_order_if_allowed TO service_role;