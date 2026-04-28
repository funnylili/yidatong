Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

# 创建一个简单的红色Y字母图标
$bmp = New-Object System.Drawing.Bitmap(256, 256)
$g = [System.Drawing.Graphics]::FromImage($bmp)

# 红色渐变背景
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(256, 256)),
    [System.Drawing.Color]::FromArgb(233, 69, 96),
    [System.Drawing.Color]::FromArgb(199, 62, 84)
)
$g.FillRectangle($brush, 0, 0, 256, 256)

# 白色Y字母
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 20)
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Y的两条上臂
$g.DrawLine($pen, 50, 200, 128, 90)
$g.DrawLine($pen, 206, 200, 128, 90)

# Y的下部
$g.DrawLine($pen, 128, 90, 128, 170)

# 顶部圆点
$solidBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillEllipse($solidBrush, 115, 75, 26, 26)

$g.Dispose()

# 保存为ICO
$icoPath = "$PSScriptRoot\logo.ico"
$icon = [System.Drawing.Icon]::FromHandle($bmp.GetHicon())
$fileStream = [System.IO.File]::Create($icoPath)
$icon.Save($fileStream)
$fileStream.Close()

Write-Host "图标已创建: $icoPath"

# 创建桌面快捷方式
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\熠达通.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\启动熠达通.bat"
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Description = "熠达通 - 智能招标工作流系统"
$Shortcut.IconLocation = "$icoPath,0"
$Shortcut.Save()

Write-Host ""
Write-Host "✅ 桌面快捷方式已创建！"
Write-Host ""
Write-Host "双击桌面上的 '熠达通' 图标启动应用"
Write-Host ""