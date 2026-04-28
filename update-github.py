#!/usr/bin/env python3
"""
熠达通 - 每日自动更新到 GitHub
功能：抓取招标数据 → 更新 daily-bids.json → 推送到 GitHub
"""

import subprocess
import os
import json
from datetime import datetime
import urllib.request
import urllib.parse

# 配置
GITHUB_USER = "funnylili"
GITHUB_REPO = "yidatong"
GITHUB_TOKEN = ""  # 需要填写 GitHub Personal Access Token
APP_DIR = r"C:\Users\apple\.qclaw\workspace\bid-workflow-app"
DATA_FILE = os.path.join(APP_DIR, "daily-bids.json")

def run_cmd(cmd):
    """执行命令"""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8')
    print(f">>> {cmd}")
    if result.stdout:
        print(result.stdout)
    if result.returncode != 0:
        print(f"ERROR: {result.stderr}")
    return result.returncode == 0

def git_push():
    """推送到 GitHub"""
    os.chdir(APP_DIR)
    
    # 检查是否有更改
    result = subprocess.run("git status --porcelain", shell=True, capture_output=True, text=True)
    if not result.stdout.strip():
        print("没有更改需要提交")
        return True
    
    print("\n=== 推送到 GitHub ===")
    
    # 配置 git（如果需要）
    run_cmd('git config user.email "funnylili52@gmail.com"')
    run_cmd('git config user.name "funnylili"')
    
    # 添加、提交、推送
    today = datetime.now().strftime("%Y-%m-%d")
    run_cmd("git add daily-bids.json")
    run_cmd(f'git commit -m "更新招标数据 {today}"')
    run_cmd("git push origin main")
    
    print(f"✅ 已推送到 GitHub: https://funnylili.github.io/yidatong/")
    return True

def update_via_api():
    """通过 GitHub API 直接更新文件（不需要本地 git）"""
    if not GITHUB_TOKEN:
        print("⚠️ 未配置 GITHUB_TOKEN，使用本地 git 推送")
        return git_push()
    
    # 读取本地文件
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # GitHub API 更新文件
    import base64
    
    url = f"https://api.github.com/repos/{GITHUB_USER}/{GITHUB_REPO}/contents/daily-bids.json"
    
    # 获取当前文件的 SHA
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"token {GITHUB_TOKEN}")
    req.add_header("Accept", "application/vnd.github.v3+json")
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            sha = data['sha']
    except Exception as e:
        print(f"获取 SHA 失败: {e}")
        return False
    
    # 更新文件
    encoded_content = base64.b64encode(content.encode()).decode()
    payload = {
        "message": f"更新招标数据 {datetime.now().strftime('%Y-%m-%d')}",
        "content": encoded_content,
        "sha": sha
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), method='PUT')
    req.add_header("Authorization", f"token {GITHUB_TOKEN}")
    req.add_header("Accept", "application/vnd.github.v3+json")
    
    try:
        with urllib.request.urlopen(req) as response:
            print("✅ 已通过 API 更新到 GitHub")
            return True
    except Exception as e:
        print(f"API 更新失败: {e}")
        return False

if __name__ == "__main__":
    print(f"\n{'='*50}")
    print(f"熠达通 - 每日数据更新")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*50}\n")
    
    # 推送到 GitHub
    git_push()
