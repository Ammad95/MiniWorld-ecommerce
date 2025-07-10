# 🛠️ Manual GitHub Setup for MiniWorld

## Step-by-Step Manual Setup

### **Step 1: Install Git**
1. Download from: [git-scm.com/download/win](https://git-scm.com/download/win)
2. Install with default settings
3. **Restart your terminal**

### **Step 2: Configure Git**
```powershell
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### **Step 3: Initialize Repository**
```powershell
# Initialize Git repository
git init

# Add your GitHub repository as remote
git remote add origin https://github.com/Ammad95/MiniWorld-ecommerce.git
```

### **Step 4: Create Main Branch and Push**
```powershell
# Create main branch
git checkout -b main

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: MiniWorld E-commerce Site"

# Push to GitHub
git push -u origin main
```

### **Step 5: Verify Success**
- Visit: [github.com/Ammad95/MiniWorld-ecommerce](https://github.com/Ammad95/MiniWorld-ecommerce)
- You should see your code there!

---

## 🎯 **Next Steps After Success:**

1. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - "New site from Git" → Choose GitHub
   - Select your repository
   - Auto-deploy to miniworldpk.com

2. **Daily Workflow**:
   ```powershell
   # Make changes to your code
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

---

## 🆘 **Common Issues:**

### **"Git not recognized" after installation**
- **Solution**: Restart your terminal completely

### **"Permission denied" when pushing**
- **Solution**: GitHub authentication needed
- You may need to enter your GitHub username and password

### **"Repository not found"**
- **Solution**: Make sure your GitHub repository exists and is public
- Check: [github.com/Ammad95/MiniWorld-ecommerce](https://github.com/Ammad95/MiniWorld-ecommerce)

---

**Once Git is installed, follow these manual steps to get your code on GitHub!** 