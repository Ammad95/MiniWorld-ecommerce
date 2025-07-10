# MiniWorld E-commerce Deployment Guide
## Domain: miniworldpk.com

## 🚀 Complete Setup Steps

### Step 1: Account Creation (FREE)

#### A. Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up" 
3. Choose "GitHub" (recommended) or "Email"
4. Complete account setup

#### B. Create AWS Account (for image storage)
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create AWS Account"
3. Enter email and create password
4. Choose "Personal" account type
5. Enter credit card (required but FREE tier covers your needs)
6. Complete phone verification

### Step 2: Deploy Website to Netlify

#### Method 1: Drag & Drop (Easiest)
1. Log into your Netlify account
2. Go to "Sites" in dashboard
3. Drag and drop your entire `dist` folder
4. Your site will be live at: `https://random-name.netlify.app`
5. **IMPORTANT**: Copy the exact site URL (e.g., `amazing-euler-123456.netlify.app`)

#### Method 2: GitHub (Recommended for updates)
1. Create GitHub account if you don't have one
2. Create new repository called "miniworld-ecommerce"
3. Upload your project files to GitHub
4. In Netlify, click "New site from Git"
5. Choose GitHub and select your repository
6. Build settings will be auto-detected from netlify.toml

### Step 3: Configure Your GoDaddy Domain (miniworldpk.com)

#### A. Update DNS Settings in GoDaddy
1. Log into your GoDaddy account
2. Go to "My Products" → "All Products and Services"
3. Find "miniworldpk.com" and click "DNS"
4. **Delete any existing A records for @ and www**
5. Add these NEW records:

**Record 1:**
```
Type: CNAME
Name: www
Value: YOUR-NETLIFY-SITE-NAME.netlify.app
TTL: 1 Hour
```

**Record 2:**
```
Type: CNAME
Name: @
Value: YOUR-NETLIFY-SITE-NAME.netlify.app
TTL: 1 Hour
```

**IMPORTANT**: Replace `YOUR-NETLIFY-SITE-NAME` with your actual Netlify site name!

#### B. Add Domain to Netlify
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter: `miniworldpk.com`
4. Click "Verify DNS configuration"
5. Also add: `www.miniworldpk.com`
6. Enable HTTPS (automatic and free)
7. Set `miniworldpk.com` as primary domain

### Step 4: Set Up AWS S3 for Image Storage

#### A. Create S3 Bucket
1. Log into AWS Console
2. Search for "S3" and click it
3. Click "Create bucket"
4. Name: `miniworldpk-products-images`
5. Region: Choose closest to your customers (recommended: us-east-1)
6. Uncheck "Block all public access"
7. Click "Create bucket"

#### B. Configure Bucket Policy
1. Click on your bucket name
2. Go to "Permissions" tab
3. Click "Bucket policy"
4. Add this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::miniworldpk-products-images/*"
    }
  ]
}
```

#### C. Enable Static Website Hosting
1. Go to "Properties" tab
2. Scroll to "Static website hosting"
3. Click "Edit"
4. Enable "Use this bucket to host a website"
5. Save changes

### Step 5: Set Up CloudFront CDN

1. In AWS Console, search for "CloudFront"
2. Click "Create Distribution"
3. Origin Domain: Select your S3 bucket `miniworldpk-products-images`
4. Origin Access: "Origin access control settings"
5. Create OAC and select it
6. Default root object: `index.html`
7. Click "Create distribution"
8. Wait 10-15 minutes for deployment
9. **Copy the CloudFront domain name** (e.g., `d1234567890.cloudfront.net`)

### Step 6: Configure Image Upload System

Your admin panel will need these AWS credentials:
- AWS Access Key ID: (from IAM user)
- AWS Secret Access Key: (from IAM user)
- S3 Bucket Name: `miniworldpk-products-images`
- CloudFront Distribution URL: `https://YOUR-CLOUDFRONT-DOMAIN.cloudfront.net`

## 📊 Cost Summary

### Monthly Costs:
- **Netlify**: FREE (up to 100GB bandwidth)
- **AWS S3**: ~$0.023 per GB stored
- **CloudFront**: ~$0.085 per GB transferred
- **Total for 1000 images (10GB)**: ~$1-3/month

### Example:
- Store 1000 product images (10GB): $0.23/month
- Serve 100GB of images: $8.50/month
- **Total**: Under $10/month for substantial traffic

## 🔧 DNS Propagation Timeline

After updating GoDaddy DNS:
- **1-2 hours**: Most users will see your site
- **4-24 hours**: Full global propagation
- **You can test**: Use [whatsmydns.net](https://whatsmydns.net) to check propagation

## 🌟 Your Live URLs

After DNS propagation, your site will be available at:
- **https://miniworldpk.com** (primary)
- **https://www.miniworldpk.com** (redirects to primary)

## 🔧 Next Steps After Deployment

1. **Test your live site** at miniworldpk.com
2. **Upload test images** to S3
3. **Configure admin panel** with AWS credentials
4. **Set up email notifications** for orders
5. **Add Google Analytics** for tracking

## 🆘 Support

If you encounter any issues:
1. Check Netlify deployment logs
2. Verify DNS settings with GoDaddy
3. Test S3 bucket permissions
4. Check CloudFront distribution status

## 🎯 Ready to Launch!

Your MiniWorld e-commerce site will be:
- ✅ Fast and globally distributed
- ✅ Secure with HTTPS
- ✅ Available at miniworldpk.com
- ✅ Scalable for growth
- ✅ Cost-effective
- ✅ Professional quality

**Your production build is ready in the `dist` folder. Let's go live!** 