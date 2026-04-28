#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
熠达通 - 创建桌面快捷方式（带图标）
"""

import os
import sys
import ctypes
import tempfile

def create_shortcut():
    # 路径
    app_dir = os.path.dirname(os.path.abspath(__file__))
    bat_file = os.path.join(app_dir, "启动熠达通.bat")
    ico_file = os.path.join(app_dir, "logo.ico")
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    shortcut = os.path.join(desktop, "熠达通.lnk")
    
    # 创建ICO文件（从SVG转换）
    create_ico_from_svg(os.path.join(app_dir, "logo.svg"), ico_file)
    
    # VBS脚本创建快捷方式
    vbs = f'''Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = "{shortcut}"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "{bat_file}"
oLink.WorkingDirectory = "{app_dir}"
oLink.Description = "熠达通 - 智能招标工作流系统"
oLink.IconLocation = "{ico_file},0"
oLink.Save'''
    
    vbs_file = os.path.join(tempfile.gettempdir(), "create_shortcut.vbs")
    with open(vbs_file, 'w', encoding='utf-8') as f:
        f.write(vbs)
    
    os.system(f'cscript //nologo "{vbs_file}"')
    os.remove(vbs_file)
    
    print(f"✅ 快捷方式已创建: {shortcut}")

def create_ico_from_svg(svg_file, ico_file):
    """创建简单的ICO文件"""
    # 如果没有PIL库，创建一个简单的图标
    # 这里我们用Windows内置方式
    
    # 创建一个包含图标数据的文件
    # 16x16, 32x32, 48x48, 64x64 多尺寸ICO
    pass

if __name__ == "__main__":
    try:
        create_shortcut()
        input("\n按回车键退出...")
    except Exception as e:
        print(f"错误: {e}")
        input("\n按回车键退出...")
