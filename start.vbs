On Error Resume Next
Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

strPath = objFSO.GetParentFolderName(WScript.ScriptFullName)
strHTML = strPath & "\launcher.html"

Set objIE = CreateObject("InternetExplorer.Application")
objIE.Navigate "file:///" & Replace(strHTML, "\", "/")
objIE.Toolbar = 0
objIE.StatusBar = 0
objIE.Width = 1400
objIE.Height = 900
objIE.Left = (objIE.Document.ParentWindow.Screen.AvailWidth - 1400) / 2
objIE.Top = (objIE.Document.ParentWindow.Screen.AvailHeight - 900) / 2
objIE.Visible = 1

Do While objIE.Busy
    WScript.Sleep 100
Loop

objShell.AppActivate "熠达通"