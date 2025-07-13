# 🚀 Production Environment Variables Setup

## 📋 **Complete Production .env Configuration**

### **For Netlify Deployment** (Recommended)

When deploying to Netlify, you'll need to configure these environment variables in your Netlify dashboard:

---

## 🔐 **Required Environment Variables**

### **1. Supabase Configuration**
```env
VITE_SUPABASE_URL=https://sogeeanmpjgifxhhctjb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZ2VlYW5tcGpnaWZ4aGhjdGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMTY4MjYsImV4cCI6MjA2Nzc5MjgyNn0.1IMwQbUqJi8B-oarRY3w1dSynSZkw9qfCQ5YWKWK-Qg
```

### **2. Email Configuration (Resend)**
```env
VITE_RESEND_API_KEY=re_your_actual_resend_api_key
VITE_EMAIL_FROM=support@miniworldpk.com
VITE_EMAIL_FROM_NAME=MiniWorld Support Team
```

### **3. JazzCash Payment Configuration**
```env
# Production JazzCash (replace with real credentials)
VITE_JAZZCASH_MERCHANT_ID=MW_MERCHANT_001
VITE_JAZZCASH_PASSWORD=your_production_password
VITE_JAZZCASH_HASH_KEY=your_production_hash_key
VITE_JAZZCASH_IS_SANDBOX=false
```

### **4. App Configuration**
```env
VITE_APP_NAME=MiniWorld
VITE_APP_DOMAIN=miniworldpk.com
VITE_APP_EMAIL=info@miniworldpk.com
```

---

## 🌐 **Netlify Environment Variables Setup**

### **Step 1: Access Environment Variables**
1. Go to your Netlify dashboard
2. Select your MiniWorld project
3. Go to **Site settings** → **Environment variables**
4. Click **"Add variable"**

### **Step 2: Add Each Variable**
For each variable above:
1. **Key**: Enter the variable name (e.g., `VITE_SUPABASE_URL`)
2. **Value**: Enter the actual value
3. **Scope**: Select "All scopes"
4. Click **"Add variable"**

### **Step 3: Redeploy**
After adding all variables:
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete

---

## 🔒 **Security Notes**

### **✅ Safe to Include (VITE_ prefix)**
- All variables with `VITE_` prefix are safe in client-side code
- They're compiled into the build and publicly accessible
- Only include non-sensitive configuration

### **❌ Never Include**
- Database passwords
- Secret API keys (without VITE_ prefix)
- Private keys or certificates
- Internal system passwords

### **🔐 JazzCash Production Credentials**
- Contact JazzCash support for production credentials
- Replace sandbox values with real merchant details
- Set `VITE_JAZZCASH_IS_SANDBOX=false` for production

---

## 🚀 **Deployment Checklist**

- [ ] Supabase URL and anon key configured
- [ ] Resend API key configured and tested
- [ ] JazzCash production credentials obtained
- [ ] Domain configured (miniworldpk.com)
- [ ] All environment variables added to Netlify
- [ ] Site redeployed after adding variables
- [ ] SSL certificate automatically configured by Netlify

---

## 📞 **Support Contacts**

### **JazzCash Integration Support**
- **Email**: developer.support@jazzcash.com.pk
- **Phone**: +92-21-111-124-124
- **Documentation**: https://developer.jazzcash.com.pk/

### **Resend Support**
- **Email**: support@resend.com
- **Documentation**: https://resend.com/docs

### **Netlify Support**
- **Documentation**: https://docs.netlify.com/
- **Community**: https://community.netlify.com/

---

## 💡 **Pro Tips**

1. **Test Environment Variables**: Use Netlify's deploy preview to test changes
2. **Backup Configuration**: Keep a local copy of your environment variables
3. **Monitor Usage**: Check Resend dashboard for email delivery stats
4. **SSL Certificate**: Netlify automatically provides SSL for your domain
5. **Performance**: Use Netlify's CDN for fast global delivery

---

## 🎯 **Next Steps After Environment Setup**

1. **Domain Configuration**: Point miniworldpk.com to Netlify
2. **SSL Certificate**: Automatically configured by Netlify
3. **DNS Configuration**: Update nameservers at GoDaddy
4. **Email Authentication**: Verify domain for email sending
5. **Payment Testing**: Test JazzCash integration in production

Your MiniWorld e-commerce platform is production-ready! 🚀 