@echo off
chcp 65001 >nul
echo ========================================
echo 熠达通 - 每日数据自动更新
echo ========================================
echo.

cd /d "C:\Users\apple\.qclaw\workspace\email-daily-bid"

echo [1/3] 抓取今日招标数据...
call node fetch-all.js
if %errorlevel% neq 0 (
    echo ❌ 数据抓取失败
    pause
    exit /b 1
)
echo ✓ 数据抓取完成

echo.
echo [2/3] 复制数据到工作台...
copy /Y "C:\Users\apple\Desktop\今日招标汇总.html" "C:\Users\apple\.qclaw\workspace\bid-workflow-app\daily-bids.html" >nul
echo ✓ 数据已复制

echo.
echo [3/3] 推送到 GitHub...
cd /d "C:\Users\apple\.qclaw\workspace\bid-workflow-app"
git add daily-bids.json daily-bids.html 2>nul
git commit -m "自动更新招标数据 %date%" 2>nul
git push origin main 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ 推送失败，可能需要手动推送
) else (
    echo ✓ 已推送到 GitHub
)

echo.
echo ========================================
echo ✓ 完成！网站将在 1-2 分钟后更新
echo 网址: https://funnylili.github.io/yidatong/
echo ========================================
