# 🔧 Fix Netlify Environment Variables - Step by Step

## ❌ **Current Issue**
Your Netlify deployment is showing a blank page with this error:
```
Uncaught TypeError: Failed to construct 'URL': Invalid URL
```

This happens because the Supabase environment variables are not configured in Netlify.

---

## 🎯 **Solution: Configure Netlify Environment Variables**

### **Step 1: Access Netlify Dashboard**
1. Go to [netlify.com](https://netlify.com)
2. Sign in to your account
3. Click on your **MiniWorld** project

### **Step 2: Open Environment Variables**
1. In your project dashboard, click **"Site settings"**
2. In the left sidebar, click **"Environment variables"**
3. Click **"Add variable"**

### **Step 3: Add Required Variables**
Add these **exact** variables one by one:

#### **Variable 1: VITE_SUPABASE_URL**
- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://sogeeanmpjgifxhhctjb.supabase.co`
- **Scope**: All scopes ✅
- Click **"Add variable"**

#### **Variable 2: VITE_SUPABASE_ANON_KEY**
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZ2VlYW5tcGpnaWZ4aGhjdGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMTY4MjYsImV4cCI6MjA2Nzc5MjgyNn0.1IMwQbUqJi8B-oarRY3w1dSynSZkw9qfCQ5YWKWK-Qg`
- **Scope**: All scopes ✅
- Click **"Add variable"**

#### **Variable 3: VITE_RESEND_API_KEY**
- **Key**: `VITE_RESEND_API_KEY`
- **Value**: `your_actual_resend_api_key` (replace with your real key)
- **Scope**: All scopes ✅
- Click **"Add variable"**

#### **Variable 4: VITE_EMAIL_FROM**
- **Key**: `VITE_EMAIL_FROM`
- **Value**: `support@miniworldpk.com`
- **Scope**: All scopes ✅
- Click **"Add variable"**

#### **Variable 5: VITE_EMAIL_FROM_NAME**
- **Key**: `VITE_EMAIL_FROM_NAME`
- **Value**: `MiniWorld Support Team`
- **Scope**: All scopes ✅
- Click **"Add variable"**

#### **Variable 6: VITE_APP_NAME**
- **Key**: `VITE_APP_NAME`
- **Value**: `MiniWorld`
- **Scope**: All scopes ✅
- Click **"Add variable"**

#### **Variable 7: VITE_APP_DOMAIN**
- **Key**: `VITE_APP_DOMAIN`
- **Value**: `miniworldpk.com`
- **Scope**: All scopes ✅
- Click **"Add variable"**

#### **Variable 8: VITE_APP_EMAIL**
- **Key**: `VITE_APP_EMAIL`
- **Value**: `info@miniworldpk.com`
- **Scope**: All scopes ✅
- Click **"Add variable"**

### **Step 4: Trigger Redeploy**
1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"**
3. Select **"Deploy site"**
4. Wait for deployment to complete (2-3 minutes)

---

## 🔍 **Verification**

After redeployment, your site should:
- ✅ Load without errors
- ✅ Show the MiniWorld homepage
- ✅ Display products properly
- ✅ Allow navigation to all pages

---

## 📋 **Environment Variables Checklist**

Make sure you have these **8 variables** in your Netlify dashboard:

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_RESEND_API_KEY`
- [ ] `VITE_EMAIL_FROM`
- [ ] `VITE_EMAIL_FROM_NAME`
- [ ] `VITE_APP_NAME`
- [ ] `VITE_APP_DOMAIN`
- [ ] `VITE_APP_EMAIL`

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: Still Getting Blank Page**
- **Solution**: Double-check that all variable names are exactly as shown (case-sensitive)
- **Check**: Make sure there are no extra spaces in the values

### **Issue 2: Variables Not Saving**
- **Solution**: Refresh the page and add variables again
- **Check**: Ensure "All scopes" is selected for each variable

### **Issue 3: Deployment Still Failing**
- **Solution**: Check the deploy logs in Netlify dashboard
- **Check**: Verify the build command is `npm run build`

---

## 🎯 **Expected Result**

After following these steps:
1. Your MiniWorld website will load properly
2. All pages will be accessible
3. Products will display correctly
4. Admin panel will work at `/admin`
5. Email system will be configured

---

## 📞 **Need Help?**

If you still see issues after following these steps:
1. Check the browser console for any remaining errors
2. Verify all environment variables are set correctly
3. Try a hard refresh (Ctrl+F5 or Cmd+Shift+R)

Your MiniWorld e-commerce site will be fully functional once these variables are configured! 🚀 