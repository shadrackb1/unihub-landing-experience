# UniHub USB Packager

Creates a complete, self-contained UniHub distribution on a USB flash drive that works **plug-and-play on any computer** (Windows, macOS, Linux) with **zero installation required**.

## What's Included

- ✅ Built UniHub application (TanStack Start + React 19)
- ✅ Cross-platform Node.js runtimes (Windows/macOS/Linux × x64/arm64)
- ✅ libsql native bindings for all platforms
- ✅ All npm dependencies (node_modules)
- ✅ Prisma schema and migrations
- ✅ **Self-healing launchers** (`start.bat` for Windows, `start.sh` for macOS/Linux)
- ✅ USB volume label branding ("UniHub")
- ✅ Windows `autorun.inf` with custom icon
- ✅ File integrity manifest for self-repair

## Quick Start

### Windows (PowerShell)
```powershell
# From the UniHub project root
.\usb-package.ps1

# Or specify USB drive letter explicitly
.\usb-package.ps1 -UsbDriveLetter "F:"
```

### macOS / Linux (Bash)
```bash
# From the UniHub project root
./usb-package.sh

# Or specify USB mount point explicitly
./usb-package.sh /mnt/usb
```

## How It Works

1. **Builds** the project (`npm run build`)
2. **Copies** everything to USB:
   - `.vercel/output/` → `unihub/` (the compiled app)
   - `unihub-offline-package/runtimes/` → `unihub/runtimes/` (Node.js for all platforms)
   - `unihub-offline-package/libsql/` → `unihub/libsql/` (native bindings)
   - `unihub-offline-package/node_modules/` → `unihub/node_modules/`
   - `unihub-offline-package/prisma/` → `unihub/prisma/`
3. **Creates launchers** that:
   - Auto-detect OS and architecture
   - Select the correct Node.js runtime
   - Set up libsql native bindings path
   - Verify file integrity via manifest
   - Launch the app on `http://localhost:3000`
4. **Brands the USB**:
   - Sets volume label to "UniHub"
   - Creates `autorun.inf` for Windows auto-launch
   - Copies favicon as `unihub.ico`

## Running on Target Computer

### Windows
1. Plug in USB
2. Open File Explorer → UniHub drive
3. Double-click `unihub/start.bat`
4. Browser opens at `http://localhost:3000`

### macOS
1. Plug in USB
2. Open Terminal
3. `cd /Volumes/UniHub/unihub`
4. `./start.sh`
5. Browser opens at `http://localhost:3000`

### Linux
1. Plug in USB
2. `cd /media/$USER/UniHub/unihub` (or wherever mounted)
3. `./start.sh`
4. Browser opens at `http://localhost:3000`

## Self-Healing

The launchers include integrity verification:
- On startup, they check `manifest.json` for file checksums
- If files are corrupted (bad flash, partial copy), they report which files failed
- Re-run the packager script to repair

## Requirements

- **Source machine**: Node.js 20+, pnpm, project dependencies installed
- **Target machine**: Nothing! Everything runs from USB

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No USB drive found" | Specify path explicitly: `.\usb-package.ps1 -UsbDriveLetter "E:"` or `./usb-package.sh /mnt/usb` |
| "No Node.js runtime found" | Run packager on a machine with internet to download runtimes first |
| Port 3000 in use | Edit `start.sh`/`start.bat` to pass `--port 3001` to Node |
| Permission denied on `start.sh` | Run `chmod +x start.sh` |

## Directory Structure on USB

```
UniHub/ (volume label)
├── autorun.inf          # Windows auto-launch
├── unihub.ico           # USB drive icon
└── unihub/
    ├── start.bat        # Windows launcher
    ├── start.sh         # macOS/Linux launcher
    ├── manifest.json    # File integrity manifest
    ├── .vercel/output/  # Compiled application
    ├── runtimes/        # Node.js per platform
    │   ├── node-windows-x64/
    │   ├── node-windows-arm64/
    │   ├── node-darwin-x64/
    │   ├── node-darwin-arm64/
    │   ├── node-linux-x64/
    │   └── node-linux-arm64/
    ├── libsql/          # Native bindings per platform
    │   ├── windows-x64/
    │   ├── darwin-x64/
    │   ├── darwin-arm64/
    │   ├── linux-x64/
    │   └── linux-arm64/
    ├── node_modules/    # All npm dependencies
    ├── prisma/          # Database schema
    └── package.json
```

## License

Part of UniHub Student Housing Platform.