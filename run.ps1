#!/usr/bin/env pwsh
# Run Admin UI
# Usage: .\run.ps1

# Set terminal title - use both methods to ensure it persists
$host.ui.RawUI.WindowTitle = "Admin UI"
[Console]::Title = "Admin UI"

Write-Host "Starting Admin UI..." -ForegroundColor Green
Write-Host "UI will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""

npm start
