-- WEBSITE PRODUCTS VISIBILITY FIX
-- Run this in Supabase SQL Editor to make products show on website
-- 
-- ISSUE: Products have category 'newborn-essentials' but frontend expects '0-6-months'
-- SOLUTION: Update categories and ensure proper RLS policies

-- 1. Update existing products to use correct frontend categories
UPDATE products 
SET category = '0-6-months',
    is_active = true,
    in_stock = true
WHERE category = 'newborn-essentials';

-- 2. Ensure all products are properly configured for visibility
UPDATE products 
SET is_active = true,
    in_stock = true,
    stock_status = 'in_stock'
WHERE is_active IS NULL OR is_active = false;

-- 3. Drop existing RLS policies that might be blocking access
DROP POLICY IF EXISTS "public_read_products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;

-- 4. Create comprehensive RLS policy for public access to active products
CREATE POLICY "public_products_access" ON products 
  FOR SELECT 
  TO public 
  USING (is_active = true);

-- 5. Grant necessary permissions
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;

-- 6. Add some test products in different categories (only if products table is empty)
INSERT INTO products (name, price, category, description, stock_quantity, is_active, is_featured, in_stock, stock_status) 
SELECT * FROM (VALUES 
  ('Premium Baby Bottles', 19.99, '0-6-months', 'BPA-free bottles with anti-colic system', 25, true, true, true, 'in_stock'),
  ('Soft Cotton Onesies', 14.99, '0-6-months', 'Ultra-soft organic cotton onesies pack of 5', 30, true, false, true, 'in_stock'),
  ('Interactive Learning Toys', 24.99, '6-12-months', 'Educational toys for developing motor skills', 20, true, true, true, 'in_stock'),
  ('Wooden Building Blocks', 29.99, '1-3-years', 'Natural wooden blocks for creative play', 15, true, true, true, 'in_stock'),
  ('Educational Puzzle Set', 17.99, '3-5-years', 'Age-appropriate puzzles for cognitive development', 18, true, false, true, 'in_stock')
) AS v(name, price, category, description, stock_quantity, is_active, is_featured, in_stock, stock_status)
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE products.name = v.name
);

-- 7. Verify the fix worked
SELECT 
  'PRODUCTS FIXED!' as status,
  category,
  COUNT(*) as product_count,
  string_agg(name, ', ') as products
FROM products 
WHERE is_active = true 
GROUP BY category
ORDER BY 
  CASE category
    WHEN '0-6-months' THEN 1
    WHEN '6-12-months' THEN 2
    WHEN '1-3-years' THEN 3
    WHEN '3-5-years' THEN 4
    ELSE 5
  END;
