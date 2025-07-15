# 🔧 Customer Authentication Fix Guide

## 🚨 **Current Issues**

1. **Customer login shows "invalid credentials"**
2. **"Start Shopping" button logs customer out automatically**
3. **Navigation from dashboard to home page causes logout**

## 🔍 **Root Causes**

### **Issue 1: Database Access Problems**
- **RLS Policies**: Row Level Security is blocking customer access to their own data
- **Missing Customer Profiles**: Supabase Auth users exist but no corresponding customer table entries
- **Permission Issues**: Customers can't read/write their own data

### **Issue 2: Authentication Context Conflicts**
- Multiple auth contexts (CustomerAuth, SupabaseAuth, AdminAuth) interfering
- Navigation triggers auth state resets
- Session management conflicts

## 🛠️ **Complete Fix Process**

### **Step 1: Fix Database Policies (CRITICAL)**

**Run this in Supabase SQL Editor:**

```sql
-- 1. Fix Customer Table Policies
DROP POLICY IF EXISTS "Customers can view own profile" ON customers;
DROP POLICY IF EXISTS "Customers can update own profile" ON customers;
DROP POLICY IF EXISTS "Customers can insert own profile" ON customers;

CREATE POLICY "Customers can view own profile" ON customers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can update own profile" ON customers
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Customers can insert own profile" ON customers
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Fix Orders Table Policies
DROP POLICY IF EXISTS "Customers can view own orders" ON orders;
DROP POLICY IF EXISTS "Customers can create own orders" ON orders;

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

-- 3. Grant Permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.customers TO authenticated;
GRANT ALL ON public.orders TO authenticated;
```

### **Step 2: Create Test Customer Account**

**In Supabase Auth > Users:**
1. Click "Create new user"
2. Email: `test@customer.com`
3. Password: `testpassword123`
4. Check "Auto Confirm User"

**Then run in SQL Editor:**
```sql
-- Link the auth user to customer profile
INSERT INTO customers (
    id,
    email, 
    name, 
    mobile, 
    addresses,
    is_verified
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'test@customer.com'),
    'test@customer.com',
    'Test Customer',
    '+1234567890',
    '[]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_verified = EXCLUDED.is_verified;
```

### **Step 3: Test Login Process**

1. **Go to `/customer/login`**
2. **Use credentials:**
   - Email: `test@customer.com`
   - Password: `testpassword123`
3. **Should successfully log in to dashboard**

### **Step 4: Fix Navigation Logout Issue**

The "Start Shopping" buttons use `Link to="/"` which should NOT cause logout. If it does, the issue is likely:

1. **Check browser console** for authentication errors
2. **Use the Debug Auth button** (bottom right corner) to see auth state
3. **Look for conflicting contexts** or session issues

### **Step 5: Additional Debugging**

**Enable Debug Mode:**
1. The app now includes a debug component
2. In development, you'll see "Debug Auth" button (bottom right)
3. Click it to see real-time auth state information

## 🔧 **Manual Fixes Applied**

### **CustomerAuthContext.tsx Updates:**
- ✅ **Auto-create customer profiles** if missing from database
- ✅ **Better error handling** for RLS permission issues  
- ✅ **Improved session management** to prevent unnecessary logouts
- ✅ **Enhanced auth state change handling**

### **Database Schema Updates:**
- ✅ **Fixed RLS policies** for customer data access
- ✅ **Added trigger** to auto-create customer profiles
- ✅ **Proper permissions** for authenticated users

### **Debug Tools Added:**
- ✅ **Real-time auth state monitoring**
- ✅ **Session and user data inspection**
- ✅ **Customer profile validation**

## 🧪 **Testing Checklist**

### **Customer Registration:**
- [ ] New customer can register successfully
- [ ] Profile is created in both auth.users and customers table
- [ ] Customer can log in immediately after registration

### **Customer Login:**
- [ ] Existing customer can log in with correct credentials
- [ ] Invalid credentials show proper error message
- [ ] Successful login redirects to dashboard

### **Navigation:**
- [ ] "Continue Shopping" from dashboard works without logout
- [ ] "Start Shopping" button works without logout
- [ ] Browser refresh maintains login state
- [ ] All navigation maintains authentication

### **Dashboard Functionality:**
- [ ] Customer data loads correctly
- [ ] Orders display properly (if any exist)
- [ ] Profile information shows correctly
- [ ] Logout button works properly

## 🚨 **If Issues Persist**

### **Check These:**

1. **Supabase Project Settings:**
   - RLS is enabled but policies are correct
   - JWT expiry settings
   - Auth configuration

2. **Browser Issues:**
   - Clear browser cache and cookies
   - Check for console errors
   - Try incognito/private mode

3. **Database Connectivity:**
   - Verify Supabase connection string
   - Check API keys in environment variables
   - Test database queries in Supabase dashboard

## 💡 **Prevention Tips**

1. **Always create customer profiles** when creating auth users
2. **Test RLS policies** before enabling in production
3. **Use debug tools** to monitor auth state during development
4. **Separate concerns** between admin and customer authentication

## 📞 **Support**

If you continue to experience issues:
1. **Check the debug output** for specific error messages
2. **Look at browser console** for detailed error logs
3. **Verify Supabase policies** are correctly applied
4. **Test with fresh customer account** creation

The authentication system should now work reliably for customer login, navigation, and session management! 