@echo off
chcp 65001 >nul
title YidaTong

echo.
echo ========================================
echo.
echo        YidaTong - Loading...
echo.
echo ========================================
echo.

set APP_DIR=%~dp0
set HTML_FILE=%APP_DIR%index.html

:: Open with Edge in app mode (removes browser UI)
start "" "msedge.exe" "--app=%HTML_FILE%" "--window-size=1400,900" "--center-location"

exit