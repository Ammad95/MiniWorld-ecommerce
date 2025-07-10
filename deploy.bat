@echo off
echo ==========================================
echo    MiniWorld E-commerce Deployment
echo    Domain: miniworldpk.com
echo ==========================================
echo.

echo [1/3] Building production version...
call .\node-v20.11.0-win-x64\npm.cmd run build

echo.
echo [2/3] Checking build output...
if exist "dist" (
    echo ✅ Build successful! Files ready in 'dist' folder
) else (
    echo ❌ Build failed! Check the output above
    pause
    exit /b 1
)

echo.
echo [3/3] Deployment ready for miniworldpk.com!
echo.
echo NEXT STEPS:
echo 1. Go to netlify.com and create account
echo 2. Drag and drop the 'dist' folder to deploy
echo 3. Copy your Netlify URL (e.g., amazing-name-123.netlify.app)
echo 4. Update GoDaddy DNS for miniworldpk.com
echo 5. Add miniworldpk.com to Netlify domain settings
echo.
echo IMPORTANT: Read DEPLOYMENT-GUIDE.md for complete instructions
echo.
echo Your MiniWorld e-commerce site is ready for miniworldpk.com! 🚀
echo.
pause 