#!/usr/bin/env python3
import subprocess
import time
import re
import sys
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)) if __file__ else r"C:\Users\apple\.qclaw\workspace\bid-workflow-app")

# Start server
PORT = 8080
try:
    import http.server, socketserver, socket
    class H(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin','*')
            super().end_headers()
    httpd = socketserver.TCPServer(("", PORT), H)
    print(f"Server running on http://localhost:{PORT}")
except Exception as e:
    print(f"Server already running or error: {e}")

# Tunnel via serveo
print("Creating tunnel via serveo.net...")
print("Requesting tunnel...")

proc = subprocess.Popen(
    ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=30",
     "-o", "RequestTTY=false", "-R", "80:localhost:8080", "serveo.net"],
    stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1
)

url = None
for line in proc.stdout:
    print(line.rstrip())
    if "https://" in line:
        m = re.search(r'https://[a-zA-Z0-9\-.]+', line)
        if m:
            url = m.group()
            with open("PUBLIC_URL.txt","w") as f:
                f.write(url+"\n")
            print("\n"+"="*60)
            print(f"PUBLIC URL: {url}")
            print("="*60)
            break
    if line.strip() == "":
        time.sleep(0.5)

if not url:
    print("No URL received, checking alternatives...")
    time.sleep(10)

proc.wait()