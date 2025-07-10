# 🚀 GitHub Integration Guide for MiniWorld

## **Step 1: Install Git (5 minutes)**

### Option A: Install Git for Windows (Recommended)
1. **Download Git**: Go to [git-scm.com](https://git-scm.com/download/win)
2. **Run the installer** with default settings
3. **Restart your terminal** after installation
4. **Test installation**: Run `git --version` in PowerShell

### Option B: Install using Chocolatey (if you have it)
```powershell
choco install git
```

### Option C: Install using Winget (Windows 10+)
```powershell
winget install Git.Git
```

## **Step 2: Configure Git (2 minutes)**

After installing Git, configure it with your details:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## **Step 3: Create GitHub Repository (3 minutes)**

1. **Go to GitHub**: [github.com](https://github.com)
2. **Sign in** or create account
3. **Click "New repository"**
4. **Repository settings**:
   - Name: `miniworld-ecommerce`
   - Description: `MiniWorld - Futuristic Baby Products E-commerce Site`
   - Set to **Public** (for free hosting)
   - **Don't** initialize with README (we have our own)
5. **Click "Create repository"**
6. **Copy the repository URL** (e.g., `https://github.com/yourusername/miniworld-ecommerce.git`)

## **Step 4: Initialize Git in Your Project**

Run these commands in your MiniWorld directory:

```powershell
# Initialize Git repository
git init

# Add your remote repository
git remote add origin https://github.com/yourusername/miniworld-ecommerce.git

# Add all files to Git
git add .

# Create initial commit
git commit -m "Initial commit: MiniWorld E-commerce Site"

# Push to GitHub
git push -u origin main
```

## **Step 5: Connect GitHub with Netlify (Auto-Deploy)**

1. **Go to Netlify**: [netlify.com](https://netlify.com)
2. **Click "New site from Git"**
3. **Choose GitHub** and authorize Netlify
4. **Select your repository**: `miniworld-ecommerce`
5. **Build settings** (auto-detected from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20`
6. **Click "Deploy site"**

## **Step 6: Configure Domain (miniworldpk.com)**

1. **In Netlify**: Site settings → Domain management
2. **Add custom domain**: `miniworldpk.com`
3. **Also add**: `www.miniworldpk.com`
4. **Enable HTTPS**: Automatic and free

## **Step 7: Update GoDaddy DNS**

In your GoDaddy DNS settings for miniworldpk.com:

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

## **🎯 Benefits of GitHub Integration**

### **Automatic Deployments**
- Every push to `main` branch auto-deploys to miniworldpk.com
- No manual uploads needed
- Instant previews for all changes

### **Version Control**
- Track all changes and history
- Rollback to previous versions easily
- Collaborate with team members

### **Professional Workflow**
- Separate branches for features
- Pull requests for code review
- Continuous integration/deployment

## **🔄 Daily Workflow After Setup**

```powershell
# Make changes to your code
# Save files

# Add changes to Git
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub (auto-deploys to miniworldpk.com)
git push origin main
```

## **🌟 Your URLs After Setup**

- **Live Site**: https://miniworldpk.com
- **GitHub Repository**: https://github.com/yourusername/miniworld-ecommerce
- **Netlify Dashboard**: https://app.netlify.com/sites/your-site-name

## **📋 Environment Variables for Netlify**

For your AWS integration, add these in Netlify:

1. **Go to**: Site settings → Environment variables
2. **Add these variables**:
   ```
   VITE_AWS_ACCESS_KEY_ID=your_aws_access_key
   VITE_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   VITE_AWS_REGION=us-east-1
   VITE_S3_BUCKET_NAME=miniworldpk-products-images
   VITE_CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net
   ```

## **🔐 Security Best Practices**

### **Files to Never Commit**
- `aws-config-template.json` (with real credentials)
- `node_modules/` (excluded in .gitignore)
- `.env` files with secrets
- Personal API keys

### **What's Safe to Commit**
- All your source code
- Configuration files
- Documentation
- Public assets

## **🆘 Troubleshooting**

### **Common Issues**
1. **Git not found**: Restart terminal after Git installation
2. **Permission denied**: Use SSH key or personal access token
3. **Build failed**: Check Node.js version in Netlify settings
4. **Domain not working**: Verify DNS propagation (24-48 hours)

### **Support Commands**
```powershell
# Check Git status
git status

# View commit history
git log --oneline

# Check remote repository
git remote -v

# Force push (use carefully)
git push -f origin main
```

## **🎉 Success!**

After completing these steps:
- ✅ Your code is version-controlled on GitHub
- ✅ Automatic deployments to miniworldpk.com
- ✅ Professional development workflow
- ✅ Backup of your entire project
- ✅ Easy collaboration and updates

**Your MiniWorld e-commerce site will auto-deploy to miniworldpk.com with every code change!** 