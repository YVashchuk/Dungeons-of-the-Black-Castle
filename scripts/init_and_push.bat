@echo off
REM Windows wrapper for init_and_push.sh
REM Requires: Git for Windows (includes Git Bash)

where git >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] Git not installed.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo.
echo Running init_and_push.sh via Git Bash...
echo.

"C:\Program Files\Git\bin\bash.exe" scripts/init_and_push.sh %*
if errorlevel 1 (
    REM Try alternative location
    "C:\Program Files (x86)\Git\bin\bash.exe" scripts/init_and_push.sh %*
)

pause
