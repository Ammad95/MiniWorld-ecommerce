-- Fix for admin_users table and permissions
-- Run this in your Supabase SQL editor

-- 1. Create or recreate the admin_users table
DROP TABLE IF EXISTS admin_users;

CREATE TABLE admin_users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    name text NOT NULL,
    mobile text,
    role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    is_first_login boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid REFERENCES admin_users(id),
    password_changed_at timestamp with time zone DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Create permissive policies for admin_users
DROP POLICY IF EXISTS "Enable read access for all users" ON admin_users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON admin_users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON admin_users;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON admin_users;

CREATE POLICY "Enable read access for all users" ON admin_users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON admin_users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on email" ON admin_users
    FOR UPDATE USING (auth.email() = email OR auth.role() = 'authenticated');

CREATE POLICY "Enable delete for users based on email" ON admin_users
    FOR DELETE USING (auth.email() = email OR auth.role() = 'authenticated');

-- 4. Insert the super admin user
INSERT INTO admin_users (
    email, 
    name, 
    mobile, 
    role, 
    is_first_login, 
    is_active
) VALUES (
    'admin@miniworld.com',
    'Super Administrator',
    '+1-234-567-8900',
    'super_admin',
    false,
    true
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

-- 5. Create a function to get admin user (useful for debugging)
CREATE OR REPLACE FUNCTION get_admin_user(user_email text)
RETURNS TABLE (
    id uuid,
    email text,
    name text,
    mobile text,
    role text,
    is_first_login boolean,
    is_active boolean,
    created_at timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        au.id,
        au.email,
        au.name,
        au.mobile,
        au.role,
        au.is_first_login,
        au.is_active,
        au.created_at
    FROM admin_users au
    WHERE au.email = user_email AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant necessary permissions
GRANT ALL ON admin_users TO postgres;
GRANT ALL ON admin_users TO anon;
GRANT ALL ON admin_users TO authenticated;

-- 7. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Test the setup
SELECT 'Database setup complete. Admin user created.' as status;
SELECT * FROM admin_users WHERE email = 'admin@miniworld.com'; 