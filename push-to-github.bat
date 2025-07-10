@echo off
echo ==========================================
echo    Push MiniWorld to GitHub
echo ==========================================
echo.

echo [1/4] Checking Git status...
git status
if %errorlevel% neq 0 (
    echo ❌ Not a Git repository. Run setup-github.bat first.
    pause
    exit /b 1
)

echo.
echo [2/4] Adding all files to Git...
git add .
echo ✅ Files added to Git

echo.
echo [3/4] Creating commit...
set /p message="Enter commit message (or press Enter for default): "
if "%message%"=="" set message=Update MiniWorld E-commerce Site

git commit -m "%message%"
echo ✅ Commit created

echo.
echo [4/4] Pushing to GitHub...
git push origin main
if %errorlevel% == 0 (
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo Your changes are now live on GitHub and will auto-deploy to miniworldpk.com
    echo if you have Netlify connected.
) else (
    echo ❌ Push failed. Make sure you have:
    echo 1. Created GitHub repository
    echo 2. Added remote origin: git remote add origin YOUR_REPO_URL
    echo 3. Set up authentication (GitHub login)
    echo.
    echo Run 'git remote -v' to check your remote repository
)

echo.
pause 