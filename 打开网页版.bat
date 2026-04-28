@echo off
chcp 65001 >nul
title 熠达通 - 招投标助手
cd /d "%~dp0"
start msedge "%cd%\index.html" --new-window --window-size=1400,900