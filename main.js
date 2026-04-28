const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        frame: true,
        backgroundColor: '#1a1a2e',
        icon: path.join(__dirname, 'logo.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true
        },
        title: '熠达通'
    });

    // 加载主页面
    mainWindow.loadFile('index.html');

    // 创建菜单
    const menuTemplate = [
        {
            label: '文件',
            submenu: [
                {
                    label: '新建项目',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            if (typeof createNewProject === 'function') createNewProject();
                        `);
                    }
                },
                { type: 'separator' },
                {
                    label: '导出标书',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            if (typeof exportDocument === 'function') exportDocument();
                        `);
                    }
                },
                { type: 'separator' },
                { role: 'quit', label: '退出' }
            ]
        },
        {
            label: '编辑',
            submenu: [
                { role: 'undo', label: '撤销' },
                { role: 'redo', label: '重做' },
                { type: 'separator' },
                { role: 'cut', label: '剪切' },
                { role: 'copy', label: '复制' },
                { role: 'paste', label: '粘贴' },
                { role: 'selectAll', label: '全选' }
            ]
        },
        {
            label: '视图',
            submenu: [
                { role: 'reload', label: '刷新' },
                { role: 'toggleDevTools', label: '开发者工具' },
                { type: 'separator' },
                { role: 'resetZoom', label: '重置缩放' },
                { role: 'zoomIn', label: '放大' },
                { role: 'zoomOut', label: '缩小' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: '全屏' }
            ]
        },
        {
            label: '窗口',
            submenu: [
                { role: 'minimize', label: '最小化' },
                { role: 'close', label: '关闭' }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于熠达通',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: '关于熠达通',
                            message: '熠达通 v1.0.0',
                            detail: '智能招标工作流系统\n\n让投标更简单\n\n© 2026 YidaTong'
                        });
                    }
                },
                {
                    label: '访问官网',
                    click: () => {
                        shell.openExternal('https://yidatong.com');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // 窗口关闭事件
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 应用准备就绪
app.whenReady().then(createWindow);

// 所有窗口关闭时退出
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});