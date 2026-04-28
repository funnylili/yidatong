import subprocess
import time
import os
import sys

def run_tunnel():
    print("=" * 60)
    print("熠达通 - 公网部署")
    print("=" * 60)
    print()
    print("正在启动公网访问...")
    print("注意：关闭此窗口将断开公网访问")
    print()
    
    # Start SSH tunnel
    cmd = [
        'ssh',
        '-o', 'StrictHostKeyChecking=no',
        '-o', 'ServerAliveInterval=30',
        '-R', '80:localhost:8080',
        'serveo.net'
    ]
    
    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )
    
    url = None
    start_time = time.time()
    
    print("等待连接...")
    print()
    
    for line in process.stdout:
        line = line.strip()
        print(line)
        
        if 'serveousercontent.com' in line:
            # Extract URL
            parts = line.split('https://')
            if len(parts) > 1:
                url = 'https://' + parts[1].split()[0]
                print()
                print("=" * 60)
                print("公网访问地址：")
                print(url)
                print("=" * 60)
                print()
                print("分享此链接给任何人，他们都可以访问您的应用！")
                print()
        
        # Timeout after 30 seconds if no URL
        if time.time() - start_time > 30 and not url:
            print("连接超时，请检查网络后重试")
            break
    
    if url:
        print()
        print("隧道保持运行中...按 Ctrl+C 停止")
        process.wait()
    else:
        print("连接失败，退出")
        process.terminate()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    run_tunnel()
