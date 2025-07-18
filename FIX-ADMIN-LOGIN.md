# Fix Admin Login Authentication Issues

## Problem
The admin login is failing with "Invalid login credentials" because:
1. **Missing Environment Variables**: No `.env` file with Supabase credentials
2. **Admin User Not Created**: No admin user exists in Supabase Auth
3. **Database Not Set Up**: Admin users table may not exist or be properly configured

## Solution Steps

### Step 1: Create .env File
Create a `.env` file in your project root with the following content:

```env
# Environment Variables for MiniWorld E-commerce Application
# Replace these placeholder values with your actual credentials

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Email Configuration (Resend)
VITE_RESEND_API_KEY=re_your_resend_api_key_here
VITE_EMAIL_FROM=support@miniworldpk.com
VITE_EMAIL_FROM_NAME=MiniWorld Support Team

# Site Configuration
VITE_SITE_URL=http://localhost:3000

# Optional: Development Configuration
VITE_APP_ENV=development
```

### Step 2: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your MiniWorld project (or create one if needed)
3. Go to **Settings** > **API**
4. Copy the following:
   - **Project URL** (replace `https://your-project-id.supabase.co`)
   - **anon/public key** (replace `your-supabase-anon-key-here`)

### Step 3: Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL to create the admin_users table:

```sql
-- Create admin_users table
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

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users" ON admin_users
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable insert for authenticated users" ON admin_users
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" ON admin_users
  FOR UPDATE USING (auth.uid() IS NOT NULL);
```

### Step 4: Create Admin User in Supabase Auth

1. In Supabase dashboard, go to **Authentication** > **Users**
2. Click **Add user**
3. Fill in:
   - **Email**: `admin@miniworld.com` (or your preferred admin email)
   - **Password**: `admin123` (or your preferred password)
   - **Auto Confirm User**: ✅ Check this box
4. Click **Create user**

### Step 5: Add Admin User to Database

1. Go back to **SQL Editor**
2. Run this SQL to add the admin user to your admin_users table:

```sql
-- Insert admin user (replace email and name as needed)
INSERT INTO admin_users (email, password_hash, name, role, is_active, is_first_login) 
VALUES (
  'admin@miniworld.com',  -- Replace with your admin email
  '$2b$10$dummy_hash_replace_if_needed',  -- This is just a placeholder
  'Admin User',  -- Replace with admin name
  'super_admin',
  true,
  false
) ON CONFLICT (email) DO NOTHING;
```

### Step 6: Quick Fix for Development

If you want to test immediately, you can use these temporary credentials:

**For .env file:**
```env
# Temporary development credentials (replace with your actual values)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RESEND_API_KEY=re_temp_key
VITE_EMAIL_FROM=admin@miniworld.com
VITE_EMAIL_FROM_NAME=MiniWorld Admin
VITE_SITE_URL=http://localhost:3000
VITE_APP_ENV=development
```

**Test Admin Credentials:**
- Email: `admin@miniworld.com`
- Password: `admin123`

### Step 7: Restart Development Server

1. Stop your current development server (Ctrl+C)
2. Clear Vite cache: `rm -rf node_modules/.vite` (or delete `.vite` folder in `node_modules`)
3. Restart: `npm run dev` or `.\node_modules\.bin\vite.cmd`

### Step 8: Test Login

1. Go to `http://localhost:3000/admin/login`
2. Use your admin credentials
3. If successful, you should be redirected to the admin dashboard

## Troubleshooting

### If you still get authentication errors:

1. **Check Environment Variables**: Make sure `.env` is in the project root and has correct values
2. **Verify Supabase Project**: Ensure your Supabase project is active and not paused
3. **Check User Exists**: In Supabase Auth Users, verify the admin user was created
4. **Clear Browser Cache**: Clear cookies and local storage for your localhost
5. **Check Console**: Look for specific error messages in browser developer tools

### Common Issues:

1. **"VITE_SUPABASE_URL is not configured"**: Your .env file is missing or not in the right location
2. **"Invalid login credentials"**: User doesn't exist in Supabase Auth or wrong password
3. **"Access denied"**: User exists in Auth but not in admin_users table
4. **"Database error"**: admin_users table doesn't exist or RLS policies are blocking access

## Complete Setup Alternative

If you prefer to do a complete setup from scratch, follow the `COMPLETE-SETUP-GUIDE.md` file which includes all services (Supabase, Resend, Netlify).

## Need Help?

If you continue having issues:
1. Check the browser console for specific error messages
2. Verify your Supabase project dashboard shows the user and table
3. Ensure all environment variables are correctly set
4. Try creating a new admin user with a different email

---

**Quick Command Reference:**
```bash
# Create .env file (Windows)
echo. > .env

# Start development server
.\node_modules\.bin\vite.cmd

# Clear Vite cache
Remove-Item -Recurse -Force node_modules\.vite
``` 