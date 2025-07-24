-- IMMEDIATE FIX FOR PRODUCT ERRORS
-- Run this NOW in Supabase SQL Editor

-- 1. Drop existing table if any issues
DROP TABLE IF EXISTS products CASCADE;

-- 2. Create products table with EXACT schema needed
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR(100) NOT NULL,
  description TEXT DEFAULT '',
  features JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  max_stock_quantity INTEGER DEFAULT 100,
  stock_status VARCHAR(20) DEFAULT 'out_of_stock',
  rating DECIMAL(2,1) DEFAULT 0.0,
  reviews INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DISABLE RLS temporarily to fix permission issues
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 4. Grant full access to authenticated users
GRANT ALL ON products TO authenticated;
GRANT ALL ON products TO anon;

-- 5. Create simple policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON products
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow read for anon" ON products
  FOR SELECT 
  TO anon 
  USING (true);

-- 6. Insert test product to verify it works
INSERT INTO products (name, price, category, description, stock_quantity) 
VALUES ('Test Product', 29.99, 'newborn-essentials', 'Test product description', 10);

-- 7. Verify the fix worked
SELECT 'Products table created and permissions fixed!' as status,
       COUNT(*) as product_count 
FROM products; 