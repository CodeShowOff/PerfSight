# PerfSight Test Data Generator
# This script populates your PerfSight dashboard with sample metrics

param(
    [string]$Token = "",
    [string]$ApiUrl = "http://localhost:5000/api/metrics",
    [int]$MetricsPerService = 50
)

# Check if token is provided
if ($Token -eq "") {
    Write-Host "❌ Error: JWT token is required!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\populate-metrics.ps1 -Token 'YOUR_JWT_TOKEN_HERE'"
    Write-Host ""
    Write-Host "To get a token:" -ForegroundColor Cyan
    Write-Host "  1. Register: POST http://localhost:5000/api/users"
    Write-Host "  2. Login: POST http://localhost:5000/api/users/auth"
    Write-Host "  3. Copy the JWT token from the response"
    exit 1
}

# Services to monitor
$services = @(
    "api-gateway",
    "auth-service",
    "user-service",
    "payment-service",
    "notification-service"
)

$endpoints = @(
    "/api/users",
    "/api/products",
    "/api/orders",
    "/login",
    "/register",
    "/profile",
    "/search",
    "/checkout"
)

$methods = @("GET", "POST", "PUT", "DELETE")

Write-Host "🚀 PerfSight Test Data Generator" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Services: $($services.Count)" -ForegroundColor Green
Write-Host "📈 Metrics per service: $MetricsPerService" -ForegroundColor Green
Write-Host "🎯 Total metrics to send: $($services.Count * $MetricsPerService)" -ForegroundColor Green
Write-Host ""

$successCount = 0
$failureCount = 0

foreach ($service in $services) {
    Write-Host "📤 Sending metrics for: $service" -ForegroundColor Yellow
    
    for ($i = 1; $i -le $MetricsPerService; $i++) {
        # Generate random but realistic test data
        $endpoint = $endpoints | Get-Random
        $method = $methods | Get-Random
        $latency = Get-Random -Minimum 20 -Maximum 300
        $memory = Get-Random -Minimum 128 -Maximum 512
        $cpu = Get-Random -Minimum 5 -Maximum 50
        
        # Occasionally simulate slow requests
        if ((Get-Random -Minimum 1 -Maximum 100) -gt 90) {
            $latency = Get-Random -Minimum 500 -Maximum 2000
        }
        
        # Occasionally simulate errors
        $statusCode = if ((Get-Random -Minimum 1 -Maximum 100) -gt 95) { 
            @(400, 404, 500) | Get-Random 
        } else { 
            200 
        }
        
        $body = @{
            service = $service
            endpoint = $endpoint
            latency = $latency
            memory = $memory
            cpu = $cpu
            statusCode = $statusCode
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri $ApiUrl `
                -Method Post `
                -Headers @{
                    "Content-Type" = "application/json"
                    "Authorization" = "Bearer $Token"
                } `
                -Body $body `
                -ErrorAction Stop
            
            $successCount++
            
            # Show progress every 10 metrics
            if ($i % 10 -eq 0) {
                Write-Host "  ✓ Sent $i/$MetricsPerService metrics" -ForegroundColor Gray
            }
        }
        catch {
            $failureCount++
            Write-Host "  ✗ Failed to send metric: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # Small delay to avoid overwhelming the server
        Start-Sleep -Milliseconds 100
    }
    
    Write-Host "  ✅ Completed $service ($MetricsPerService metrics)" -ForegroundColor Green
    Write-Host ""
}

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "📊 Summary" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Successful: $successCount" -ForegroundColor Green
if ($failureCount -gt 0) {
    Write-Host "❌ Failed: $failureCount" -ForegroundColor Red
}
Write-Host ""
Write-Host "⏳ Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Wait 60 seconds for the analysis worker to process metrics"
Write-Host "  2. Make sure the worker is running: npm run worker"
Write-Host "  3. Refresh your dashboard at http://localhost:3000"
Write-Host ""
Write-Host "🎉 Done! Your dashboard should populate soon!" -ForegroundColor Green
