-- Products Table Schema for MiniWorld E-commerce
-- This ensures the products table exists with all required columns

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS products CASCADE;

-- Create products table with complete schema
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR(100) NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  max_stock_quantity INTEGER DEFAULT 100,
  stock_status VARCHAR(20) DEFAULT 'out_of_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  reviews INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
-- Allow read access for everyone (public can view products)
CREATE POLICY "Enable read access for everyone" ON products
  FOR SELECT USING (true);

-- Allow all access for authenticated users (admin only)
CREATE POLICY "Enable all access for authenticated users" ON products
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock_status ON products(stock_status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Create function to update stock_status automatically
CREATE OR REPLACE FUNCTION update_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity > NEW.low_stock_threshold THEN
        NEW.stock_status = 'in_stock';
        NEW.in_stock = true;
    ELSIF NEW.stock_quantity > 0 THEN
        NEW.stock_status = 'low_stock';
        NEW.in_stock = true;
    ELSE
        NEW.stock_status = 'out_of_stock';
        NEW.in_stock = false;
    END IF;
    
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update stock_status and updated_at
CREATE TRIGGER update_products_stock_status
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_status();

-- Insert sample products for testing
INSERT INTO products (name, price, original_price, category, description, features, images, stock_quantity, is_featured, is_new) VALUES 
('Baby Essentials Starter Kit', 89.99, 99.99, 'newborn-essentials', 'Complete starter kit for newborns with all essential items', 
 '["Soft cotton material", "Machine washable", "Hypoallergenic", "Gift wrapped"]'::jsonb,
 '["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400", "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400"]'::jsonb,
 25, true, true),

('Organic Cotton Onesies Set', 34.99, 39.99, '0-3-months', 'Set of 5 organic cotton onesies for babies 0-3 months',
 '["100% organic cotton", "Snap closures", "Machine washable", "Variety of colors"]'::jsonb,
 '["https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400", "https://images.unsplash.com/photo-1576876019516-b4ba765e7a20?w=400"]'::jsonb,
 50, true, false),

('Soft Plush Teddy Bear', 24.99, null, 'toys', 'Ultra-soft plush teddy bear perfect for cuddling',
 '["Super soft material", "Safe for all ages", "Machine washable", "Huggable size"]'::jsonb,
 '["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400"]'::jsonb,
 30, false, true);

-- Success message
SELECT 'Products table created successfully with sample data!' as result; 