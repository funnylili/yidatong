@echo off
chcp 65001 >nul
echo ==========================================
echo  熠达通 - 本地服务器启动器
echo ==========================================
echo.

:: 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python，请确保已安装 Python 3.x
    pause
    exit /b 1
)

echo [1/3] Python 检测通过
echo.

:: 启动服务器
echo [2/3] 正在启动本地服务器...
echo.
cd /d "%~dp0"
start "" "http://localhost:8080"
python server.py

pause
