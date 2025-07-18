# MiniWorld Production Deployment Guide

## 🚀 Deploy Your MiniWorld E-commerce Application

### Prerequisites Checklist
Before deploying, ensure you have:
- ✅ GitHub repository with latest code pushed
- ✅ Supabase project set up with database schema
- ✅ Resend account with API key
- ✅ All environment variables configured locally
- ✅ Application tested locally

---

## Step 1: Build for Production

### 1.1 Test Production Build Locally
```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

**Expected Output:**
```
> vite build
✓ built in [time]
dist/index.html                  [size]
dist/assets/index-[hash].js       [size]
dist/assets/index-[hash].css      [size]
```

### 1.2 Verify Build Success
- Check that `dist/` folder is created
- Ensure no build errors
- Test the preview URL works correctly

---

## Step 2: Deploy to Netlify

### Option A: Deploy via GitHub (Recommended)

#### 2.1 Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub (recommended for seamless integration)
3. Authorize Netlify to access your repositories

#### 2.2 Create New Site
1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select your `MiniWorld-ecommerce` repository
4. Configure build settings:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

#### 2.3 Wait for Initial Deploy
- First deployment takes 2-5 minutes
- You'll get a random URL like `https://amazing-cupcake-123456.netlify.app`
- Don't worry about errors yet - we need to configure environment variables

### Option B: Manual Deploy

#### 2.1 Build Locally
```bash
npm run build
```

#### 2.2 Manual Upload
1. Go to [netlify.com](https://netlify.com) → "Sites"
2. Drag and drop your `dist` folder
3. Get temporary URL

---

## Step 3: Configure Environment Variables

### 3.1 Access Site Settings
1. Go to your site dashboard in Netlify
2. Click "Site configuration" → "Environment variables"

### 3.2 Add Production Environment Variables
Add these variables with your real values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAi... (your real anon key)
VITE_RESEND_API_KEY=re_... (your real Resend API key)
VITE_EMAIL_FROM=support@yourdomain.com
VITE_EMAIL_FROM_NAME=MiniWorld Support
VITE_SITE_URL=https://your-custom-domain.com
VITE_APP_ENV=production
```

### 3.3 Deploy with New Variables
1. Click "Save" after adding all variables
2. Go to "Deploys" tab
3. Click "Trigger deploy" → "Deploy site"
4. Wait for deployment to complete

---

## Step 4: Custom Domain Setup

### 4.1 Add Custom Domain
1. In Netlify dashboard, go to "Domain management"
2. Click "Add custom domain"
3. Enter your domain (e.g., `miniworldpk.com`)
4. Click "Verify"

### 4.2 Choose DNS Option

#### Option A: Use Netlify DNS (Easier)
1. Click "Use Netlify DNS"
2. Copy the nameservers provided:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
3. Go to your domain registrar (GoDaddy, Namecheap, etc.)
4. Update nameservers to the Netlify ones
5. Wait 24-48 hours for propagation

#### Option B: Keep Your DNS Provider
1. In your DNS provider, add these records:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app

   Type: A
   Name: @
   Value: 75.2.60.5
   ```
2. Wait for DNS propagation (up to 24 hours)

### 4.3 Enable HTTPS
- HTTPS is automatically enabled with Let's Encrypt
- SSL certificate will be provisioned within 24 hours
- Your site will be accessible via https://yourdomain.com

---

## Step 5: Configure Redirects for React Router

### 5.1 Create _redirects File
In your `public/` folder, create `_redirects`:
```
/*    /index.html   200
```

### 5.2 Or Configure in Netlify
1. Go to "Site configuration" → "Redirects and rewrites"
2. Add rule:
   - **From**: `/*`
   - **To**: `/index.html`
   - **Status**: `200`

---

## Step 6: Update Production URLs

### 6.1 Update VITE_SITE_URL
1. Go back to "Environment variables"
2. Update `VITE_SITE_URL` to your custom domain
3. Redeploy the site

### 6.2 Update Supabase Settings
1. In Supabase dashboard → "Settings" → "API"
2. Update "Site URL" to your production domain
3. Add your domain to "Redirect URLs" if using auth

### 6.3 Update Resend Domain
1. In Resend dashboard, verify your custom domain
2. Add DNS records for email authentication:
   ```
   Type: TXT
   Name: @
   Value: resend-domain-verification=your-code

   Type: TXT
   Name: resend._domainkey
   Value: your-dkim-key
   ```

---

## Step 7: Testing Production Deployment

### 7.1 Functionality Tests
- ✅ Homepage loads correctly
- ✅ Product browsing works
- ✅ Add to cart functionality
- ✅ Guest checkout process
- ✅ Email confirmations sent
- ✅ Admin login works
- ✅ Admin panel accessible
- ✅ Order management functions

### 7.2 Performance Tests
- ✅ Page load speed < 3 seconds
- ✅ Mobile responsiveness
- ✅ Images load properly
- ✅ No console errors

### 7.3 SEO and Analytics
- ✅ Meta tags present
- ✅ Favicon displays
- ✅ Google Analytics (if configured)

---

## Step 8: Monitoring and Maintenance

### 8.1 Set Up Monitoring
1. **Netlify Analytics**: Enable in site settings
2. **Uptime Monitoring**: Use UptimeRobot or similar
3. **Error Tracking**: Consider Sentry for React apps

### 8.2 Regular Maintenance
- Monitor Supabase usage and limits
- Check Resend email delivery rates
- Update dependencies monthly
- Backup Supabase data regularly

---

## Troubleshooting Common Issues

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

### Environment Variable Issues
- Ensure all `VITE_` prefixed variables are set
- Check for typos in variable names
- Verify values don't have extra spaces

### Domain Not Working
- Check DNS propagation: `nslookup yourdomain.com`
- Verify SSL certificate status in Netlify
- Clear browser cache and try incognito mode

### Email Not Sending
- Verify Resend API key is correct
- Check domain verification status
- Ensure `VITE_EMAIL_FROM` uses verified domain

---

## Success Checklist

- [ ] ✅ Code pushed to GitHub
- [ ] ✅ Netlify site created and deployed
- [ ] ✅ Environment variables configured
- [ ] ✅ Custom domain added and DNS configured
- [ ] ✅ HTTPS enabled and working
- [ ] ✅ React Router redirects working
- [ ] ✅ All functionality tested
- [ ] ✅ Admin panel accessible
- [ ] ✅ Email confirmations working
- [ ] ✅ Performance optimized
- [ ] ✅ Monitoring set up

---

## Live URLs

**Production Site**: https://yourdomain.com  
**Admin Panel**: https://yourdomain.com/admin  
**GitHub Repository**: https://github.com/Ammad95/MiniWorld-ecommerce  
**Netlify Dashboard**: https://app.netlify.com/sites/your-site-name  

---

## Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **Resend Docs**: https://resend.com/docs
- **React Router**: https://reactrouter.com

**Your MiniWorld e-commerce application is now live in production! 🎉** 