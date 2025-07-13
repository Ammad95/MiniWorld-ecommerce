@echo off
echo Adding Windows Firewall Rule for Vite Development Server...
echo.
echo This script needs to be run as Administrator
echo Right-click and select "Run as administrator"
echo.
netsh advfirewall firewall add rule name="Vite Dev Server - Port 3000" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Vite Dev Server - Port 3001" dir=in action=allow protocol=TCP localport=3001  
netsh advfirewall firewall add rule name="Vite Dev Server - Port 3002" dir=in action=allow protocol=TCP localport=3002
echo.
echo Firewall rules added successfully!
echo Your development server should now be accessible from other devices on your network.
echo.
echo Local URL: http://localhost:3000
echo Network URL: http://192.168.18.183:3000
echo.
pause 