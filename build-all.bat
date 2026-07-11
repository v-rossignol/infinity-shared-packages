@echo off
setlocal

cd /d "%~dp0"

echo === Building all @infinity packages ===

echo.
echo [1/4] shared-config
cd /d "%~dp0shared-config"
call npm run build
if errorlevel 1 goto :failed

echo.
echo [2/4] shared-types
cd /d "%~dp0shared-types"
call npm run build
if errorlevel 1 goto :failed

echo.
echo [3/4] shared-utils
cd /d "%~dp0shared-utils"
call npm run build
if errorlevel 1 goto :failed

echo.
echo [4/4] shared-ui
cd /d "%~dp0shared-ui"
call npm run build
if errorlevel 1 goto :failed

echo.
echo All packages built successfully.
exit /b 0

:failed
echo.
echo Build failed.
pause
exit /b 1
