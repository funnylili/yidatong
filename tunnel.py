import subprocess
import time
import os
import sys
import socket

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# ============ CONFIG ============
PORT = 8080

# ============ STEP 1: Check if server is running ============
print("=" * 60)
print("  YidaTong - Public Deployment")
print("=" * 60)
print()

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
result = s.connect_ex(('localhost', PORT))
s.close()

if result != 0:
    print("[1/2] Starting local server on port %d..." % PORT)
    subprocess.Popen(
        [sys.executable, 'server.py'],
        stdout=open('server.log', 'w'),
        stderr=subprocess.STDOUT
    )
    time.sleep(2)
    print("       Server started!")
else:
    print("[1/2] Local server already running on port %d" % PORT)

# ============ STEP 2: Create tunnel ============
print("[2/2] Creating public tunnel via serveo.net...")
print("       (This may take 10-30 seconds)")
print()
print("Connecting to serveo.net...")

cmd = [
    'ssh',
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-R', '80:localhost:%d' % PORT,
    'serveo.net'
]

tunnel = subprocess.Popen(
    cmd,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

url = None
start = time.time()

for line in tunnel.stdout:
    line = line.strip()
    
    if 'serveousercontent.com' in line:
        parts = line.split('https://')
        if len(parts) > 1:
            url = 'https://' + parts[1].split()[0]
            
            # Save URL to file
            with open('PUBLIC_URL.txt', 'w') as f:
                f.write(url + '\n')
            
            print()
            print("*" * 60)
            print()
            print("  SUCCESS! Public URL:")
            print()
            print("  " + url)
            print()
            print("*" * 60)
            print()
            print("NOTE: serveo.net may show a warning page.")
            print("      Click the link to proceed to your app.")
            print()
            print("Local URL:  http://localhost:%d" % PORT)
            print("Public URL: %s" % url)
            print()
            print("Press Ctrl+C to stop the tunnel.")
            print()
            break
    
    if time.time() - start > 45:
        print("Connection timeout. Please check your network.")
        print("Make sure SSH is available and serveo.net is accessible.")
        tunnel.terminate()
        sys.exit(1)

if url:
    try:
        tunnel.wait()
    except KeyboardInterrupt:
        print("\n\nTunnel stopped.")
        tunnel.terminate()
