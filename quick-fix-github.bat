@echo off
echo ==========================================
echo    Quick Fix for GitHub Push Error
echo ==========================================
echo.

echo [1/7] Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git for Windows
    echo 3. Restart this terminal after installation
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed!
git --version

echo.
echo [2/7] Checking Git configuration...
git config --global user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git user not configured
    echo.
    set /p username="Enter your name: "
    set /p email="Enter your email: "
    git config --global user.name "%username%"
    git config --global user.email "%email%"
    echo ✅ Git configured successfully!
) else (
    echo ✅ Git already configured
)

echo.
echo [3/7] Initializing Git repository...
if exist ".git" (
    echo ✅ Git repository already exists
) else (
    git init
    echo ✅ Git repository initialized
)

echo.
echo [4/7] Adding remote repository...
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    git remote add origin https://github.com/Ammad95/MiniWorld-ecommerce.git
    echo ✅ Remote repository added
) else (
    echo ✅ Remote repository already exists
)

echo.
echo [5/7] Creating main branch...
git checkout -b main >nul 2>&1
if %errorlevel% neq 0 (
    git checkout main >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Could not create or switch to main branch
        echo Current branch:
        git branch
    ) else (
        echo ✅ Already on main branch
    )
) else (
    echo ✅ Created and switched to main branch
)

echo.
echo [6/7] Adding files to Git...
git add .
if %errorlevel% == 0 (
    echo ✅ Files added to staging area
) else (
    echo ❌ Failed to add files
    exit /b 1
)

echo.
echo [7/7] Creating commit and pushing...
git commit -m "Initial commit: MiniWorld E-commerce Site"
if %errorlevel% == 0 (
    echo ✅ Commit created successfully
    echo.
    echo Pushing to GitHub...
    git push -u origin main
    if %errorlevel% == 0 (
        echo.
        echo 🎉 SUCCESS! Your code is now on GitHub!
        echo.
        echo Repository: https://github.com/Ammad95/MiniWorld-ecommerce
        echo.
        echo Next steps:
        echo 1. Go to netlify.com
        echo 2. Create "New site from Git"
        echo 3. Connect to your GitHub repository
        echo 4. Deploy to miniworldpk.com
        echo.
    ) else (
        echo ❌ Push failed. This might be due to:
        echo 1. Repository doesn't exist on GitHub
        echo 2. No internet connection
        echo 3. Authentication issues
        echo.
        echo Please check your GitHub repository:
        echo https://github.com/Ammad95/MiniWorld-ecommerce
    )
) else (
    echo ❌ Commit failed. This might be because:
    echo 1. No files to commit
    echo 2. Git not configured properly
    echo.
    echo Current status:
    git status
)

echo.
pause 