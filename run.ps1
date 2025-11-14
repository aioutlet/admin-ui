#!/usr/bin/env pwsh
# Run Admin UI
# Usage: .\run.ps1

Write-Host "Starting Admin UI..." -ForegroundColor Green
Write-Host "UI will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""

npm start
