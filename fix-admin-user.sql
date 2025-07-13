-- Fix Admin User for MiniWorld
-- Run this in your Supabase SQL Editor

-- First, check if admin_users table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        RAISE NOTICE 'admin_users table does not exist. Please run the main schema first.';
    ELSE
        RAISE NOTICE 'admin_users table exists. Proceeding with user setup.';
    END IF;
END $$;

-- Delete any existing admin user with similar email
DELETE FROM admin_users WHERE email LIKE '%ammad%' OR email LIKE '%ammaad%';

-- Insert the admin user with the correct email (the one you're trying to use)
INSERT INTO admin_users (email, name, mobile, role, is_first_login, is_active) VALUES
('ammaad_777@hotmail.com', 'Super Administrator', '+92-300-1234567', 'super_admin', false, true)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    mobile = EXCLUDED.mobile,
    role = EXCLUDED.role,
    is_first_login = EXCLUDED.is_first_login,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Verify the user was created
SELECT 
    email, 
    name, 
    role, 
    is_first_login, 
    is_active,
    created_at
FROM admin_users 
WHERE email = 'ammaad_777@hotmail.com';

-- Show success message
SELECT 'Admin user created/updated successfully! Now create the Auth user in Supabase Auth.' as message; 