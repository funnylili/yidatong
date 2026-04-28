# 熠达通 - 公网部署指南

## 方案一：Cloudflare Tunnel（推荐，免费）

### 步骤 1：下载 cloudflared
1. 访问：https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
2. 下载 Windows 版本（cloudflared-windows-amd64.exe）
3. 将文件重命名为 `cloudflared.exe`，放到本项目文件夹中

### 步骤 2：启动本地服务器
双击运行 `start-server.bat`
服务器将在 http://localhost:8080 启动

### 步骤 3：创建隧道（新命令行窗口）
```cmd
cd C:\Users\apple\.qclaw\workspace\bid-workflow-app
cloudflared.exe tunnel --url http://localhost:8080
```

运行后会显示类似：
```
Your quick Tunnel has been created! Visit it at:
https://abc123.trycloudflare.com
```

这个 https://abc123.trycloudflare.com 就是你的公网地址！

---

## 方案二：Ngrok（需注册，免费版）

### 步骤 1：注册并下载
1. 访问 https://ngrok.com
2. 注册账号
3. 下载 Windows 版本
4. 解压 ngrok.exe 到本项目文件夹

### 步骤 2：配置 authtoken
```cmd
ngrok.exe authtoken YOUR_AUTHTOKEN
```

### 步骤 3：启动隧道
```cmd
ngrok.exe http 8080
```

---

## 方案三：Vercel（静态托管，免费）

由于本项目是纯静态 HTML/CSS/JS，可以直接部署到 Vercel：

1. 将项目代码上传到 GitHub
2. 访问 https://vercel.com
3. 导入 GitHub 仓库
4. 自动部署，获得 .vercel.app 域名

---

## 方案四：GitHub Pages（最简单，免费）

1. 在 GitHub 创建新仓库（如 yidatong-app）
2. 上传所有文件
3. 进入 Settings → Pages
4. Source 选择 Deploy from a branch，选择 main 分支
5. 访问 https://你的用户名.github.io/yidatong-app

---

## 当前状态

- 本地服务器: 已配置 ✓
- 启动脚本: 已创建 ✓
- 公网隧道: 需手动安装 cloudflared/ngrok

## 推荐快速方案

**最快上线方式**：
1. 双击 `start-server.bat` 启动本地服务器
2. 下载 cloudflared.exe 放到项目文件夹
3. 运行：`cloudflared.exe tunnel --url http://localhost:8080`
4. 获得公网地址，分享给别人访问

---

## 注意事项

- 公网地址每次重启可能会变（免费版）
- 如需固定域名，需要购买付费版或使用自有域名
- 确保防火墙允许 8080 端口
- 项目路径：`C:\Users\apple\.qclaw\workspace\bid-workflow-app\`
