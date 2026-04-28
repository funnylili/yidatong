Add-Type -AssemblyName System.Windows.Forms, System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "YidaTong"
$form.Size = New-Object System.Drawing.Size(1400, 900)
$form.MinimumSize = New-Object System.Drawing.Size(1200, 700)
$form.StartPosition = [System.Windows.Forms.FormStartPosition]::CenterScreen
$form.BackColor = [System.Drawing.Color]::FromArgb(26, 26, 46)

function New-Logo {
    param([int]$sz = 32)
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $br = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($sz, $sz)),
        [System.Drawing.Color]::FromArgb(233, 69, 96),
        [System.Drawing.Color]::FromArgb(199, 62, 84)
    )
    $g.FillRectangle($br, 0, 0, $sz, $sz)
    $p = New-Object System.Drawing.Pen([System.Drawing.Color]::White, [int]($sz * 0.12))
    $p.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $p.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $y1 = [int]($sz * 0.3); $y2 = [int]($sz * 0.5); $y3 = [int]($sz * 0.75)
    $x1 = [int]($sz * 0.25); $x2 = [int]($sz * 0.5); $x3 = [int]($sz * 0.75)
    $g.DrawLine($p, $x1, $y3, $x2, $y2)
    $g.DrawLine($p, $x3, $y3, $x2, $y2)
    $g.DrawLine($p, $x2, $y2, $x2, $y3)
    $dr = [int]($sz * 0.06)
    $sb = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillEllipse($sb, $x2 - $dr, $y1 - $dr, $dr * 2, $dr * 2)
    $g.Dispose()
    return $bmp
}

$form.Icon = [System.Drawing.Icon]::FromHandle((New-Logo 256).GetHicon())

$tb = New-Object System.Windows.Forms.Panel
$tb.Dock = [System.Windows.Forms.DockStyle]::Top
$tb.Height = 50
$tb.BackColor = [System.Drawing.Color]::FromArgb(22, 33, 62)
$form.Controls.Add($tb)

$lb = New-Object System.Windows.Forms.PictureBox
$lb.Size = New-Object System.Drawing.Size(32, 32)
$lb.Location = New-Object System.Drawing.Point(15, 9)
$lb.Image = New-Logo 32
$tb.Controls.Add($lb)

$tl = New-Object System.Windows.Forms.Label
$tl.Text = "YidaTong"
$tl.Font = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$tl.ForeColor = [System.Drawing.Color]::White
$tl.Location = New-Object System.Drawing.Point(55, 12)
$tl.AutoSize = $true
$tb.Controls.Add($tl)

$ap = Split-Path -Parent $MyInvocation.MyCommand.Path
$mf = @("index.html", "bidinfo.html", "design.html", "document.html")
$mn = @("Dashboard", "Bid Info", "Design", "Document")
$xp = 280

for ($i = 0; $i -lt $mf.Count; $i++) {
    $b = New-Object System.Windows.Forms.Label
    $b.Text = $mn[$i]
    $b.Font = New-Object System.Drawing.Font("Segoe UI", 10)
    $b.ForeColor = [System.Drawing.Color]::FromArgb(200, 200, 200)
    $b.Location = New-Object System.Drawing.Point($xp, 15)
    $b.AutoSize = $true
    $b.Cursor = [System.Windows.Forms.Cursors]::Hand
    $b.Tag = $mf[$i]
    $b.Add_MouseEnter({ $this.ForeColor = [System.Drawing.Color]::White })
    $b.Add_MouseLeave({ $this.ForeColor = [System.Drawing.Color]::FromArgb(200, 200, 200) })
    $b.Add_Click({
        $fp = Join-Path $ap $this.Tag
        $wb.Navigate($fp)
    })
    $tb.Controls.Add($b)
    $xp += 100
}

$wb = New-Object System.Windows.Forms.WebBrowser
$wb.Dock = [System.Windows.Forms.DockStyle]::Fill
$wb.ScrollBarsEnabled = $true
$wb.IsWebBrowserContextMenuEnabled = $true
$form.Controls.Add($wb)

$ip = Join-Path $ap "index.html"
$wb.Navigate($ip)

$form.ShowDialog()