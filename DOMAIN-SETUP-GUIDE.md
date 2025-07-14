# 🌐 Connect miniworldpk.com to Netlify - Complete Guide

## 🎯 **Goal**
Point your domain `miniworldpk.com` to your live Netlify deployment

---

## 📋 **Step 1: Add Custom Domain in Netlify**

### **A. Access Domain Settings**
1. Go to your Netlify dashboard
2. Click on your **MiniWorld** project
3. Click **"Domain settings"** (or **"Site settings"** → **"Domain management"**)

### **B. Add Custom Domain**
1. Click **"Add custom domain"**
2. Enter: `miniworldpk.com`
3. Click **"Verify"**
4. Netlify will ask if you own this domain - click **"Yes, add domain"**

### **C. Add WWW Subdomain (Optional but Recommended)**
1. Click **"Add another domain"**
2. Enter: `www.miniworldpk.com`
3. Click **"Verify"** and **"Yes, add domain"**

---

## 🔧 **Step 2: Get Netlify DNS Information**

After adding your domain, Netlify will show you DNS configuration options:

### **Option A: Use Netlify DNS (Recommended)**
Netlify will provide **4 nameservers** like:
```
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```

### **Option B: Use External DNS (Manual)**
If you prefer to keep GoDaddy DNS, you'll need these records:
- **A Record**: `75.2.60.5` (Netlify Load Balancer)
- **CNAME Record**: `www` → `your-site-name.netlify.app`

---

## 🌍 **Step 3: Configure DNS at GoDaddy**

### **If Using Netlify DNS (Recommended):**

#### **A. Access GoDaddy DNS Management**
1. Go to [godaddy.com](https://godaddy.com)
2. Sign in to your account
3. Go to **"My Products"** → **"All Products and Services"**
4. Find **"Domains"** and click **"DNS"** next to `miniworldpk.com`

#### **B. Change Nameservers**
1. Scroll down to **"Nameservers"** section
2. Click **"Change"**
3. Select **"I'll use my own nameservers"**
4. Replace all existing nameservers with the 4 Netlify nameservers:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
5. Click **"Save"**

### **If Using GoDaddy DNS:**

#### **A. Access DNS Management**
1. In GoDaddy, click **"Manage DNS"** for `miniworldpk.com`

#### **B. Add/Modify DNS Records**
1. **Delete existing A records** (if any)
2. **Add new A record**:
   - **Type**: A
   - **Name**: @ (represents root domain)
   - **Value**: `75.2.60.5`
   - **TTL**: 1 Hour

3. **Add/Modify CNAME record**:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: `your-netlify-site-name.netlify.app`
   - **TTL**: 1 Hour

---

## ⏰ **Step 4: Wait for DNS Propagation**

### **Timeline**
- **Initial propagation**: 15-30 minutes
- **Full global propagation**: 24-48 hours
- **Netlify detection**: Usually within 1 hour

### **Check Progress**
1. In Netlify dashboard, check domain status
2. Use online tools: [whatsmydns.net](https://whatsmydns.net)
3. Try accessing `https://miniworldpk.com` in browser

---

## 🔒 **Step 5: SSL Certificate (Automatic)**

### **Netlify Automatic SSL**
1. Once DNS propagates, Netlify automatically provisions SSL
2. Certificate from **Let's Encrypt** (free)
3. Auto-renewal every 90 days
4. Supports both `miniworldpk.com` and `www.miniworldpk.com`

### **Force HTTPS**
1. In Netlify → **Domain settings**
2. Scroll to **"HTTPS"** section
3. Enable **"Force HTTPS redirect"**

---

## 🎯 **Step 6: Configure Email Domain (Optional)**

If you plan to use email with your domain:

### **For Resend Email Service**
Add these DNS records in GoDaddy:

```
Type: TXT
Name: @
Value: v=spf1 include:spf.resend.com ~all

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@miniworldpk.com;

Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com
```

---

## ✅ **Verification Checklist**

### **After DNS Propagation:**
- [ ] `https://miniworldpk.com` loads your MiniWorld site
- [ ] `https://www.miniworldpk.com` loads your site
- [ ] SSL certificate shows as secure (green lock)
- [ ] HTTP automatically redirects to HTTPS
- [ ] All pages and features work correctly

### **Test These URLs:**
- [ ] `https://miniworldpk.com` (Homepage)
- [ ] `https://miniworldpk.com/category/newborn` (Category page)
- [ ] `https://miniworldpk.com/admin` (Admin login)
- [ ] `https://www.miniworldpk.com` (WWW redirect)

---

## 🚨 **Troubleshooting**

### **Issue 1: Domain Not Propagating**
- **Solution**: Wait longer (DNS can take up to 48 hours)
- **Check**: Use different DNS checker tools
- **Try**: Clear browser cache and DNS cache

### **Issue 2: SSL Certificate Not Working**
- **Solution**: Wait for DNS to fully propagate first
- **Check**: Netlify domain settings for SSL status
- **Try**: Force new SSL certificate in Netlify

### **Issue 3: Email Not Working**
- **Solution**: Verify DNS records are correct
- **Check**: Use DNS lookup tools to verify TXT records
- **Wait**: Email DNS changes can take longer to propagate

### **Issue 4: WWW Not Working**
- **Solution**: Make sure both domains are added in Netlify
- **Check**: DNS settings for both root and www

---

## 📞 **Support Contacts**

### **Netlify Support**
- **Documentation**: https://docs.netlify.com/domains-https/
- **Community**: https://community.netlify.com/

### **GoDaddy Support**
- **DNS Help**: https://godaddy.com/help/managing-dns
- **Phone**: Check your GoDaddy account for support number

---

## 🎉 **Expected Final Result**

Once everything is configured:

1. **`https://miniworldpk.com`** → Your live MiniWorld e-commerce site
2. **`https://www.miniworldpk.com`** → Redirects to main site
3. **SSL Certificate** → Automatic and secure
4. **Email Domain** → Ready for professional emails
5. **Global CDN** → Fast loading worldwide via Netlify

Your MiniWorld e-commerce platform will be fully production-ready with your custom domain! 🚀

---

## ⏭️ **Next Steps After Domain Setup**

1. **Test thoroughly** - Check all functionality
2. **Set up monitoring** - Track site performance
3. **Configure analytics** - Google Analytics, etc.
4. **Marketing setup** - Social media, SEO optimization
5. **Business operations** - Payment processing, order management

Your professional e-commerce website is ready for customers! 🛍️ 