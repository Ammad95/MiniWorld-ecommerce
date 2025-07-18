-- MiniWorld Database Schema Fix
-- Run this in your Supabase SQL Editor to fix all database issues

-- Drop and recreate orders table with correct schema
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_address TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure admin_users table exists
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(50),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  is_first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- Ensure products table exists
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure payment_accounts table exists
CREATE TABLE IF NOT EXISTS payment_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_details JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (in case they exist)
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON orders;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON order_items;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON payment_accounts;

-- Create RLS policies for orders (allow all operations for authenticated users)
CREATE POLICY "Enable all access for authenticated users" ON orders
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for order_items (allow all operations for authenticated users)
CREATE POLICY "Enable all access for authenticated users" ON order_items
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for admin_users
CREATE POLICY "Enable read access for authenticated users" ON admin_users
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable insert for authenticated users" ON admin_users
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" ON admin_users
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for products (public read, admin write)
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON products
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" ON products
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" ON products
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for payment_accounts (admin access)
CREATE POLICY "Enable all access for authenticated users" ON payment_accounts
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Insert sample admin user if not exists
INSERT INTO admin_users (email, password_hash, name, role, is_active, is_first_login) 
VALUES (
  'ammad_777@hotmail.com',
  '$2b$10$sample_hash_placeholder',
  'Admin User',
  'super_admin',
  true,
  false
) ON CONFLICT (email) DO UPDATE SET
  is_active = true,
  role = 'super_admin';

-- Insert sample products if not exists
INSERT INTO products (name, description, price, category, stock_quantity) VALUES 
('Baby Bottle', 'Premium baby feeding bottle', 29.99, 'feeding', 50),
('Diaper Pack', 'Soft and comfortable diapers', 19.99, 'hygiene', 30),
('Baby Toy', 'Safe educational toy', 15.99, 'toys', 40)
ON CONFLICT DO NOTHING;

-- Insert sample payment account if not exists
INSERT INTO payment_accounts (provider, account_name, account_details) VALUES 
('jazzcash', 'Main JazzCash Account', '{"merchant_id": "your_merchant_id", "password": "your_password", "return_url": "your_return_url"}')
ON CONFLICT DO NOTHING;

-- Insert sample orders for testing
INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total_amount, status, payment_method, payment_status) VALUES 
('John Doe', 'john@example.com', '+92-300-1234567', '123 Main St, Lahore', 49.98, 'completed', 'jazzcash', 'paid'),
('Jane Smith', 'jane@example.com', '+92-301-7654321', '456 Park Ave, Karachi', 29.99, 'pending', 'cod', 'pending'),
('Ahmad Ali', 'ahmad@example.com', '+92-302-1122334', '789 Garden Rd, Islamabad', 35.98, 'shipped', 'jazzcash', 'paid')
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Database schema fixed successfully! All tables and policies created.' as status; 