-- Create Test Customer Account
-- Run this in your Supabase SQL editor to create a test customer

-- 1. Insert a test customer (this will be linked to Supabase Auth)
INSERT INTO customers (
    id,
    email, 
    name, 
    mobile, 
    addresses,
    is_verified,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'test@customer.com',
    'Test Customer',
    '+1234567890',
    '[]'::jsonb,
    true,
    now(),
    now()
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    mobile = EXCLUDED.mobile,
    is_verified = EXCLUDED.is_verified,
    updated_at = now();

-- 2. Also create another test customer
INSERT INTO customers (
    id,
    email, 
    name, 
    mobile, 
    addresses,
    is_verified,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'customer@test.com',
    'Customer Test',
    '+0987654321',
    '[]'::jsonb,
    true,
    now(),
    now()
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    mobile = EXCLUDED.mobile,
    is_verified = EXCLUDED.is_verified,
    updated_at = now();

-- Note: After running this, you need to:
-- 1. Go to Supabase Auth > Users
-- 2. Create corresponding auth users with emails:
--    - test@customer.com (password: testpassword123)
--    - customer@test.com (password: testpassword123)
-- 3. Or use the customer registration form on your website 