Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "熠达通"
$form.Size = New-Object System.Drawing.Size(1400, 900)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::FromArgb(26, 26, 46)
$form.FormBorderStyle = "Sizable"
$form.MaximizeBox = $true
$form.MinimizeBox = $true
$form.Icon = [System.Drawing.Icon]::FromHandle((New-Object System.Drawing.Bitmap(256, 256)).GetHicon())

$webBrowser = New-Object System.Windows.Forms.WebBrowser
$webBrowser.Dock = "Fill"
$webBrowser.ScrollBarsEnabled = $false
$webBrowser.IsWebBrowserContextMenuEnabled = $true
$webBrowser.AllowNavigation = $true

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$launcherPath = Join-Path $scriptPath "launcher.html"
$webBrowser.Navigate($launcherPath)

$form.Controls.Add($webBrowser)
$form.Add_Shown({ $webBrowser.Refresh() })
$form.ShowDialog()