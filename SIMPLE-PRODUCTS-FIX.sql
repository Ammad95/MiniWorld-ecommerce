-- SIMPLE PRODUCTS VISIBILITY FIX
-- Run this in Supabase SQL Editor

-- 1. Update existing products from 'newborn-essentials' to '0-6-months'
UPDATE products 
SET category = '0-6-months',
    is_active = true,
    in_stock = true
WHERE category = 'newborn-essentials';

-- 2. Make sure all products are active and visible
UPDATE products 
SET is_active = true,
    in_stock = true,
    stock_status = 'in_stock'
WHERE is_active IS NULL OR is_active = false;

-- 3. Drop any conflicting RLS policies
DROP POLICY IF EXISTS \
public_read_products\ ON products;
DROP POLICY IF EXISTS \Products
are
viewable
by
everyone\ ON products;
DROP POLICY IF EXISTS \Enable
read
access
for
all
users\ ON products;

-- 4. Create new RLS policy for public access
CREATE POLICY \public_products_access\ ON products 
  FOR SELECT 
  TO public 
  USING (is_active = true);

-- 5. Grant permissions
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;

-- 6. Check the results
SELECT 
  category,
  COUNT(*) as count,
  string_agg(name, ', ') as product_names
FROM products 
WHERE is_active = true 
GROUP BY category;
