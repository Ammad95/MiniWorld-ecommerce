-- Fix Customer Authentication RLS Policies
-- Run this in your Supabase SQL editor

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Customers can create orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage customers" ON customers;

-- 2. Create comprehensive customer policies for customers table
CREATE POLICY "Customers can view own profile" ON customers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can update own profile" ON customers
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Customers can insert own profile" ON customers
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Create comprehensive customer policies for orders table
CREATE POLICY "Customers can view own orders" ON orders
    FOR SELECT USING (
        auth.uid()::text = customer_id OR 
        auth.email() = customer_email
    );

CREATE POLICY "Customers can create own orders" ON orders
    FOR INSERT WITH CHECK (
        auth.uid()::text = customer_id OR 
        auth.email() = customer_email
    );

CREATE POLICY "Customers can update own orders" ON orders
    FOR UPDATE USING (
        auth.uid()::text = customer_id OR 
        auth.email() = customer_email
    );

-- 4. Admin policies (preserve admin access)
CREATE POLICY "Admins can manage all customers" ON customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() AND is_active = true
        )
    );

CREATE POLICY "Admins can manage all orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() AND is_active = true
        )
    );

-- 5. Ensure customers table has proper structure
-- Add any missing columns if needed
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'customers' AND column_name = 'addresses') THEN
        ALTER TABLE customers ADD COLUMN addresses JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'customers' AND column_name = 'is_verified') THEN
        ALTER TABLE customers ADD COLUMN is_verified BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 6. Create function to automatically create customer profile
CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.customers (id, email, name, mobile, is_verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'mobile', ''),
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Customer already exists, just update verification status
        UPDATE public.customers 
        SET is_verified = (NEW.email_confirmed_at IS NOT NULL)
        WHERE id = NEW.id;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create trigger to automatically create customer profile on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_customer();

-- 8. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.customers TO authenticated;
GRANT ALL ON public.orders TO authenticated;

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email); 