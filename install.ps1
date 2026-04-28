Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

$bmp = New-Object System.Drawing.Bitmap(256, 256)
$g = [System.Drawing.Graphics]::FromImage($bmp)

$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(256, 256)),
    [System.Drawing.Color]::FromArgb(233, 69, 96),
    [System.Drawing.Color]::FromArgb(199, 62, 84)
)
$g.FillRectangle($brush, 0, 0, 256, 256)

$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 20)
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($pen, 50, 200, 128, 90)
$g.DrawLine($pen, 206, 200, 128, 90)
$g.DrawLine($pen, 128, 90, 128, 170)

$solidBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillEllipse($solidBrush, 115, 75, 26, 26)
$g.Dispose()

$appDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$icoPath = Join-Path $appDir "logo.ico"
$icon = [System.Drawing.Icon]::FromHandle($bmp.GetHicon())
$fileStream = [System.IO.File]::Create($icoPath)
$icon.Save($fileStream)
$fileStream.Close()

$WshShell = New-Object -ComObject WScript.Shell
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "熠达通.lnk"
$batPath = Join-Path $appDir "启动熠达通.bat"

$Shortcut = $WshShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = $batPath
$Shortcut.WorkingDirectory = $appDir
$Shortcut.IconLocation = $icoPath + ",0"
$Shortcut.Save()

Write-Host "OK"