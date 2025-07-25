-- EMERGENCY PRODUCT FIX - RUN THIS NOW
-- Copy and paste this ENTIRE script into Supabase SQL Editor

-- 1. Drop and recreate products table
DROP TABLE IF EXISTS products CASCADE;

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

-- 2. Fix permissions (CRITICAL)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
GRANT ALL ON products TO authenticated;
GRANT ALL ON products TO anon;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Create permissive policies
CREATE POLICY \
Allow
all
for
authenticated\ ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY \Allow
read
for
anon\ ON products FOR SELECT TO anon USING (true);

-- 4. Test insert
INSERT INTO products (name, price, category, description, stock_quantity) 
VALUES ('Emergency Test Product', 29.99, 'newborn-essentials', 'Test product', 10);

-- 5. Verify
SELECT 'SUCCESS: Products table ready!' as status, COUNT(*) as products FROM products;
