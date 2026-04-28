# -*- coding: utf-8 -*-
"""
YidaTong Desktop Application
Creates a standalone desktop app like QClaw
"""
import os
import sys
import tkinter as tk
from tkinter import ttk
try:
    from PIL import Image, ImageTk
except ImportError:
    Image = None
    ImageTk = None

class YidaTongApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("YidaTong")
        self.root.geometry("1400x900")
        self.root.minsize(1200, 700)
        
        # Get script directory
        if getattr(sys, 'frozen', False):
            self.app_dir = os.path.dirname(sys.executable)
        else:
            self.app_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Create icon
        self.create_icon()
        
        # Create UI
        self.create_ui()
        
        # Load page
        self.load_page("index.html")
    
    def create_icon(self):
        """Create YD logo as icon"""
        if Image and ImageTk:
            # Create image
            img = Image.new('RGB', (256, 256), color=(233, 69, 96))
            self.icon_img = ImageTk.PhotoImage(img)
            try:
                self.root.iconphoto(False, self.icon_img)
            except:
                pass
    
    def create_ui(self):
        """Create main UI"""
        # Title bar
        title_bar = tk.Frame(self.root, bg="#16213e", height=50)
        title_bar.pack(side=tk.TOP, fill=tk.X)
        title_bar.pack_propagate(False)
        
        # Logo
        logo_frame = tk.Frame(title_bar, bg="#e94560", width=36, height=36)
        logo_frame.place(x=15, y=7)
        logo_frame.pack_propagate(False)
        
        logo_label = tk.Label(logo_frame, text="Y", bg="#e94560", fg="white", 
                             font=("Arial", 18, "bold"))
        logo_label.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title = tk.Label(title_bar, text="YidaTong", bg="#16213e", fg="white",
                        font=("Microsoft YaHei", 14, "bold"))
        title.place(x=60, y=13)
        
        # Menu buttons
        menus = [
            ("Dashboard", "index.html"),
            ("Bid Info", "bidinfo.html"),
            ("Design", "design.html"),
            ("Document", "document.html")
        ]
        
        x_pos = 200
        for text, file in menus:
            btn = tk.Label(title_bar, text=text, bg="#16213e", fg="#cccccc",
                          font=("Microsoft YaHei", 10), cursor="hand")
            btn.place(x=x_pos, y=18)
            btn.bind("<Button-1>", lambda e, f=file: self.load_page(f))
            btn.bind("<Enter>", lambda e, b=btn: b.config(fg="white"))
            btn.bind("<Leave>", lambda e, b=btn: b.config(fg="#cccccc"))
            x_pos += 100
        
        # Content area with WebView
        self.content_frame = tk.Frame(self.root, bg="white")
        self.content_frame.pack(fill=tk.BOTH, expand=True)
        
        # Try to use WebView
        self.webview = None
        self.try_webview()
    
    def try_webview(self):
        """Try to create webview"""
        try:
            from tkinterweb import HtmlFrame
            self.webview = HtmlFrame(self.content_frame)
            self.webview.pack(fill=tk.BOTH, expand=True)
            return True
        except ImportError:
            pass
        
        try:
            from cefpython3 import cefpython
            # CEF Python available
            pass
        except ImportError:
            pass
        
        # Fallback: Show message and use system browser
        msg = tk.Label(self.content_frame, 
                      text="YidaTong Desktop App\n\nClick to open in browser...",
                      font=("Microsoft YaHei", 16), bg="white")
        msg.pack(fill=tk.BOTH, expand=True)
        msg.bind("<Button-1>", lambda e: self.open_browser())
        return False
    
    def load_page(self, page):
        """Load HTML page"""
        path = os.path.join(self.app_dir, page)
        if not os.path.exists(path):
            path = os.path.join(self.app_dir, "index.html")
        
        if self.webview:
            try:
                self.webview.load_file(path)
            except:
                self.webview.load_url(f"file:///{path.replace(chr(92), '/')}")
        else:
            # Use system browser as fallback
            os.startfile(path)
    
    def open_browser(self):
        """Open in default browser"""
        path = os.path.join(self.app_dir, "index.html")
        os.startfile(path)
    
    def run(self):
        """Run the app"""
        self.root.mainloop()

if __name__ == "__main__":
    app = YidaTongApp()
    app.run()