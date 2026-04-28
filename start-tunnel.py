import subprocess
import threading
import time
import os
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Check if server is already running
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
result = s.connect_ex(('localhost', 8080))
s.close()

server_proc = None
if result != 0:
    print("[1/2] Starting local server on port 8080...")
    server_proc = subprocess.Popen(
        [sys.executable, 'server.py'],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    time.sleep(2)
else:
    print("[1/2] Local server already running on port 8080")

print("[2/2] Creating public tunnel...")
print()
print("Wait, connecting to serveo.net...")
print()

cmd = [
    'ssh',
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-R', '80:localhost:8080',
    'serveo.net'
]

tunnel_proc = subprocess.Popen(
    cmd,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

url = None
start_time = time.time()

for line in tunnel_proc.stdout:
    line = line.strip()
    print(line)
    
    if 'serveousercontent.com' in line:
        parts = line.split('https://')
        if len(parts) > 1:
            url = 'https://' + parts[1].split()[0]
            print()
            print('*' * 60)
            print(' PUBLIC URL: ' + url)
            print('*' * 60)
            print()
    
    if time.time() - start_time > 30 and not url:
        print("Connection timeout. Check network.")
        break

if url:
    print("Tunnel active. Press Ctrl+C to stop.")
    try:
        tunnel_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping tunnel...")
        tunnel_proc.terminate()
        if server_proc:
            server_proc.terminate()
else:
    tunnel_proc.terminate()
    if server_proc:
        server_proc.terminate()
