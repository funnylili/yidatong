import http.server
import socketserver
import socket
import os

PORT = 8080

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print("=" * 50)
    print("YidaTong Server Started!")
    print("=" * 50)
    print(f"Local: http://localhost:{PORT}")
    ip = socket.gethostbyname(socket.gethostname())
    print("Network: http://{}:{}".format(ip, PORT))
    print("=" * 50)
    httpd.serve_forever()
