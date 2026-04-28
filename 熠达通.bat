@echo off
chcp 65001 >nul
title 熠达通

echo.
echo ========================================
echo.
echo     熠达通 - 智能招投标助手
echo.
echo ========================================
echo.

set APP_DIR=%~dp0
set HTML_FILE=%APP_DIR%index.html

:: Launch with Edge in app mode (fullscreen, no browser UI)
start "" "msedge.exe" "--app=%HTML_FILE%" "--window-size=1280,800" "--center-location"

exit
