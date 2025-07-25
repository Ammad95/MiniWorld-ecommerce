-- Orders and Order Items Table Setup for MiniWorld
-- Run this in your Supabase SQL Editor to create the orders system

-- Drop existing tables if they exist (careful in production!)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Create orders table with comprehensive schema
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_address TEXT,
  customer_city VARCHAR(100),
  customer_postal_code VARCHAR(20),
  customer_state VARCHAR(100),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'cash_on_delivery',
  payment_details JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table for order line items
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
-- Allow public to insert orders (for website checkout)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow public to read their own orders (if needed for order lookup)
CREATE POLICY "Anyone can read orders" ON orders
  FOR SELECT USING (true);

-- Allow authenticated users (admins) to update and delete
CREATE POLICY "Authenticated users can update orders" ON orders
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete orders" ON orders
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for order_items
-- Allow public to insert order items (for website checkout)
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Allow public to read order items
CREATE POLICY "Anyone can read order items" ON order_items
  FOR SELECT USING (true);

-- Allow authenticated users (admins) to update and delete
CREATE POLICY "Authenticated users can update order items" ON order_items
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete order items" ON order_items
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
INSERT INTO orders (
  id, order_number, customer_name, customer_email, customer_phone,
  customer_address, customer_city, customer_postal_code, customer_state,
  subtotal, tax, shipping, total_amount, payment_method, status,
  estimated_delivery, notes
) VALUES 
(
  'test_order_1',
  'MW17345678901',
  'Test Customer',
  'test@example.com',
  '+92-300-1234567',
  '123 Test Street, Test Area',
  'Karachi',
  '75500',
  'Sindh',
  1500.00,
  120.00,
  200.00,
  1820.00,
  'cash_on_delivery',
  'confirmed',
  NOW() + INTERVAL '5 days',
  'Cash on Delivery - Payment due upon delivery'
),
(
  'test_order_2', 
  'MW17345678902',
  'Another Customer',
  'customer@example.com',
  '+92-321-9876543',
  '456 Sample Road, Demo Colony',
  'Lahore',
  '54000',
  'Punjab',
  2500.00,
  200.00,
  250.00,
  2950.00,
  'bank_transfer',
  'pending',
  NOW() + INTERVAL '3 days',
  'Bank Transfer - Awaiting payment confirmation'
);

-- Insert sample order items
INSERT INTO order_items (
  order_id, product_id, product_name, quantity, unit_price, total_price
) VALUES 
('test_order_1', 'prod_1', 'Baby Bottle Set', 2, 750.00, 1500.00),
('test_order_2', 'prod_2', 'Stroller Premium', 1, 2500.00, 2500.00);

-- Grant necessary permissions (if needed)
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;
GRANT SELECT, INSERT ON orders TO anon;
GRANT SELECT, INSERT ON order_items TO anon;

-- Success message
SELECT 'Orders and Order Items tables created successfully!' AS status; 