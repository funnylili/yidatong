Imports System
Imports System.Windows.Forms
Imports System.Drawing
Imports System.Threading

Public Class YidaTongApp
    Inherits Form

    Private webView As WebBrowser
    Private titleLabel As Label
    Private logoPanel As Panel

    Public Sub New()
        Me.Text = "熠达通 - 智能招标工作流系统"
        Me.Size = New Size(1400, 900)
        Me.MinimumSize = New Size(1200, 700)
        Me.StartPosition = FormStartPosition.CenterScreen
        Me.BackColor = Color.FromArgb(26, 26, 46)
        Me.Icon = Icon.FromHandle(CreateLogoBitmap().GetHicon())

        ' 标题栏
        Dim titleBar As New Panel()
        titleBar.Dock = DockStyle.Top
        titleBar.Height = 50
        titleBar.BackColor = Color.FromArgb(22, 33, 62)
        Me.Controls.Add(titleBar)

        ' LOGO
        Dim logoBox As New PictureBox()
        logoBox.Size = New Size(32, 32)
        logoBox.Location = New Point(15, 9)
        logoBox.Image = CreateLogoBitmap(32, 32)
        titleBar.Controls.Add(logoBox)

        ' 标题文字
        titleLabel = New Label()
        titleLabel.Text = "熠达通"
        titleLabel.Font = New Font("Microsoft YaHei", 14, FontStyle.Bold)
        titleLabel.ForeColor = Color.White
        titleLabel.Location = New Point(55, 12)
        titleLabel.AutoSize = True
        titleBar.Controls.Add(titleLabel)

        ' 副标题
        Dim subTitle As New Label()
        subTitle.Text = "智能招标工作流系统"
        subTitle.Font = New Font("Microsoft YaHei", 9)
        subTitle.ForeColor = Color.FromArgb(200, 200, 200)
        subTitle.Location = New Point(130, 17)
        subTitle.AutoSize = True
        titleBar.Controls.Add(subTitle)

        ' 菜单栏
        CreateMenu(titleBar)

        ' WebBrowser
        webView = New WebBrowser()
        webView.Dock = DockStyle.Fill
        webView.ScrollBarsEnabled = True
        webView.IsWebBrowserContextMenuEnabled = True
        webView.AllowNavigation = True
        Me.Controls.Add(webView)

        ' 加载页面
        Dim appPath As String = Application.StartupPath
        Dim indexPath As String = IO.Path.Combine(appPath, "index.html")
        webView.Navigate(indexPath)
    End Sub

    Private Sub CreateMenu(parent As Control)
        Dim menuItems As String() = {"工作台", "项目", "招标信息", "设计方案", "标书管理", "设置"}
        Dim files As String() = {"index.html", "index.html", "bidinfo.html", "design.html", "document.html", "index.html"}

        Dim xPos As Integer = 280
        For i As Integer = 0 To menuItems.Length - 1
            Dim btn As New Label()
            btn.Text = menuItems(i)
            btn.Font = New Font("Microsoft YaHei", 10)
            btn.ForeColor = Color.FromArgb(200, 200, 200)
            btn.Location = New Point(xPos, 15)
            btn.AutoSize = True
            btn.Cursor = Cursors.Hand
            btn.Tag = files(i)

            AddHandler btn.MouseEnter, Sub(s, e) DirectCast(s, Label).ForeColor = Color.White
            AddHandler btn.MouseLeave, Sub(s, e) DirectCast(s, Label).ForeColor = Color.FromArgb(200, 200, 200)
            AddHandler btn.Click, Sub(s, e)
                                      Dim file As String = DirectCast(s, Label).Tag.ToString()
                                      Dim path As String = IO.Path.Combine(Application.StartupPath, file)
                                      webView.Navigate(path)
                                  End Sub

            parent.Controls.Add(btn)
            xPos += 90
        Next
    End Sub

    Private Function CreateLogoBitmap(Optional w As Integer = 256, Optional h As Integer = 256) As Bitmap
        Dim bmp As New Bitmap(w, h)
        Using g As Graphics = Graphics.FromImage(bmp)
            ' 背景
            Dim brush As New Drawing2D.LinearGradientBrush(
                New Point(0, 0),
                New Point(w, h),
                Color.FromArgb(233, 69, 96),
                Color.FromArgb(199, 62, 84)
            )
            g.FillRectangle(brush, 0, 0, w, h)

            ' Y字母
            Dim pen As New Pen(Color.White, w * 0.08)
            pen.StartCap = Drawing2D.LineCap.Round
            pen.EndCap = Drawing2D.LineCap.Round

            Dim yTop As Single = h * 0.3F
            Dim yMid As Single = h * 0.5F
            Dim yBot As Single = h * 0.75F
            Dim xLeft As Single = w * 0.25F
            Dim xMid As Single = w * 0.5F
            Dim xRight As Single = w * 0.75F

            g.DrawLine(pen, xLeft, yBot, xMid, yMid)
            g.DrawLine(pen, xRight, yBot, xMid, yMid)
            g.DrawLine(pen, xMid, yMid, xMid, yBot)

            ' 顶部圆点
            Dim dotR As Single = w * 0.06F
            g.FillEllipse(Brushes.White, xMid - dotR, yTop - dotR, dotR * 2, dotR * 2)
        End Using
        Return bmp
    End Function

    <STAThread>
    Public Shared Sub Main()
        Application.EnableVisualStyles()
        Application.SetCompatibleTextRenderingDefault(False)
        Application.Run(New YidaTongApp())
    End Sub
End Class