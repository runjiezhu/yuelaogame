@echo off
chcp 65001 >nul
title 月老养成 · 本地服务

cd /d "%~dp0"

REM 检查端口 8765 是否已被占用
netstat -ano | findstr ":8765" >nul 2>&1
if %errorlevel% neq 0 (
    echo 启动本地服务 (端口 8765)...
    REM 优先尝试 Python
    python -m http.server 8765 >nul 2>&1 &
    set PY_PID=!errorlevel!
    timeout /t 2 /nobreak >nul
    netstat -ano | findstr ":8765" >nul 2>&1
    if %errorlevel% neq 0 (
        echo Python 不可用，回退到 Node...
        call npm start
    ) else (
        echo Python 服务已启动
    )
)

REM 自动打开浏览器
start "" "http://localhost:8765/"

echo.
echo ================================
echo   月老养成 已启动
echo   浏览器地址: http://localhost:8765/
echo   关闭本窗口即停止服务
echo ================================
echo.
pause
