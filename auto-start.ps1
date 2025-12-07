# auto-start.ps1
$ErrorActionPreference = "Stop"

# --- HELPER: FUNCTION TO FOCUS WINDOW ---
Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  public class WindowUtils {
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool SetForegroundWindow(IntPtr hWnd);
  }
"@

# --- HELPER: CHECK IF PORT IS LISTENING ---
function Test-PortOpen ($Port) {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return ($null -ne $conn)
}

Write-Host "==========================================" -ForegroundColor Green
Write-Host "   CDM PROGRESS TRACKER - AUTO STARTUP    " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# --- 0. PRE-FLIGHT CHECK ---
if (-not (Test-Path "package.json")) {
    Write-Host "[X] Error: package.json not found. Please run this script inside the project folder." -ForegroundColor Red
    Start-Sleep -Seconds 5
    exit
}

# --- 1. SYSTEM HEALTH CHECK ---
Write-Host "`n--- 1. SYSTEM HEALTH CHECK ---" -ForegroundColor Cyan

# Check Node.js
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js missing. Installing..." -ForegroundColor Yellow
    winget install --id "OpenJS.NodeJS" -e --accept-source-agreements --accept-package-agreements
    # Refresh Env Vars
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

# Check MongoDB
$MongoService = Get-Service "MongoDB" -ErrorAction SilentlyContinue
if (-not $MongoService -and -not (Get-Command "mongod" -ErrorAction SilentlyContinue)) {
    Write-Host "MongoDB not detected. Attempting install..." -ForegroundColor Yellow
    winget install --id "MongoDB.Server" -e --accept-source-agreements --accept-package-agreements
} else {
    Write-Host "[OK] MongoDB is present." -ForegroundColor Gray
}

# Check Dependencies
if (-not (Test-Path 'node_modules')) {
    Write-Host "Dependencies missing. Running 'npm install'..." -ForegroundColor Yellow
    npm install
}

# --- 2. GENERATE BUILD METADATA ---
Write-Host "`n--- 2. GENERATING VERSION INFO ---" -ForegroundColor Cyan
if (Test-Path "generate-build-version.js") {
    node generate-build-version.js
} else {
    Write-Host "[!] Warning: generate-build-version.js not found." -ForegroundColor Red
}

# --- 3. SERVER STARTUP (BACKEND) ---
Write-Host "`n--- 3. STARTING BACKEND (Port 5000) ---" -ForegroundColor Cyan

if (-not (Test-PortOpen 5000)) {
    Write-Host "Launching Backend Server..." -ForegroundColor Yellow
    
    # FIXED: Replaced " with '' (escaped single quotes) for title
    $BackendCmd = '$host.UI.RawUI.WindowTitle = ''CDM Backend Server''; node server.js'
    Start-Process powershell -WindowStyle Minimized -ArgumentList "-NoExit", "-Command", $BackendCmd
    
    Write-Host "Waiting for Backend to listen on port 5000..." -NoNewline
    $Retries = 0
    do {
        Start-Sleep -Seconds 1
        Write-Host "." -NoNewline
        $BackendReady = Test-PortOpen 5000
        $Retries++
    } until ($BackendReady -or $Retries -gt 30)
    
    if ($BackendReady) {
        Write-Host "`n[OK] Backend is online!" -ForegroundColor Green
    } else {
        Write-Host "`n[X] Backend failed to start. Check the 'CDM Backend Server' window for errors." -ForegroundColor Red
        exit
    }
} else {
    Write-Host "Backend is already running." -ForegroundColor Gray
}

# --- 4. SERVER STARTUP (FRONTEND) ---
Write-Host "`n--- 4. STARTING FRONTEND (Port 3000) ---" -ForegroundColor Cyan

if (-not (Test-PortOpen 3000)) {
    Write-Host "Launching React App..." -ForegroundColor Yellow
    
    # FIXED: Replaced " with '' (escaped single quotes) for title and browser env
    $FrontendCmd = '$host.UI.RawUI.WindowTitle = ''CDM React Frontend''; $env:BROWSER=''none''; npm start'
    Start-Process powershell -WindowStyle Minimized -ArgumentList "-NoExit", "-Command", $FrontendCmd
    
    Write-Host "Waiting for React to initialize..." -NoNewline
    $Retries = 0
    do {
        Start-Sleep -Seconds 2
        Write-Host "." -NoNewline
        $FrontendReady = Test-PortOpen 3000
        $Retries++
    } until ($FrontendReady -or $Retries -gt 60)
    
    if ($FrontendReady) {
         Write-Host "`n[OK] Frontend is online!" -ForegroundColor Green
    }
} else {
    Write-Host "Frontend is already running." -ForegroundColor Gray
}

# --- 5. SMART BROWSER LAUNCH ---
Write-Host "`n--- 5. LAUNCHING BROWSER ---" -ForegroundColor Cyan

$AppUrl = "http://localhost:3000"

# Check if Chrome is already connected to Port 3000
$ChromeConnected = Get-NetTCPConnection -RemotePort 3000 -State Established -ErrorAction SilentlyContinue | Where-Object { 
    try {
        $Proc = Get-Process -Id $_.OwningProcess -ErrorAction Stop
        return ($Proc.ProcessName -eq "chrome")
    } catch {
        return $false
    }
}

if ($ChromeConnected) {
    Write-Host "Chrome is already open. Switching focus..." -ForegroundColor Green
    $ChromeProc = Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
    if ($ChromeProc) {
        [WindowUtils]::SetForegroundWindow($ChromeProc.MainWindowHandle) | Out-Null
    }
} else {
    Write-Host "Opening new browser tab..." -ForegroundColor Green
    Start-Process $AppUrl
}

Write-Host "`n[OK] SYSTEM READY!" -ForegroundColor Green
Start-Sleep -Seconds 3