@echo off
chcp 65001 >nul
echo ==========================================
echo  熠达通 - 公网部署
echo ==========================================
echo.

:: 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python
    pause
    exit /b 1
)

:: 启动本地服务器
echo [1/3] 启动本地服务器...
start "YidaTong Server" cmd /k "cd /d %~dp0 && python server.py"

:: 等待服务器启动
timeout /t 2 /nobreak >nul

echo [2/3] 本地服务器已启动: http://localhost:8080
echo.

:: 尝试使用 serveo.net（通过SSH）
echo [3/3] 正在创建公网链接...
echo    (使用 serveo.net 免费服务)
echo.
echo ==========================================
echo  按 Ctrl+C 停止公网访问
echo ==========================================
echo.

ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -R 80:localhost:8080 serveo.net

pause
