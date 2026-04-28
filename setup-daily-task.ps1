# 熠达通每日数据抓取 - Windows任务计划程序设置
# 每天早上9点自动抓取招标数据

$taskName = "YidaTong_DailyFetch"
$scriptPath = "C:\Users\apple\.qclaw\workspace\bid-workflow-app\fetch-daily.py"
$desc = "熠达通每日招标数据抓取"

# 检查是否已存在
$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Task already exists, removing..."
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# 创建任务动作
$action = New-ScheduledTaskAction -Execute "python" -Argument $scriptPath -WorkingDirectory "C:\Users\apple\.qclaw\workspace\bid-workflow-app"

# 创建触发器 - 每天早上9点
$trigger = New-ScheduledTaskTrigger -Daily -At "9:00 AM"

# 创建任务设置
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

# 注册任务
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description $desc

Write-Host "Scheduled task created: $taskName"
Write-Host "Runs daily at 9:00 AM"
