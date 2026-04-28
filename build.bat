@echo off
cd /d "%~dp0"

echo Compiling YidaTong...

vbc /target:winexe /r:System.dll,System.Windows.Forms.dll,System.Drawing.dll /win32icon:logo.ico YidaTong.vb /out:YidaTong.exe

if exist YidaTong.exe (
    echo.
    echo Build successful!
    echo Starting YidaTong...
    start YidaTong.exe
) else (
    echo Build failed!
)

pause