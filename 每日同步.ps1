# 熠达通每日自动同步脚本
# 每天自动抓取招标数据并推送到 GitHub

$ErrorActionPreference = "Stop"

# 设置 PATH 包含 Git
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 工作目录
$workDir = "$env:USERPROFILE\.qclaw\workspace\bid-workflow-app"
Set-Location $workDir

# 日志文件
$logFile = "$workDir\sync.log"
function Write-Log {
    param($message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "[$timestamp] $message" | Out-File -FilePath $logFile -Append -Encoding UTF8
}

Write-Log "=== 开始每日同步 ==="

try {
    # 1. 运行抓取脚本获取最新招标数据
    Write-Log "正在抓取招标数据..."
    $fetchResult = & node "$env:USERPROFILE\.qclaw\workspace\email-daily-bid\fetch-all.js" 2>&1
    Write-Log "抓取完成: $fetchResult"
    
    # 2. Git 操作
    Write-Log "开始 Git 操作..."
    
    # 检查是否有变更
    $status = & git status --porcelain 2>&1
    if ($status -eq "") {
        Write-Log "没有变更，无需提交"
    } else {
        # 添加所有变更
        & git add . 2>&1
        Write-Log "已添加变更文件"
        
        # 提交
        $commitMsg = "每日更新 $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        & git commit -m $commitMsg 2>&1
        Write-Log "已提交: $commitMsg"
        
        # 推送
        $pushResult = & "D:\新建文件夹\Git\bin\bash.exe" -c "cd ~/.qclaw/workspace/bid-workflow-app && git push" 2>&1
        Write-Log "推送结果: $pushResult"
    }
    
    Write-Log "=== 同步完成 ==="
} catch {
    Write-Log "错误: $_"
    exit 1
}
