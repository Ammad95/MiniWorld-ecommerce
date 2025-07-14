# Domain Migration Guide: Complete Switch to minihubpk.com

## 🎯 **Migration Overview**

You're switching your live e-commerce website from `miniworldpk.com` to `minihubpk.com`. The old domain will be completely removed - no redirects.

## 📋 **Migration Checklist**

### **Phase 1: Add New Domain to Netlify**
- [ ] Go to Netlify Dashboard → Domain management → Domains
- [ ] Click "Add domain alias" 
- [ ] Enter: `minihubpk.com`
- [ ] Click "Add domain"

### **Phase 2: Configure DNS for New Domain**

#### **Option A: Use Netlify DNS (Recommended)**
- [ ] Go to GoDaddy → Domain management → `minihubpk.com`
- [ ] Navigate to "Nameservers" section
- [ ] Change nameservers to:
  - `dns1.p05.nsone.net`
  - `dns2.p05.nsone.net`
  - `dns3.p05.nsone.net`
  - `dns4.p05.nsone.net`
- [ ] Save changes

#### **Option B: Manual DNS Records**
- [ ] Go to GoDaddy → Domain management → `minihubpk.com`
- [ ] Navigate to "DNS" section
- [ ] Add A record: `@` → `75.2.60.5`
- [ ] Add CNAME record: `www` → `clear-faun-c16c4c.netlify.app`
- [ ] Save changes

### **Phase 3: Set Primary Domain in Netlify**
- [ ] Go to Netlify Dashboard → Domain management → Domains
- [ ] Find `minihubpk.com` in the list
- [ ] Click "Options" → "Set as primary domain"
- [ ] Remove old domain: Click "Options" on `miniworldpk.com` → "Remove domain"

### **Phase 4: Wait for DNS Propagation**
- [ ] Wait 30-60 minutes for DNS to propagate
- [ ] Test: `http://minihubpk.com` should work
- [ ] Test: `https://minihubpk.com` should work with SSL

### **Phase 5: Provision SSL Certificate**
- [ ] Go to Netlify Dashboard → Domain management → HTTPS
- [ ] Click "Provision certificate" for `minihubpk.com`
- [ ] Wait for SSL provisioning (2-10 minutes)

## 🔍 **Verification Steps**

### **Test DNS Resolution**
```bash
nslookup minihubpk.com
```
Should return: `75.2.60.5`

### **Test Website Access**
- [ ] `http://minihubpk.com` → Should load your website
- [ ] `https://minihubpk.com` → Should load with SSL (after certificate provisioning)
- [ ] `https://www.minihubpk.com` → Should load with SSL

## 🚨 **Important Notes**

1. **No Redirects**: The old domain `miniworldpk.com` will NOT redirect to the new domain
2. **Update Bookmarks**: Users will need to update bookmarks and saved links
3. **Update Marketing**: Update all marketing materials, social media, business cards
4. **SEO Impact**: You may temporarily lose SEO ranking until Google reindexes the new domain

## 🎯 **Expected Timeline**

- **Domain addition**: Immediate
- **DNS propagation**: 30-60 minutes
- **SSL provisioning**: 2-10 minutes
- **Full migration**: 1-2 hours total

## 💡 **Post-Migration Checklist**

- [ ] Update Google Analytics (if using)
- [ ] Update Google Search Console
- [ ] Update social media profiles
- [ ] Update business cards/marketing materials
- [ ] Notify customers of domain change
- [ ] Update any third-party services using the old domain

## 🆘 **Troubleshooting**

### **Domain not resolving**
- Check nameservers are correct
- Wait longer for DNS propagation
- Try different DNS servers: `nslookup minihubpk.com 8.8.8.8`

### **SSL certificate issues**
- Ensure DNS is working first
- Try "Verify DNS configuration" in Netlify
- Wait and retry SSL provisioning

### **Website not loading**
- Check if domain is set as primary in Netlify
- Verify DNS records are correct
- Check deployment status in Netlify

## ✅ **Migration Complete!**

Once all steps are complete, your website will be fully operational at `minihubpk.com` with no connection to the old domain. 