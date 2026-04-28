Add-Type -AssemblyName System.Windows.Forms, System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "熠达通 - 智能招标工作流系统"
$form.Size = New-Object System.Drawing.Size(1400, 900)
$form.MinimumSize = New-Object System.Drawing.Size(1200, 700)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::FromArgb(26, 26, 46)
$form.FormBorderStyle = "Sizable"
$form.MaximizeBox = $true

# 创建LOGO
function CreateLogo {
    param([int]$size = 32)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = "AntiAlias"

    # 背景
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($size, $size)),
        [System.Drawing.Color]::FromArgb(233, 69, 96),
        [System.Drawing.Color]::FromArgb(199, 62, 84)
    )
    $radius = [int]($size * 0.2)
    $g.FillRectangle($brush, 0, 0, $size, $size)

    # Y字母
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, [int]($size * 0.12))
    $pen.StartCap = "Round"
    $pen.EndCap = "Round"

    $y1 = [int]($size * 0.3)
    $y2 = [int]($size * 0.5)
    $y3 = [int]($size * 0.75)
    $x1 = [int]($size * 0.25)
    $x2 = [int]($size * 0.5)
    $x3 = [int]($size * 0.75)

    $g.DrawLine($pen, $x1, $y3, $x2, $y2)
    $g.DrawLine($pen, $x3, $y3, $x2, $y2)
    $g.DrawLine($pen, $x2, $y2, $x2, $y3)

    # 圆点
    $dotR = [int]($size * 0.06)
    $solidBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillEllipse($solidBrush, $x2 - $dotR, $y1 - $dotR, $dotR * 2, $dotR * 2)

    $g.Dispose()
    return $bmp
}

# 设置图标
$form.Icon = [System.Drawing.Icon]::FromHandle((CreateLogo 256).GetHicon())

# 标题栏面板
$titleBar = New-Object System.Windows.Forms.Panel
$titleBar.Dock = "Top"
$titleBar.Height = 50
$titleBar.BackColor = [System.Drawing.Color]::FromArgb(22, 33, 62)
$form.Controls.Add($titleBar)

# Logo PictureBox
$logoBox = New-Object System.Windows.Forms.PictureBox
$logoBox.Size = New-Object System.Drawing.Size(32, 32)
$logoBox.Location = New-Object System.Drawing.Point(15, 9)
$logoBox.Image = CreateLogo 32
$titleBar.Controls.Add($logoBox)

# 标题
$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Text = "熠达通"
$titleLabel.Font = New-Object System.Drawing.Font("Microsoft YaHei", 14, [System.Drawing.FontStyle]::Bold)
$titleLabel.ForeColor = [System.Drawing.Color]::White
$titleLabel.Location = New-Object System.Drawing.Point(55, 12)
$titleLabel.AutoSize = $true
$titleBar.Controls.Add($titleLabel)

# 副标题
$subLabel = New-Object System.Windows.Forms.Label
$subLabel.Text = "智能招标工作流系统"
$subLabel.Font = New-Object System.Drawing.Font("Microsoft YaHei", 9)
$subLabel.ForeColor = [System.Drawing.Color]::FromArgb(200, 200, 200)
$subLabel.Location = New-Object System.Drawing.Point(135, 17)
$subLabel.AutoSize = $true
$titleBar.Controls.Add($subLabel)

# 菜单按钮
$appPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$menus = @(
    @{"名称"="工作台"; "文件"="index.html"},
    @{"名称"="招标信息"; "文件"="bidinfo.html"},
    @{"名称"="设计方案"; "文件"="design.html"},
    @{"名称"="标书管理"; "文件"="document.html"}
)

$xPos = 280
foreach ($menu in $menus) {
    $btn = New-Object System.Windows.Forms.Label
    $btn.Text = $menu["名称"]
    $btn.Font = New-Object System.Drawing.Font("Microsoft YaHei", 10)
    $btn.ForeColor = [System.Drawing.Color]::FromArgb(200, 200, 200)
    $btn.Location = New-Object System.Drawing.Point($xPos, 15)
    $btn.AutoSize = $true
    $btn.Cursor = "Hand"
    $btn.Tag = $menu["文件"]

    $btn.Add_MouseEnter({
        $this.ForeColor = [System.Drawing.Color]::White
    })
    $btn.Add_MouseLeave({
        $this.ForeColor = [System.Drawing.Color]::FromArgb(200, 200, 200)
    })
    $btn.Add_Click({
        $file = $this.Tag
        $path = Join-Path $appPath $file
        $webBrowser.Navigate($path)
    })

    $titleBar.Controls.Add($btn)
    $xPos += 90
}

# WebBrowser
$webBrowser = New-Object System.Windows.Forms.WebBrowser
$webBrowser.Dock = "Fill"
$webBrowser.ScrollBarsEnabled = $true
$webBrowser.IsWebBrowserContextMenuEnabled = $true
$webBrowser.AllowNavigation = $true
$form.Controls.Add($webBrowser)

# 加载首页
$indexPath = Join-Path $appPath "index.html"
$webBrowser.Navigate($indexPath)

# 显示窗口
$form.ShowDialog()