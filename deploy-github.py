#!/usr/bin/env python3
"""
熠达通 GitHub Pages 部署脚本
需要先手动运行: gh auth login
"""

import os
import subprocess
import sys

def run(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(f"ERROR: {result.stderr}")
    return result.returncode == 0

# 检查 gh 是否可用
print("[1] 检查 GitHub CLI...")
if not run("gh --version"):
    print("请先安装 GitHub CLI: winget install GitHub.cli")
    sys.exit(1)

# 检查登录状态
print("\n[2] 检查登录状态...")
run("gh auth status")

# 准备文件
app_dir = r"C:\Users\apple\.qclaw\workspace\bid-workflow-app"
os.chdir(app_dir)
print(f"\n[3] 当前目录: {os.getcwd()}")

# 文件列表
files = ['index.html', 'project.html', 'bidinfo.html', 'document.html', 'my-platforms.html', 'daily-bids.json']
missing = [f for f in files if not os.path.exists(f)]
if missing:
    print(f"⚠️ 缺少文件: {missing}")
else:
    print(f"✓ 所有文件都存在: {files}")

# 初始化 git（如果需要）
if not os.path.exists('.git'):
    print("\n[4] 初始化 Git 仓库...")
    run("git init")
    run("git add .")
    run('git commit -m "initial: 熠达通工作台"')

print("\n[5] 部署说明:")
print("="*50)
print("要部署到 GitHub Pages，执行以下命令：")
print()
print("1. 登录 GitHub (只需一次):")
print("   gh auth login")
print()
print("2. 创建仓库:")
print('   gh repo create yidatong-bid --public --source=. --push')
print()
print("3. 启用 Pages:")
print("   gh repo set default --enable-pages")
print()
print("4. 查看网址:")
print("   gh repo view --json url")
print("="*50)