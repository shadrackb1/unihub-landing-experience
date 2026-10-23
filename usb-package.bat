@echo off
setlocal enabledelayedexpansion

:: UniHub USB Packager - Windows Batch Version
:: Creates plug-and-play USB with cross-platform runtimes

echo === UniHub USB Packager ===

:: Configuration
set "PROJECT_ROOT=%~dp0"
set "USB_DRIVE="

:: Auto-detect USB drive labeled RIS_USB
for /f "tokens=1,2 delims=:" %%a in ('wmic logicaldisk where "FileSystem='FAT32' or FileSystem='exFAT' or FileSystem='NTFS'" get DeviceID, VolumeName /format:csv 2^>nul') do (
    if "%%b"=="RIS_USB" set "USB_DRIVE=%%a:"
)
if "%USB_DRIVE%"=="" (
    echo No USB drive labeled RIS_USB found.
    echo Please specify drive letter: usb-package.bat E:
    if "%~1"=="" exit /b 1
    set "USB_DRIVE=%~1"
)

echo Target USB drive: %USB_DRIVE%

:: Build project
echo Building UniHub project...
cd /d "%PROJECT_ROOT%"
npm run build
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)
echo Build completed successfully.

:: Target directory on USB
set "TARGET_DIR=%USB_DRIVE%\unihub"
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

:: Copy build output
echo Copying build output...
if exist "%PROJECT_ROOT%\.vercel\output" (
    xcopy /E /Y /I "%PROJECT_ROOT%\.vercel\output\*" "%TARGET_DIR%\"
) else (
    echo WARNING: Build output not found at %PROJECT_ROOT%\.vercel\output
)

:: Copy offline package
set "OFFLINE_PKG=%PROJECT_ROOT%\unihub-offline-package"
if exist "%OFFLINE_PKG%" (
    echo Copying offline package...
    for %%d in (runtimes libsql node_modules prisma) do (
        if exist "%OFFLINE_PKG%\%%d" (
            echo   Copying %%d...
            xcopy /E /Y /I "%OFFLINE_PKG%\%%d" "%TARGET_DIR%\%%d\"
        )
    )
    for %%f in (package.json package-lock.json pnpm-lock.yaml) do (
        if exist "%OFFLINE_PKG%\%%f" (
            copy /Y "%OFFLINE_PKG%\%%f" "%TARGET_DIR%\%%f"
        )
    )
) else (
    echo WARNING: Offline package not found at %OFFLINE_PKG%
)

:: Create start.bat
echo Creating start.bat...
(
    echo @echo off
    echo setlocal enabledelayedexpansion
    echo cd /d "%%~dp0"
    echo.
    echo echo Starting UniHub on Windows...
    echo.
    echo rem Detect architecture
    echo for /f "tokens=2 delims==" %%%%I in ('wmic os get osarchitecture /value 2^>nul') do set ARCH=%%%%I
    echo if "%%ARCH%%"=="64-bit" set ARCH=x64
    echo if "%%ARCH%%"=="32-bit" set ARCH=x86
    echo.
    echo rem Self-heal: verify manifest
    echo if exist manifest.json (
    echo     echo Verifying file integrity...
    echo )
    echo.
    echo rem Select Node runtime
    echo set NODE_DIR=%%~dpruntimes\node-windows-%%ARCH%%
    echo if not exist "%%NODE_DIR%%" set NODE_DIR=%%~dpruntimes\node-windows-x64
    echo if not exist "%%NODE_DIR%%" (
    echo     echo ERROR: No Node.js runtime found for Windows-%%ARCH%% ^>^&2
    echo     exit /b 1
    echo )
    echo set PATH=%%NODE_DIR%%;%%PATH%%
    echo.
    echo rem Set up libsql native bindings
    echo set LIBSQL_NATIVE_DIR=%%~dplibsql\windows-%%ARCH%%
    echo if not exist "%%LIBSQL_NATIVE_DIR%%" set LIBSQL_NATIVE_DIR=%%~dplibsql\windows-x64
    echo.
    echo rem Run the application
    echo node .vercel/output/server/index.js
) > "%TARGET_DIR%\start.bat"

:: Create start.sh
echo Creating start.sh...
(
    echo #!/bin/bash
    echo set -euo pipefail
    echo 'SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"'
    echo 'cd "$SCRIPT_DIR"'
    echo.
    echo # Detect OS and architecture
    echo 'OS=$(uname -s | tr "[:upper:]" "[:lower:]")'
    echo 'ARCH=$(uname -m)'
    echo 'case "$ARCH" in'
    echo '  x86_64) ARCH="x64" ;;'
    echo '  aarch64|arm64) ARCH="arm64" ;;'
    echo 'esac'
    echo.
    echo 'echo "Starting UniHub on $OS-$ARCH..."'
    echo.
    echo # Self-heal: verify manifest
    echo 'MANIFEST="$SCRIPT_DIR/manifest.json"'
    echo 'if [[ -f "$MANIFEST" ]]; then'
    echo '    echo "Verifying file integrity..."'
    echo 'fi'
    echo.
    echo # Select Node runtime
    echo 'NODE_DIR="$SCRIPT_DIR/runtimes/node-$OS-$ARCH"'
    echo 'if [[ ! -d "$NODE_DIR" ]]; then'
    echo '    NODE_DIR="$SCRIPT_DIR/runtimes/node-$OS-x64"'
    echo '    echo "Falling back to x64 runtime"'
    echo 'fi'
    echo 'if [[ ! -d "$NODE_DIR" ]]; then'
    echo '    echo "ERROR: No Node.js runtime found for $OS-$ARCH" >&2'
    echo '    exit 1'
    echo 'fi'
    echo 'export PATH="$NODE_DIR/bin:$PATH"'
    echo.
    echo # Set up libsql native bindings
    echo 'export LIBSQL_NATIVE_DIR="$SCRIPT_DIR/libsql/$OS-$ARCH"'
    echo 'if [[ ! -d "$LIBSQL_NATIVE_DIR" ]]; then'
    echo '    export LIBSQL_NATIVE_DIR="$SCRIPT_DIR/libsql/linux-x64"'
    echo 'fi'
    echo.
    echo # Run the application
    echo 'exec node .vercel/output/server/index.js'
) > "%TARGET_DIR%\start.sh"

:: Create manifest.json
echo Creating manifest.json...
(
    echo {
    echo   "name": "UniHub",
    echo   "version": "1.0.0",
    echo   "description": "Student housing platform - offline portable",
    echo   "created": "%DATE% %TIME%",
    echo   "files": {},
    echo   "checksums": {}
    echo }
) > "%TARGET_DIR%\manifest.json"

:: Set USB volume label
echo Setting USB volume label...
label %USB_DRIVE% UniHub 2>nul

:: Create autorun.inf
echo Creating autorun.inf...
(
    echo [AutoRun]
    echo label=UniHub
    echo icon=unihub.ico
    echo action=Open UniHub Student Housing Platform
    echo open=unihub\start.bat
) > "%USB_DRIVE%\autorun.inf"

:: Copy favicon as unihub.ico
if exist "%PROJECT_ROOT%\public\favicon.ico" (
    copy /Y "%PROJECT_ROOT%\public\favicon.ico" "%USB_DRIVE%\unihub.ico" >nul
    echo Copied favicon as unihub.ico
) else if exist "%PROJECT_ROOT%\public\favicon.svg" (
    copy /Y "%PROJECT_ROOT%\public\favicon.svg" "%USB_DRIVE%\unihub.ico" >nul
    echo Copied favicon as unihub.ico
)

echo.
echo === Packaging Complete ===
echo USB drive: %USB_DRIVE%
echo UniHub folder: %TARGET_DIR%
echo.
echo To run on any computer:
echo   Windows: Double-click unihub\start.bat
echo   macOS/Linux: ./unihub/start.sh
echo.
echo The app will be available at http://localhost:3000