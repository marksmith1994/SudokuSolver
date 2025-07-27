#!/usr/bin/env pwsh

# Quick development script for Sudoku Solver
# This script provides easy commands for development workflow

param(
    [Parameter(Position=0)]
    [ValidateSet("start", "stop", "restart", "logs", "build", "clean")]
    [string]$Command = "start"
)

# Colors for output
$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$Blue = "`e[34m"
$Reset = "`e[0m"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = $Reset)
    Write-Host "$Color$Message$Reset"
}

function Show-Status {
    Write-ColorOutput "Sudoku Solver Development Environment" $Blue
    Write-ColorOutput "=====================================" $Blue
    Write-ColorOutput ""
    Write-ColorOutput "Services:" $Yellow
    Write-ColorOutput "  Angular UI:    http://localhost:4200" $Green
    Write-ColorOutput "  C# API:        http://localhost:5001" $Green
    Write-ColorOutput "  API Docs:      http://localhost:5001/swagger" $Green
    Write-ColorOutput ""
    Write-ColorOutput "Commands:" $Yellow
    Write-ColorOutput "  .\dev.ps1 start    - Start development environment" $Green
    Write-ColorOutput "  .\dev.ps1 stop     - Stop development environment" $Green
    Write-ColorOutput "  .\dev.ps1 restart  - Restart development environment" $Green
    Write-ColorOutput "  .\dev.ps1 logs     - Show container logs" $Green
    Write-ColorOutput "  .\dev.ps1 build    - Rebuild containers" $Green
    Write-ColorOutput "  .\dev.ps1 clean    - Clean up everything" $Green
}

# Change to docker directory
Push-Location docker

try {
    switch ($Command) {
        "start" {
            Write-ColorOutput "Starting Sudoku Solver development environment..." $Blue
            docker-compose up -d
            Write-ColorOutput "Development environment started!" $Green
            Show-Status
        }
        "stop" {
            Write-ColorOutput "Stopping development environment..." $Blue
            docker-compose down
            Write-ColorOutput "Development environment stopped!" $Green
        }
        "restart" {
            Write-ColorOutput "Restarting development environment..." $Blue
            docker-compose down
            docker-compose up -d
            Write-ColorOutput "Development environment restarted!" $Green
            Show-Status
        }
        "logs" {
            Write-ColorOutput "Showing container logs (Ctrl+C to exit)..." $Blue
            docker-compose logs -f
        }
        "build" {
            Write-ColorOutput "Building containers..." $Blue
            docker-compose build
            Write-ColorOutput "Build completed!" $Green
        }
        "clean" {
            Write-ColorOutput "Cleaning up Docker resources..." $Blue
            docker-compose down --rmi all --volumes --remove-orphans
            docker image prune -f
            Write-ColorOutput "Cleanup completed!" $Green
        }
    }
}
catch {
    Write-ColorOutput "Error: $($_.Exception.Message)" $Red
    exit 1
}
finally {
    Pop-Location
} 