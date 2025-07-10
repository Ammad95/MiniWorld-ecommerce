@echo off
echo ==========================================
echo    MiniWorld GitHub Integration Setup
echo ==========================================
echo.

echo [1/4] Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Git is already installed!
    git --version
) else (
    echo ❌ Git is not installed
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

echo.
echo [2/4] Checking Git configuration...
git config --global user.name >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Git user configured: %git config --global user.name%
) else (
    echo ❌ Git user not configured
    echo.
    set /p username="Enter your name: "
    set /p email="Enter your email: "
    git config --global user.name "%username%"
    git config --global user.email "%email%"
    echo ✅ Git configured successfully!
)

echo.
echo [3/4] Initializing Git repository...
if exist ".git" (
    echo ✅ Git repository already exists
) else (
    git init
    echo ✅ Git repository initialized
)

echo.
echo [4/4] Next steps:
echo.
echo 1. Create GitHub repository at: https://github.com/new
echo    - Repository name: miniworld-ecommerce
echo    - Description: MiniWorld - Futuristic Baby Products E-commerce Site
echo    - Make it PUBLIC (for free hosting)
echo    - Don't initialize with README
echo.
echo 2. Copy your repository URL (e.g., https://github.com/yourusername/miniworld-ecommerce.git)
echo.
echo 3. Run these commands:
echo    git remote add origin YOUR_REPOSITORY_URL
echo    git add .
echo    git commit -m "Initial commit: MiniWorld E-commerce Site"
echo    git push -u origin main
echo.
echo 4. Connect with Netlify for auto-deployment
echo    - Go to netlify.com
echo    - New site from Git
echo    - Select your GitHub repository
echo    - Deploy!
echo.
echo Read GITHUB-SETUP-GUIDE.md for complete instructions
echo.
pause 