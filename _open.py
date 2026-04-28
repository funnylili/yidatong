import subprocess
chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
try:
    subprocess.Popen([chrome, "--new-window", "http://localhost:8080"])
    print("OK")
except:
    edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    subprocess.Popen([edge, "--new-window", "http://localhost:8080"])
    print("OK")
