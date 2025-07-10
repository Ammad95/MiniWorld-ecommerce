# PowerShell script for GitHub setup
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   MiniWorld GitHub Setup (PowerShell)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "[1/7] Checking if Git is installed..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    Write-Host "✅ Git is installed!" -ForegroundColor Green
    Write-Host "$gitVersion" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Download and install Git for Windows" -ForegroundColor White
    Write-Host "3. Restart this terminal after installation" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Git configuration
Write-Host ""
Write-Host "[2/7] Checking Git configuration..." -ForegroundColor Yellow
try {
    $userName = git config --global user.name 2>$null
    if ($userName) {
        Write-Host "✅ Git already configured for: $userName" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Git user not configured" -ForegroundColor Red
        $username = Read-Host "Enter your name"
        $email = Read-Host "Enter your email"
        git config --global user.name "$username"
        git config --global user.email "$email"
        Write-Host "✅ Git configured successfully!" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Error configuring Git" -ForegroundColor Red
}

# Initialize Git repository
Write-Host ""
Write-Host "[3/7] Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
}
else {
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

# Add remote repository
Write-Host ""
Write-Host "[4/7] Adding remote repository..." -ForegroundColor Yellow
try {
    $remoteUrl = git remote get-url origin 2>$null
    if ($remoteUrl) {
        Write-Host "✅ Remote repository already exists: $remoteUrl" -ForegroundColor Green
    }
    else {
        git remote add origin https://github.com/Ammad95/MiniWorld-ecommerce.git
        Write-Host "✅ Remote repository added" -ForegroundColor Green
    }
}
catch {
    git remote add origin https://github.com/Ammad95/MiniWorld-ecommerce.git
    Write-Host "✅ Remote repository added" -ForegroundColor Green
}

# Create main branch
Write-Host ""
Write-Host "[5/7] Creating main branch..." -ForegroundColor Yellow
try {
    git checkout -b main 2>$null
    Write-Host "✅ Created and switched to main branch" -ForegroundColor Green
}
catch {
    try {
        git checkout main 2>$null
        Write-Host "✅ Already on main branch" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Could not create or switch to main branch" -ForegroundColor Red
        Write-Host "Current branch:" -ForegroundColor Yellow
        git branch
    }
}

# Add files to Git
Write-Host ""
Write-Host "[6/7] Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files added to staging area" -ForegroundColor Green

# Create commit and push
Write-Host ""
Write-Host "[7/7] Creating commit and pushing..." -ForegroundColor Yellow
try {
    git commit -m "Initial commit: MiniWorld E-commerce Site"
    Write-Host "✅ Commit created successfully" -ForegroundColor Green
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    Write-Host ""
    Write-Host "🎉 SUCCESS! Your code is now on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository: https://github.com/Ammad95/MiniWorld-ecommerce" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to netlify.com" -ForegroundColor White
    Write-Host "2. Create 'New site from Git'" -ForegroundColor White
    Write-Host "3. Connect to your GitHub repository" -ForegroundColor White
    Write-Host "4. Deploy to miniworldpk.com" -ForegroundColor White
}
catch {
    Write-Host "❌ Push failed. This might be due to:" -ForegroundColor Red
    Write-Host "1. Repository doesn't exist on GitHub" -ForegroundColor Yellow
    Write-Host "2. No internet connection" -ForegroundColor Yellow
    Write-Host "3. Authentication issues" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please check your GitHub repository:" -ForegroundColor Yellow
    Write-Host "https://github.com/Ammad95/MiniWorld-ecommerce" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Press Enter to exit" 