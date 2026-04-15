<#
PerfSight Professor Demo Seeder (PowerShell wrapper)

Runs Docs/demo-seed.js with convenient parameters.

Usage:
  ./demo-seed.ps1
  ./demo-seed.ps1 -ApiRoot http://localhost:5000
  ./demo-seed.ps1 -Email shubham@gmail.com -Password Pass123@
#>

param(
  [string]$ApiRoot = "http://localhost:5000",
  [string]$Name = "Shubham",
  [string]$Email = "shubham@gmail.com",
  [string]$Password = "Pass123@",
  [int]$SeedDays = 30,
  [int]$Concurrency = 2
)

$env:API_ROOT = $ApiRoot
$env:DEMO_NAME = $Name
$env:DEMO_EMAIL = $Email
$env:DEMO_PASSWORD = $Password
$env:SEED_DAYS = "$SeedDays"
$env:CONCURRENCY = "$Concurrency"

$scriptPath = Join-Path $PSScriptRoot "demo-seed.js"

Write-Host "Running demo seeder: $scriptPath" -ForegroundColor Cyan
node $scriptPath
