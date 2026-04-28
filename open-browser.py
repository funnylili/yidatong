import subprocess
import os
import sys

os.chdir(r"C:\Users\apple\.qclaw\workspace\bid-workflow-app")

# Start Python HTTP server
import http.server, socketserver, threading

class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

port = 8080
httpd = socketserver.TCPServer(("", port), H)

def serve():
    print(f"Server on http://localhost:{port}")
    httpd.serve_forever()

t = threading.Thread(target=serve, daemon=True)
t.start()

import time
time.sleep(1)

# Open Chrome
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
try:
    subprocess.Popen([chrome_path, "--new-window", f"http://localhost:{port}"])
    print("Chrome opened!")
except:
    # Try Edge
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    subprocess.Popen([edge_path, "--new-window", f"http://localhost:{port}"])
    print("Edge opened!")

print(f"Server running at http://localhost:{port}")
time.sleep(86400)
