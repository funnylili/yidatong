@echo off
chcp 65001 >nul
title YidaTong - Public Server
echo.
echo  ==========================================
echo    YidaTong - Public Deployment
echo  ==========================================
echo.
echo  Step 1: Start local HTTP server
echo  Step 2: Create public tunnel
echo.
echo  NOTE: Close this window to stop server
echo  ==========================================
echo.
cd /d "%~dp0"
python tunnel.py
pause
