# 🚀 Quick Start Guide for miniworldpk.com

## **Step 1: Deploy to Netlify (5 minutes)**

1. **Go to netlify.com** and create a free account
2. **Drag and drop** the `dist` folder from your project
3. **Copy your Netlify URL** (e.g., `amazing-name-123.netlify.app`)
4. **Test your site** - it should be live immediately!

## **Step 2: Connect Your Domain (5 minutes)**

### A. In Netlify:
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter: `miniworldpk.com`
4. Click **Verify DNS configuration**
5. Also add: `www.miniworldpk.com`

### B. In GoDaddy:
1. Log into your GoDaddy account
2. Go to **My Products** → **DNS**
3. Find **miniworldpk.com** and click **Manage**
4. **Delete any existing A records for @ and www**
5. Add these CNAME records:

```
Type: CNAME
Name: @
Value: YOUR-NETLIFY-SITE-NAME.netlify.app
TTL: 1 Hour

Type: CNAME  
Name: www
Value: YOUR-NETLIFY-SITE-NAME.netlify.app
TTL: 1 Hour
```

**Replace `YOUR-NETLIFY-SITE-NAME` with your actual Netlify site name!**

## **Step 3: Set Up Image Storage (15 minutes)**

### A. Create AWS Account:
1. Go to **aws.amazon.com** and create account
2. Choose **Personal** account type
3. Add payment method (free tier covers your needs)

### B. Create S3 Bucket:
1. Search for **S3** in AWS Console
2. Click **Create bucket**
3. Name: `miniworldpk-products-images`
4. Region: `us-east-1`
5. **Uncheck "Block all public access"**
6. Click **Create bucket**

### C. Create CloudFront Distribution:
1. Search for **CloudFront** in AWS Console
2. Click **Create Distribution**
3. Origin Domain: Select your S3 bucket
4. Click **Create distribution**
5. **Copy the CloudFront domain** (e.g., `d123456789.cloudfront.net`)

## **⏰ Timeline**

- **Netlify deployment**: Immediate
- **DNS propagation**: 1-2 hours for most users
- **Full global propagation**: 4-24 hours
- **AWS setup**: Works immediately

## **🌟 Your Live URLs**

After DNS propagation:
- **https://miniworldpk.com** (primary)
- **https://www.miniworldpk.com** (redirects to primary)

## **💰 Monthly Costs**

- **Netlify**: FREE
- **AWS (for 1000 images)**: ~$1-3
- **Total**: Under $5/month

## **✅ Success Checklist**

- [ ] Created Netlify account
- [ ] Deployed site to Netlify
- [ ] Added miniworldpk.com to Netlify
- [ ] Updated GoDaddy DNS settings
- [ ] Created AWS account
- [ ] Set up S3 bucket
- [ ] Created CloudFront distribution
- [ ] Tested live site

## **🆘 Need Help?**

If anything doesn't work:
1. Check the detailed `DEPLOYMENT-GUIDE.md`
2. Verify DNS propagation at whatsmydns.net
3. Check Netlify deployment logs
4. Test S3 bucket permissions

**Your MiniWorld e-commerce site will be live at miniworldpk.com!** 🎉 