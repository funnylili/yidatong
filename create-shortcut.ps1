$s = (New-Object -COM WScript.Shell).CreateShortcut("C:\Users\apple\Desktop\熠达通招标.lnk")
$s.TargetPath = "msedge.exe"
$s.Arguments = "--app=C:\Users\apple\.qclaw\workspace\bid-workflow-app\index.html --window-size=1280,800 --center-location"
$s.WorkingDirectory = "C:\Users\apple\.qclaw\workspace\bid-workflow-app"
$s.Description = "熠达通 - 智能招投标助手"
$s.Save()
Write-Host "Shortcut created!"
