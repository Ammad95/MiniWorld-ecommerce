-- Fix Sub-Admin Creation Issue - Update Current Admin User Role

-- Update the current admin user to super_admin role  
UPDATE admin_users 
SET role = 'super_admin' 
WHERE email = 'ammad_777@hotmail.com';

-- Verify the change was successful
SELECT 
  email, 
  name, 
  role, 
  is_active,
  created_at
FROM admin_users 
WHERE email = 'ammad_777@hotmail.com';

-- Success message
SELECT 'Admin role updated to super_admin successfully!' as result;
