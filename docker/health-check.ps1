#!/usr/bin/env pwsh

# Health check script for Sudoku Solver development environment

$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$Blue = "`e[34m"
$Reset = "`e[0m"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = $Reset)
    Write-Host "$Color$Message$Reset"
}

function Test-Url {
    param([string]$Url, [string]$ServiceName)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-ColorOutput "✓ $ServiceName is running" $Green
            return $true
        } else {
            Write-ColorOutput "✗ $ServiceName returned status $($response.StatusCode)" $Red
            return $false
        }
    }
    catch {
        Write-ColorOutput "✗ $ServiceName is not responding" $Red
        return $false
    }
}

function Test-DockerContainers {
    Write-ColorOutput "Checking Docker containers..." $Blue
    
    try {
        $containers = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        Write-ColorOutput $containers $Yellow
        
        $running = docker ps --filter "name=sudoku-solver" --format "{{.Names}}" | Measure-Object | Select-Object -ExpandProperty Count
        if ($running -ge 2) {
            Write-ColorOutput "✓ All containers are running" $Green
            return $true
        } else {
            Write-ColorOutput "✗ Not all containers are running" $Red
            return $false
        }
    }
    catch {
        Write-ColorOutput "✗ Failed to check Docker containers" $Red
        return $false
    }
}

# Main health check
Write-ColorOutput "Sudoku Solver Health Check" $Blue
Write-ColorOutput "=========================" $Blue
Write-ColorOutput ""

# Check Docker containers
$containersOk = Test-DockerContainers
Write-ColorOutput ""

# Check services
Write-ColorOutput "Checking services..." $Blue
$angularOk = Test-Url "http://localhost:4200" "Angular UI"
$apiOk = Test-Url "http://localhost:5001/swagger" "C# API"
Write-ColorOutput ""

# Summary
Write-ColorOutput "Health Check Summary:" $Blue
if ($containersOk -and $angularOk -and $apiOk) {
    Write-ColorOutput "✓ All systems operational!" $Green
    Write-ColorOutput ""
    Write-ColorOutput "You can now access:" $Yellow
    Write-ColorOutput "  Angular UI:    http://localhost:4200" $Green
    Write-ColorOutput "  C# API:        http://localhost:5001" $Green
    Write-ColorOutput "  API Docs:      http://localhost:5001/swagger" $Green
} else {
    Write-ColorOutput "✗ Some services are not working properly" $Red
    Write-ColorOutput ""
    Write-ColorOutput "Troubleshooting:" $Yellow
    Write-ColorOutput "  1. Run '.\dev.ps1 restart' to restart services" $Green
    Write-ColorOutput "  2. Check logs with '.\dev.ps1 logs'" $Green
    Write-ColorOutput "  3. Rebuild with '.\dev.ps1 build'" $Green
} 