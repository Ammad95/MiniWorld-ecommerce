# MiniWorld Complete Setup Guide

This comprehensive guide will walk you through setting up all the required services for your MiniWorld e-commerce application.

## Table of Contents
1. [Supabase Database Setup](#1-supabase-database-setup)
2. [Supabase Storage Setup](#2-supabase-storage-setup) 
3. [Resend Email API Setup](#3-resend-email-api-setup)
4. [Netlify Deployment Setup](#4-netlify-deployment-setup)
5. [Environment Variables](#5-environment-variables)
6. [Testing & Verification](#6-testing--verification)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Supabase Database Setup

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub, Google, or email
4. Verify your email if using email signup

### Step 2: Create New Project
1. Click "New Project" on your dashboard
2. Choose your organization (create one if needed)
3. Fill in project details:
   - **Name**: `miniworld-ecommerce` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose closest to your target audience
4. Click "Create new project"
5. Wait 2-3 minutes for project initialization

### Step 3: Get Project Credentials
1. Go to **Settings** > **API** in your Supabase dashboard
2. Copy and save these values:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (starts with `eyJ`)
   - **service_role key** (starts with `eyJ`) - Keep this private!

### Step 4: Set Up Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy and paste the following SQL schema:

```sql
-- Create admin_users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
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

-- Create payment_accounts table
CREATE TABLE payment_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_details JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users
CREATE POLICY "Enable read access for authenticated users" ON admin_users
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable insert for authenticated users" ON admin_users
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for users based on email" ON admin_users
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

-- Create RLS policies for orders (admin access)
CREATE POLICY "Enable all access for authenticated users" ON orders
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for order_items (admin access)
CREATE POLICY "Enable all access for authenticated users" ON order_items
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for payment_accounts (admin access)
CREATE POLICY "Enable all access for authenticated users" ON payment_accounts
  FOR ALL USING (auth.uid() IS NOT NULL);
```

4. Click "Run" to execute the schema
5. Verify tables were created in **Table Editor**

### Step 5: Insert Sample Data (Optional)
Add some sample products and admin user:

```sql
-- Insert sample admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, role) VALUES 
('admin@miniworld.com', '$2b$10$example_hash_here', 'admin');

-- Insert sample products
INSERT INTO products (name, description, price, category, stock_quantity) VALUES 
('Sample Product 1', 'A great product for testing', 29.99, 'electronics', 50),
('Sample Product 2', 'Another test product', 19.99, 'clothing', 30),
('Sample Product 3', 'Premium test item', 99.99, 'accessories', 20);

-- Insert sample payment account
INSERT INTO payment_accounts (provider, account_name, account_details) VALUES 
('jazzcash', 'Main JazzCash Account', '{"merchant_id": "your_merchant_id", "password": "your_password", "return_url": "your_return_url"}');
```

---

## 2. Supabase Storage Setup

### Step 1: Create Storage Bucket
1. In your Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Enter bucket details:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Check this box
4. Click "Create bucket"

### Step 2: Set Up Storage Policies
1. Click on your `product-images` bucket
2. Go to **Policies** tab
3. Click "Add policy" > "Create a policy"
4. Select "GET" operation and add this policy:

```sql
-- Allow public read access to product images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
```

5. Add another policy for INSERT (admin upload):

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);
```

6. Add policy for UPDATE:

```sql
-- Allow authenticated users to update
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);
```

7. Add policy for DELETE:

```sql
-- Allow authenticated users to delete
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);
```

### Step 3: Test Image Upload
1. Go back to **Storage** > `product-images`
2. Click "Upload file"
3. Upload a test image
4. Verify the image appears and is publicly accessible
5. Note the URL format: `https://your-project.supabase.co/storage/v1/object/public/product-images/filename.jpg`

---

## 3. Resend Email API Setup

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Click "Get Started" or "Sign Up"
3. Sign up with GitHub, Google, or email
4. Verify your email address
5. Complete the onboarding process

### Step 2: Add and Verify Domain
1. In Resend dashboard, go to **Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `miniworld.com` or `yourdomain.com`)
4. Add the required DNS records to your domain provider:
   - **TXT record** for domain verification
   - **DKIM records** for email authentication
   - **MX records** if you want to receive emails

**Example DNS Records:**
```
Type: TXT
Name: @
Value: resend-domain-verification=your-verification-code

Type: TXT  
Name: resend._domainkey
Value: your-dkim-key

Type: MX
Name: @
Value: mx.resend.com
Priority: 10
```

5. Wait for DNS propagation (5-30 minutes)
6. Click "Verify Domain" in Resend dashboard
7. Domain status should change to "Verified" ✅

### Step 3: Generate API Key
1. Go to **API Keys** in Resend dashboard
2. Click "Create API Key"
3. Enter details:
   - **Name**: `MiniWorld Production` (or appropriate name)
   - **Permission**: Select "Sending access"
   - **Domain**: Choose your verified domain
4. Click "Add"
5. **Important**: Copy the API key immediately and save it securely
   - Format: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't be able to see it again!

### Step 4: Test Email Sending
1. Go to **Emails** in Resend dashboard
2. Click "Send Test Email"
3. Configure test email:
   - **From**: `noreply@yourdomain.com` (use your verified domain)
   - **To**: Your email address
   - **Subject**: `Test Email`
   - **Content**: Simple test message
4. Click "Send Email"
5. Check your inbox and spam folder
6. Verify email delivery and formatting

---

## 4. Netlify Deployment Setup

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up"
3. Sign up with GitHub, GitLab, Bitbucket, or email
4. If using Git provider, authorize Netlify access
5. Complete account verification

### Step 2: Deploy Your Project

#### Option A: Git Integration (Recommended)
1. Push your MiniWorld project to GitHub/GitLab/Bitbucket
2. In Netlify dashboard, click "Add new site" > "Import an existing project"
3. Choose your Git provider
4. Select your MiniWorld repository
5. Configure build settings:
   - **Branch to deploy**: `main` or `master`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

#### Option B: Manual Deploy
1. Run `npm run build` in your project directory
2. In Netlify dashboard, click "Add new site" > "Deploy manually"
3. Drag and drop your `dist` folder
4. Wait for deployment to complete

### Step 3: Configure Environment Variables
1. Go to your site dashboard in Netlify
2. Click **Site configuration** > **Environment variables**
3. Add the following variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RESEND_API_KEY=your-resend-api-key
VITE_SITE_URL=https://your-site.netlify.app
```

4. Click "Save"
5. Trigger a new deployment: **Deploys** > **Trigger deploy**

### Step 4: Custom Domain Setup (Optional)
1. Purchase a domain from your preferred provider
2. In Netlify, go to **Domain management**
3. Click "Add custom domain"
4. Enter your domain name
5. Configure DNS:

**Option A: Netlify DNS**
1. Click "Use Netlify DNS"
2. Update nameservers at your domain provider:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

**Option B: External DNS**
1. Add CNAME record at your DNS provider:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```
2. Add A record for apex domain:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

### Step 5: Enable HTTPS and Redirects
1. HTTPS is automatically enabled with Let's Encrypt
2. Add redirects for React Router in **Site configuration** > **Redirects**:
   ```
   /*    /index.html   200
   ```
3. Or create a `_redirects` file in your `public` folder:
   ```
   /*    /index.html   200
   ```

---

## 5. Environment Variables

Create a `.env` file in your project root with these variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email Configuration (Resend)
VITE_RESEND_API_KEY=re_your-resend-api-key

# Site Configuration
VITE_SITE_URL=https://your-domain.com

# Optional: Development Configuration
VITE_APP_ENV=production
```

**Important Security Notes:**
- Never commit the `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use different API keys for development and production
- The `VITE_` prefix makes variables available in the browser
- Keep the `service_role` key secure and never expose it in frontend code

---

## 6. Testing & Verification

### Database Testing
1. **Admin Login Test:**
   - Try logging into admin panel
   - Verify admin authentication works
   - Check if admin dashboard loads properly

2. **Product Management Test:**
   - Add a new product through admin panel
   - Upload product image
   - Verify product appears on frontend
   - Test product editing and deletion

3. **Order Processing Test:**
   - Add products to cart
   - Complete checkout with customer details
   - Verify order appears in admin panel
   - Check order email notification

### Email Testing
1. **Order Confirmation Test:**
   - Complete a test order
   - Check if confirmation email is received
   - Verify email content and formatting
   - Test with different email providers

2. **Admin Notification Test:**
   - Verify admin receives order notifications
   - Check email delivery time
   - Test email in spam folders

### Deployment Testing
1. **Functionality Test:**
   - Test all pages and features
   - Verify responsive design
   - Check loading times
   - Test on different devices and browsers

2. **Performance Test:**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Verify image optimization
   - Test with slow network conditions

---

## 7. Troubleshooting

### Common Supabase Issues

**Database Connection Errors:**
- Verify project URL and API keys are correct
- Check if RLS policies are properly configured
- Ensure network connectivity to Supabase

**Image Upload Problems:**
- Verify storage bucket is public
- Check storage policies allow uploads
- Ensure correct bucket name in code
- Verify file size limits (default: 50MB)

**Authentication Issues:**
- Check if admin user exists in database
- Verify password hashing is consistent
- Ensure JWT configuration is correct

### Common Resend Issues

**Email Delivery Problems:**
- Verify domain is verified in Resend dashboard
- Check DNS records are properly configured
- Ensure API key has correct permissions
- Check spam folders
- Verify "from" address uses verified domain

**API Key Issues:**
- Ensure API key is correctly formatted
- Check key permissions in Resend dashboard
- Verify key is not expired
- Test with Resend API directly

### Common Netlify Issues

**Build Failures:**
- Check build logs for specific errors
- Verify Node.js version compatibility
- Ensure all dependencies are in package.json
- Check for TypeScript compilation errors

**Environment Variable Problems:**
- Verify all required variables are set
- Check variable names match exactly
- Ensure no extra spaces in values
- Redeploy after adding variables

**Routing Issues:**
- Add `_redirects` file for React Router
- Verify redirects are properly configured
- Check for 404 errors on page refresh

**Domain Issues:**
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check SSL certificate status
- Test with different DNS servers

### Performance Optimization

**Database Optimization:**
- Add indexes for frequently queried columns
- Optimize complex queries
- Use connection pooling
- Monitor query performance

**Image Optimization:**
- Compress images before upload
- Use appropriate image formats (WebP, AVIF)
- Implement lazy loading
- Consider CDN integration

**Frontend Optimization:**
- Implement code splitting
- Optimize bundle size
- Use service workers for caching
- Monitor Core Web Vitals

---

## Success Checklist

- [ ] Supabase project created and configured
- [ ] Database schema deployed successfully
- [ ] Sample data inserted and visible
- [ ] Storage bucket created and accessible
- [ ] Image upload working properly
- [ ] Resend account created and verified
- [ ] Domain verified in Resend
- [ ] API key generated and tested
- [ ] Email delivery confirmed
- [ ] Netlify account created
- [ ] Project deployed successfully
- [ ] Environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled and working
- [ ] All features tested end-to-end
- [ ] Admin panel fully functional
- [ ] Guest checkout working
- [ ] Order emails being sent
- [ ] Mobile responsiveness verified

---

## Support Resources

### Documentation Links
- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

### Community Support
- [Supabase Discord](https://discord.supabase.com)
- [Netlify Community](https://community.netlify.com)
- [React Community](https://react.dev/community)

### Emergency Contacts
- Supabase Support: support@supabase.com
- Resend Support: support@resend.com
- Netlify Support: support@netlify.com

---

**Note:** Keep this guide updated as you make changes to your application. Document any custom configurations or additional setup steps specific to your implementation. 