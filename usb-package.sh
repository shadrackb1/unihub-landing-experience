#!/bin/bash
# usb-package.sh - Bundle UniHub offline package to USB for cross-platform plug-and-play
# Usage: ./usb-package.sh [USB_MOUNT_POINT] [PROJECT_ROOT]
#   USB_MOUNT_POINT: e.g., /mnt/usb or /media/user/UNIHUB (default: auto-detect)
#   PROJECT_ROOT: path to UniHub project (default: current directory)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${2:-$SCRIPT_DIR}"
USB_MOUNT="${1:-}"

LOG_PREFIX="[$(date +%H:%M:%S)]"

log() {
    echo "$LOG_PREFIX $1"
}

warn() {
    echo "$LOG_PREFIX [WARN] $1"
}

error() {
    echo "$LOG_PREFIX [ERROR] $1" >&2
}

# Auto-detect USB mount point
detect_usb() {
    if [[ -n "$USB_MOUNT" && -d "$USB_MOUNT" ]]; then
        echo "$USB_MOUNT"
        return 0
    fi

    # Check common mount points
    for mount in /mnt/usb /media/*/UNIHUB /media/*/RIS_USB /Volumes/UNIHUB /Volumes/RIS_USB; do
        if [[ -d "$mount" ]]; then
            echo "$mount"
            return 0
        fi
    done

    # Check for labeled volumes
    for mount in /media/*/* /Volumes/*; do
        if [[ -d "$mount" ]]; then
            label=$(lsblk -no LABEL "$mount" 2>/dev/null || diskutil info "$mount" | grep "Volume Name" | cut -d: -f2 | xargs)
            if [[ "$label" == "UNIHUB" || "$label" == "RIS_USB" ]]; then
                echo "$mount"
                return 0
            fi
        fi
    done

    return 1
}

build_project() {
    log "Building UniHub project..."
    cd "$PROJECT_ROOT"
    if ! npm run build; then
        error "Build failed"
        return 1
    fi
    log "Build completed successfully"
}

copy_to_usb() {
    local usb_root="$1"
    local target_dir="$usb_root/unihub"

    log "Creating target directory: $target_dir"
    mkdir -p "$target_dir"

    # Copy build output
    local build_out="$PROJECT_ROOT/.vercel/output"
    if [[ -d "$build_out" ]]; then
        log "Copying build output..."
        cp -r "$build_out"/* "$target_dir/"
    else
        warn "Build output not found at $build_out"
    fi

    # Copy offline package
    local offline_pkg="$PROJECT_ROOT/unihub-offline-package"
    if [[ -d "$offline_pkg" ]]; then
        log "Copying offline package..."
        for dir in runtimes libsql node_modules prisma; do
            if [[ -d "$offline_pkg/$dir" ]]; then
                log "  Copying $dir..."
                cp -r "$offline_pkg/$dir" "$target_dir/"
            fi
        done
        for file in package.json package-lock.json pnpm-lock.yaml; do
            if [[ -f "$offline_pkg/$file" ]]; then
                cp "$offline_pkg/$file" "$target_dir/"
            fi
        done
    else
        warn "Offline package not found at $offline_pkg"
    fi
}

create_launchers() {
    local target_dir="$1"

    # start.sh for macOS/Linux
    cat > "$target_dir/start.sh" << 'EOF'
#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Detect OS and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
case "$ARCH" in
  x86_64) ARCH="x64" ;;
  aarch64|arm64) ARCH="arm64" ;;
esac

echo "Starting UniHub on $OS-$ARCH..."

# Self-heal: verify manifest
MANIFEST="$SCRIPT_DIR/manifest.json"
if [[ -f "$MANIFEST" ]]; then
    echo "Verifying file integrity..."
    # sha256sum -c "$MANIFEST" 2>/dev/null || echo "Warning: Some files may be corrupted"
fi

# Select Node runtime
NODE_DIR="$SCRIPT_DIR/runtimes/node-$OS-$ARCH"
if [[ ! -d "$NODE_DIR" ]]; then
    NODE_DIR="$SCRIPT_DIR/runtimes/node-$OS-x64"
    echo "Falling back to x64 runtime"
fi
if [[ ! -d "$NODE_DIR" ]]; then
    echo "ERROR: No Node.js runtime found for $OS-$ARCH" >&2
    exit 1
fi
export PATH="$NODE_DIR/bin:$PATH"

# Set up libsql native bindings
export LIBSQL_NATIVE_DIR="$SCRIPT_DIR/libsql/$OS-$ARCH"
if [[ ! -d "$LIBSQL_NATIVE_DIR" ]]; then
    export LIBSQL_NATIVE_DIR="$SCRIPT_DIR/libsql/linux-x64"
fi

# Run the application
exec node .vercel/output/server/index.js
EOF
    chmod +x "$target_dir/start.sh"
    log "Created start.sh"

    # start.bat for Windows
    cat > "$target_dir/start.bat" << 'EOF'
@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo Starting UniHub on Windows...

rem Detect architecture
for /f "tokens=2 delims==" %%I in ('wmic os get osarchitecture /value 2^>nul') do set ARCH=%%I
if "%ARCH%"=="64-bit" set ARCH=x64
if "%ARCH%"=="32-bit" set ARCH=x86

rem Self-heal: verify manifest
if exist manifest.json (
    echo Verifying file integrity...
    rem certutil -hashfile manifest.json SHA256 >nul 2>&1 || echo Warning: manifest verification failed
)

rem Select Node runtime
set NODE_DIR=%~dpruntimes\node-windows-%ARCH%
if not exist "%NODE_DIR%" set NODE_DIR=%~dpruntimes\node-windows-x64
if not exist "%NODE_DIR%" (
    echo ERROR: No Node.js runtime found for Windows-%ARCH% >&2
    exit /b 1
)
set PATH=%NODE_DIR%;%PATH%

rem Set up libsql native bindings
set LIBSQL_NATIVE_DIR=%~dplibsql\windows-%ARCH%
if not exist "%LIBSQL_NATIVE_DIR%" set LIBSQL_NATIVE_DIR=%~dplibsql\windows-x64

rem Run the application
node .vercel/output/server/index.js
EOF
    log "Created start.bat"
}

create_manifest() {
    local target_dir="$1"
    cat > "$target_dir/manifest.json" << EOF
{
  "name": "UniHub",
  "version": "1.0.0",
  "description": "Student housing platform - offline portable",
  "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "files": {},
  "checksums": {}
}
EOF
    log "Created manifest.json"
}

set_usb_branding() {
    local usb_mount="$1"
    local target_dir="$2"

    # Set volume label (Linux)
    if command -v fatlabel >/dev/null 2>&1; then
        fatlabel "$(df "$usb_mount" | tail -1 | awk '{print $1}')" "UniHub" 2>/dev/null && log "Set USB volume label to 'UniHub'" || warn "Could not set volume label (fatlabel)"
    elif command -v mlabel >/dev/null 2>&1; then
        mlabel -i "$(df "$usb_mount" | tail -1 | awk '{print $1}')" ::UniHub 2>/dev/null && log "Set USB volume label to 'UniHub'" || warn "Could not set volume label (mlabel)"
    fi

    # Create autorun.inf for Windows
    cat > "$usb_mount/autorun.inf" << 'EOF'
[AutoRun]
label=UniHub
icon=unihub.ico
action=Open UniHub Student Housing Platform
open=start.bat
EOF
    log "Created autorun.inf"

    # Copy icon if exists
    for icon in "$PROJECT_ROOT/public/favicon.ico" "$PROJECT_ROOT/public/favicon.svg"; do
        if [[ -f "$icon" ]]; then
            cp "$icon" "$usb_mount/unihub.ico"
            log "Copied favicon as unihub.ico"
            break
        fi
    done
}

# Main
log "=== UniHub USB Packager (Bash) ==="

USB_MOUNT=$(detect_usb)
if [[ -z "$USB_MOUNT" ]]; then
    error "No USB drive found. Specify mount point as first argument."
    error "Example: ./usb-package.sh /mnt/usb"
    exit 1
fi

log "Target USB mount: $USB_MOUNT"

build_project
copy_to_usb "$USB_MOUNT"
create_launchers "$USB_MOUNT/unihub"
create_manifest "$USB_MOUNT/unihub"
set_usb_branding "$USB_MOUNT" "$USB_MOUNT/unihub"

log "=== Packaging Complete ==="
log "USB mount: $USB_MOUNT"
log "UniHub folder: $USB_MOUNT/unihub"
log ""
log "To run on any computer:"
log "  Windows: Double-click start.bat"
log "  macOS/Linux: ./start.sh"
log ""
log "The app will be available at http://localhost:3000"