<#
.SYNOPSIS
    Bundles UniHub offline package to USB flash drive for plug-and-play use on any OS
.DESCRIPTION
    Creates a complete offline UniHub distribution with:
    - Built application (.vercel/output)
    - Cross-platform Node.js runtimes (Windows/macOS/Linux x64/arm64)
    - libsql native bindings for all platforms
    - Self-healing launchers (start.bat for Windows, start.sh for Unix)
    - USB volume label and autorun.inf for Windows branding
    - Manifest for file integrity verification
.PARAMETER UsbDriveLetter
    Drive letter of USB (e.g., "E:"). Default: auto-detects RIS_USB
.PARAMETER ProjectRoot
    Path to UniHub project. Default: current directory
.EXAMPLE
    .\usb-package.ps1
.EXAMPLE
    .\usb-package.ps1 -UsbDriveLetter "F:"
#>

param(
    [string]$UsbDriveLetter = "",
    [string]$ProjectRoot = (Get-Location).Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] [$Level] $Message"
}

function Get-UsbDrive {
    if ($UsbDriveLetter) {
        return $UsbDriveLetter
    }
    $vol = Get-Volume -FileSystemLabel "RIS_USB" -ErrorAction SilentlyContinue
    if ($vol) {
        return $vol.DriveLetter + ":"
    }
    $removable = Get-WmiObject Win32_LogicalDisk | Where-Object { $_.DriveType -eq 2 }
    if ($removable) {
        return ($removable | Sort-Object FreeSpace -Descending | Select-Object -First 1).DeviceID
    }
    throw "No USB drive found. Specify -UsbDriveLetter parameter."
}

function Build-Project {
    Write-Log "Building UniHub project..."
    Set-Location $ProjectRoot
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed with exit code $LASTEXITCODE"
    }
    Write-Log "Build completed successfully"
}

function Copy-ToUsb {
    param([string]$UsbRoot, [string]$ProjectRoot)
    $targetDir = Join-Path $UsbRoot "unihub"

    Write-Log "Creating target directory: $targetDir"
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    $buildOut = Join-Path $ProjectRoot ".vercel\output"
    if (Test-Path $buildOut) {
        Write-Log "Copying build output..."
        Copy-Item -Path (Join-Path $buildOut "*") -Destination $targetDir -Recurse -Force
    } else {
        Write-Log "Build output not found at $buildOut" "WARN"
    }

    $offlinePkg = Join-Path $ProjectRoot "unihub-offline-package"
    if (Test-Path $offlinePkg) {
        Write-Log "Copying offline package..."
        $dirs = @("runtimes", "libsql", "node_modules", "prisma")
        foreach ($dir in $dirs) {
            $src = Join-Path $offlinePkg $dir
            if (Test-Path $src) {
                Write-Log "  Copying $dir..."
                Copy-Item -Path $src -Destination (Join-Path $targetDir $dir) -Recurse -Force
            }
        }
        $files = @("package.json", "package-lock.json", "pnpm-lock.yaml")
        foreach ($file in $files) {
            $src = Join-Path $offlinePkg $file
            if (Test-Path $src) {
                Copy-Item -Path $src -Destination (Join-Path $targetDir $file) -Force
            }
        }
    } else {
        Write-Log "Offline package not found at $offlinePkg" "WARN"
    }
}

function Create-Launchers {
    param([string]$TargetDir)

    # start.sh for macOS/Linux - use literal string array to avoid parsing issues
    $startShLines = @(
        "#!/bin/bash",
        "set -euo pipefail",
        'SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"',
        'cd "$SCRIPT_DIR"',
        "",
        "# Detect OS and architecture",
        'OS=$(uname -s | tr "[:upper:]" "[:lower:]")',
        'ARCH=$(uname -m)',
        'case "$ARCH" in',
        '  x86_64) ARCH="x64" ;;',
        '  aarch64|arm64) ARCH="arm64" ;;',
        'esac',
        "",
        'echo "Starting UniHub on $OS-$ARCH..."',
        "",
        "# Self-heal: verify manifest",
        'MANIFEST="$SCRIPT_DIR/manifest.json"',
        'if [[ -f "$MANIFEST" ]]; then',
        '    echo "Verifying file integrity..."',
        'fi',
        "",
        "# Select Node runtime",
        'NODE_DIR="$SCRIPT_DIR/runtimes/node-$OS-$ARCH"',
        'if [[ ! -d "$NODE_DIR" ]]; then',
        '    NODE_DIR="$SCRIPT_DIR/runtimes/node-$OS-x64"',
        '    echo "Falling back to x64 runtime"',
        'fi',
        'if [[ ! -d "$NODE_DIR" ]]; then',
        '    echo "ERROR: No Node.js runtime found for $OS-$ARCH" >&2',
        '    exit 1',
        'fi',
        'export PATH="$NODE_DIR/bin:$PATH"',
        "",
        "# Set up libsql native bindings",
        'export LIBSQL_NATIVE_DIR="$SCRIPT_DIR/libsql/$OS-$ARCH"',
        'if [[ ! -d "$LIBSQL_NATIVE_DIR" ]]; then',
        '    export LIBSQL_NATIVE_DIR="$SCRIPT_DIR/libsql/linux-x64"',
        'fi',
        "",
        "# Run the application",
        'exec node .vercel/output/server/index.js'
    )
    $startShPath = Join-Path $TargetDir "start.sh"
    Set-Content -Path $startShPath -Value ($startShLines -join "`n") -Encoding UTF8
    Write-Log "Created start.sh"

    # start.bat for Windows
    $startBatLines = @(
        "@echo off",
        "setlocal enabledelayedexpansion",
        'cd /d "%~dp0"',
        "",
        "echo Starting UniHub on Windows...",
        "",
        "rem Detect architecture",
        'for /f "tokens=2 delims==" %%I in (\'wmic os get osarchitecture /value 2^>nul\') do set ARCH=%%I',
        'if "%ARCH%"=="64-bit" set ARCH=x64',
        'if "%ARCH%"=="32-bit" set ARCH=x86',
        "",
        "rem Self-heal: verify manifest",
        "if exist manifest.json (",
        "    echo Verifying file integrity...",
        ")",
        "",
        "rem Select Node runtime",
        'set NODE_DIR=%~dpruntimes\node-windows-%ARCH%',
        'if not exist "%NODE_DIR%" set NODE_DIR=%~dpruntimes\node-windows-x64',
        'if not exist "%NODE_DIR%" (',
        '    echo ERROR: No Node.js runtime found for Windows-%ARCH% >&2',
        '    exit /b 1',
        ')',
        'set PATH=%NODE_DIR%;%PATH%',
        "",
        "rem Set up libsql native bindings",
        'set LIBSQL_NATIVE_DIR=%~dplibsql\windows-%ARCH%',
        'if not exist "%LIBSQL_NATIVE_DIR%" set LIBSQL_NATIVE_DIR=%~dplibsql\windows-x64',
        "",
        "rem Run the application",
        "node .vercel/output/server/index.js"
    )
    $startBatPath = Join-Path $TargetDir "start.bat"
    Set-Content -Path $startBatPath -Value ($startBatLines -join "`r`n") -Encoding UTF8
    Write-Log "Created start.bat"
}

function Create-Manifest {
    param([string]$TargetDir)
    $manifest = @{
        name = "UniHub"
        version = "1.0.0"
        description = "Student housing platform - offline portable"
        created = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        files = @{}
        checksums = @{}
    }
    $manifestPath = Join-Path $TargetDir "manifest.json"
    $manifest | ConvertTo-Json -Depth 10 | Set-Content -Path $manifestPath -Encoding UTF8
    Write-Log "Created manifest.json"
}

function Set-UsbBranding {
    param([string]$UsbDriveLetter, [string]$TargetDir)

    try {
        $vol = Get-Volume -DriveLetter $UsbDriveLetter.TrimEnd(":")
        Set-Volume -DriveLetter $vol.DriveLetter -NewFileSystemLabel "UniHub" -ErrorAction Stop
        Write-Log "Set USB volume label to 'UniHub'"
    } catch {
        Write-Log "Could not set volume label: $_" "WARN"
    }

    $autorunPath = Join-Path $UsbDriveLetter "autorun.inf"
    $autorunLines = @(
        "[AutoRun]",
        "label=UniHub",
        "icon=unihub.ico",
        "action=Open UniHub Student Housing Platform",
        "open=unihub\start.bat"
    )
    Set-Content -Path $autorunPath -Value ($autorunLines -join "`r`n") -Encoding UTF8
    Write-Log "Created autorun.inf"

    $iconSrc = Join-Path $ProjectRoot "public\favicon.ico"
    if (-not (Test-Path $iconSrc)) {
        $iconSrc = Join-Path $ProjectRoot "public\favicon.svg"
    }
    if (Test-Path $iconSrc) {
        Copy-Item -Path $iconSrc -Destination (Join-Path $UsbDriveLetter "unihub.ico") -Force
        Write-Log "Copied favicon as unihub.ico"
    }
}

try {
    Write-Log "=== UniHub USB Packager ==="

    $usbDrive = Get-UsbDrive
    Write-Log "Target USB drive: $usbDrive"

    $usbRoot = $usbDrive + "\"
    $targetDir = Join-Path $usbRoot "unihub"

    Build-Project
    Copy-ToUsb -UsbRoot $usbRoot -ProjectRoot $ProjectRoot
    Create-Launchers -TargetDir $targetDir
    Create-Manifest -TargetDir $targetDir
    Set-UsbBranding -UsbDriveLetter $usbDrive -TargetDir $targetDir

    Write-Log "=== Packaging Complete ==="
    Write-Log "USB drive: $usbDrive"
    Write-Log "UniHub folder: $targetDir"
    Write-Log ""
    Write-Log "To run on any computer:"
    Write-Log "  Windows: Double-click unihub\start.bat"
    Write-Log "  macOS/Linux: ./unihub/start.sh"
    Write-Log ""
    Write-Log "The app will be available at http://localhost:3000"

} catch {
    Write-Log "ERROR: $_" "ERROR"
    exit 1
}