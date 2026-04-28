@echo off
chcp 65001 >nul
title 熠达通 - 安装到桌面

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║          熠达通 - 安装到桌面                          ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.

set APP_PATH=%~dp0
set DESKTOP=%USERPROFILE%\Desktop
set SHORTCUT=%DESKTOP%\熠达通.lnk
set BAT_FILE=%APP_PATH%启动熠达通.bat
set ICO_FILE=%APP_PATH%logo.ico

echo 正在创建桌面快捷方式...
echo.

:: 创建VBS脚本
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\yd_shortcut.vbs"
echo sLinkFile = "%SHORTCUT%" >> "%TEMP%\yd_shortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\yd_shortcut.vbs"
echo oLink.TargetPath = "%BAT_FILE%" >> "%TEMP%\yd_shortcut.vbs"
echo oLink.WorkingDirectory = "%APP_PATH%" >> "%TEMP%\yd_shortcut.vbs"
echo oLink.Description = "熠达通 - 智能招标工作流系统" >> "%TEMP%\yd_shortcut.vbs"

:: 使用系统图标作为临时方案（红色相关的图标）
echo oLink.IconLocation = "%SystemRoot%\System32\imageres.dll,267" >> "%TEMP%\yd_shortcut.vbs"

echo oLink.Save >> "%TEMP%\yd_shortcut.vbs"

:: 执行VBS
cscript //nologo "%TEMP%\yd_shortcut.vbs"
del "%TEMP%\yd_shortcut.vbs"

echo.
echo ════════════════════════════════════════════════════
echo.
echo   ✅ 安装完成！
echo.
echo   桌面快捷方式：熠达通
echo.
echo   功能模块：
echo   ├─ 工作台首页
echo   ├─ 设计工作台（手稿/绘图/视频）
echo   ├─ 标书制作（AI智能生成）
echo   ├─ 招标信息中心
echo   └─ 华为展厅案例
echo.
echo ════════════════════════════════════════════════════
echo.

:: 询问是否立即启动
set /p START="是否立即启动熠达通？(Y/N): "
if /i "%START%"=="Y" (
    echo.
    echo 正在启动...
    start "" "%SHORTCUT%"
)

echo.
pause