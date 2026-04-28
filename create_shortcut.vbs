Set oWS = WScript.CreateObject("WScript.Shell")
Set oLink = oWS.CreateShortcut("C:\Users\apple\Desktop\熠达通.lnk")
oLink.TargetPath = "C:\Users\apple\.qclaw\workspace\bid-workflow-app\启动熠达通.bat"
oLink.WorkingDirectory = "C:\Users\apple\.qclaw\workspace\bid-workflow-app"
oLink.IconLocation = "C:\Users\apple\.qclaw\workspace\bid-workflow-app\logo.ico,0"
oLink.Save
WScript.Echo "Done"