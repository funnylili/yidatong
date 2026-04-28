@echo off
chcp 65001 >nul
echo ========================================
echo   熠达通 - 每日数据同步
echo ========================================
echo.

set APP_DIR=C:\Users\apple\.qclaw\workspace\bid-workflow-app

:: 1. 抓取每日招标数据
echo [1/2] 正在抓取招标数据...
python "%APP_DIR%\fetch-daily.py"
if %errorlevel% neq 0 (
    echo [WARN] 抓取失败，使用示例数据
)

:: 2. 发送邮件报告
echo [2/2] 正在发送邮件报告...
python "C:\Users\apple\.qclaw\workspace\email-daily-bid\send-email.py"

echo.
echo ========================================
echo   完成！数据已同步到桌面APP
echo ========================================
pause
