-- MiniWorld E-commerce Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable RLS (Row Level Security)
-- This ensures data security and proper access control

-- =============================================
-- 1. PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category TEXT NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    max_stock_quantity INTEGER DEFAULT 100,
    stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    rating DECIMAL(2,1) DEFAULT 0.0,
    reviews INTEGER DEFAULT 0,
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. CATEGORIES TABLE
-- =============================================
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    banner_image TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. CUSTOMERS TABLE
-- =============================================
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    mobile TEXT,
    date_of_birth DATE,
    addresses JSONB DEFAULT '[]',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. ADMIN USERS TABLE
-- =============================================
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    mobile TEXT,
    role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    is_first_login BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. ORDERS TABLE
-- =============================================
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    customer_email TEXT,
    customer_name TEXT,
    items JSONB NOT NULL DEFAULT '[]',
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_info JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    tracking_number TEXT,
    estimated_delivery DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. PAYMENT ACCOUNTS TABLE
-- =============================================
CREATE TABLE payment_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_title TEXT NOT NULL,
    account_number TEXT NOT NULL,
    bank TEXT NOT NULL,
    iban TEXT,
    payment_method_type TEXT NOT NULL CHECK (payment_method_type IN ('bank_transfer', 'mobile_wallet', 'credit_card')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. ORDER HISTORY / AUDIT LOG
-- =============================================
CREATE TABLE order_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status_from TEXT,
    status_to TEXT NOT NULL,
    changed_by UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. PRODUCT REVIEWS TABLE
-- =============================================
CREATE TABLE product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock_status ON products(stock_status);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_accounts_updated_at BEFORE UPDATE ON payment_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update product stock status based on quantity
CREATE OR REPLACE FUNCTION update_product_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity = 0 THEN
        NEW.stock_status = 'out_of_stock';
    ELSIF NEW.stock_quantity <= NEW.low_stock_threshold THEN
        NEW.stock_status = 'low_stock';
    ELSE
        NEW.stock_status = 'in_stock';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for automatic stock status update
CREATE TRIGGER update_product_stock_status_trigger 
    BEFORE INSERT OR UPDATE OF stock_quantity, low_stock_threshold ON products 
    FOR EACH ROW EXECUTE FUNCTION update_product_stock_status();

-- Function to create order history entry
CREATE OR REPLACE FUNCTION create_order_history()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD IS NULL OR OLD.status != NEW.status THEN
        INSERT INTO order_history (order_id, status_from, status_to)
        VALUES (NEW.id, OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for order history
CREATE TRIGGER create_order_history_trigger 
    AFTER INSERT OR UPDATE OF status ON orders 
    FOR EACH ROW EXECUTE FUNCTION create_order_history();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for products and categories (for anonymous users)
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for payment accounts" ON payment_accounts FOR SELECT USING (is_active = true);

-- Customer policies (customers can only see their own data)
CREATE POLICY "Customers can view their own orders" ON orders FOR SELECT USING (customer_email = auth.email());
CREATE POLICY "Customers can create orders" ON orders FOR INSERT WITH CHECK (customer_email = auth.email());

-- Admin policies (admins can manage everything)
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (EXISTS (
    SELECT 1 FROM admin_users WHERE email = auth.email() AND is_active = true
));

CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (EXISTS (
    SELECT 1 FROM admin_users WHERE email = auth.email() AND is_active = true
));

CREATE POLICY "Admins can manage customers" ON customers FOR ALL USING (EXISTS (
    SELECT 1 FROM admin_users WHERE email = auth.email() AND is_active = true
));

-- =============================================
-- INSERT INITIAL DATA
-- =============================================

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
('0-6 Months', '0-6-months', 'Products for newborns and infants up to 6 months'),
('6-12 Months', '6-12-months', 'Products for babies 6 to 12 months old'),
('1-3 Years', '1-3-years', 'Products for toddlers 1 to 3 years old'),
('3-5 Years', '3-5-years', 'Products for young children 3 to 5 years old'),
('Accessories', 'accessories', 'Baby accessories and essentials');

-- Insert super admin user
INSERT INTO admin_users (email, name, mobile, role, is_first_login) VALUES
('ammad_777@hotmail.com', 'Super Administrator', '+92-300-1234567', 'super_admin', false);

-- Insert sample payment accounts
INSERT INTO payment_accounts (account_title, account_number, bank, iban, payment_method_type) VALUES
('MiniWorld Business Account', '1234567890', 'HBL Bank', 'PK36HABB0000001234567890', 'bank_transfer'),
('MiniWorld JazzCash', '03001234567', 'JazzCash', NULL, 'mobile_wallet');

-- =============================================
-- VIEWS FOR EASY QUERYING
-- =============================================

-- View for product analytics
CREATE VIEW product_analytics AS
SELECT 
    p.*,
    c.name as category_name,
    CASE 
        WHEN p.stock_quantity = 0 THEN 'Out of Stock'
        WHEN p.stock_quantity <= p.low_stock_threshold THEN 'Low Stock'
        ELSE 'In Stock'
    END as stock_status_text,
    (SELECT COUNT(*) FROM product_reviews pr WHERE pr.product_id = p.id) as review_count,
    (SELECT AVG(rating) FROM product_reviews pr WHERE pr.product_id = p.id) as avg_rating
FROM products p
LEFT JOIN categories c ON c.slug = p.category;

-- View for order analytics (FIXED - renamed duplicate column)
CREATE VIEW order_analytics AS
SELECT 
    o.*,
    c.name as registered_customer_name,
    c.mobile as customer_mobile,
    EXTRACT(month FROM o.created_at) as order_month,
    EXTRACT(year FROM o.created_at) as order_year
FROM orders o
LEFT JOIN customers c ON c.id = o.customer_id;

-- Success message
SELECT 'MiniWorld Database Schema Created Successfully! 🚀' as message; 