#!/usr/bin/env pwsh

# Sudoku Solver Docker Development Script
# This script builds and runs the Angular frontend and C# API backend in Docker containers

param(
    [switch]$Build,
    [switch]$Run,
    [switch]$Stop,
    [switch]$Clean,
    [switch]$Logs,
    [switch]$Help
)

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Blue = "Blue"
$Reset = "White"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = $Reset
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Help {
    Write-ColorOutput "Sudoku Solver Docker Development Script" $Blue
    Write-ColorOutput "========================================" $Blue
    Write-ColorOutput ""
    Write-ColorOutput "Usage: .\build-and-run.ps1 [options]" $Yellow
    Write-ColorOutput ""
    Write-ColorOutput "Options:" $Yellow
    Write-ColorOutput "  -Build    Build the Docker images" $Green
    Write-ColorOutput "  -Run      Start the containers" $Green
    Write-ColorOutput "  -Stop     Stop the containers" $Green
    Write-ColorOutput "  -Clean    Remove containers and images" $Green
    Write-ColorOutput "  -Logs     Show container logs" $Green
    Write-ColorOutput "  -Help     Show this help message" $Green
    Write-ColorOutput ""
    Write-ColorOutput "Examples:" $Yellow
    Write-ColorOutput "  .\build-and-run.ps1 -Build -Run    # Build and start" $Green
    Write-ColorOutput "  .\build-and-run.ps1 -Stop          # Stop containers" $Green
    Write-ColorOutput "  .\build-and-run.ps1 -Logs          # Show logs" $Green
    Write-ColorOutput ""
    Write-ColorOutput "Services:" $Yellow
    Write-ColorOutput "  Angular UI:    http://localhost:4200" $Green
    Write-ColorOutput "  C# API:        http://localhost:5001" $Green
    Write-ColorOutput "  API Docs:      http://localhost:5001/swagger" $Green
}

function Test-Docker {
    try {
        docker --version | Out-Null
        return $true
    }
    catch {
        Write-ColorOutput "Docker is not installed or not running!" $Red
        Write-ColorOutput "Please install Docker Desktop and ensure it's running." $Red
        return $false
    }
}

function Build-Images {
    Write-ColorOutput "Building Docker images..." $Blue
    
    try {
        # Build images
        Write-ColorOutput "Building Angular frontend..." $Yellow
        docker-compose build sudoku-solver-ui
        
        Write-ColorOutput "Building C# API backend..." $Yellow
        docker-compose build sudoku-solver-api
        
        Write-ColorOutput "Build completed successfully!" $Green
    }
    catch {
        Write-ColorOutput "Build failed!" $Red
        Write-ColorOutput $_.Exception.Message $Red
        exit 1
    }
}

function Start-Containers {
    Write-ColorOutput "Starting containers..." $Blue
    
    try {
        # Start containers in detached mode
        docker-compose up -d
        
        Write-ColorOutput "Containers started successfully!" $Green
        Write-ColorOutput ""
        Write-ColorOutput "Services are now available at:" $Yellow
        Write-ColorOutput "  Angular UI:    http://localhost:4200" $Green
        Write-ColorOutput "  C# API:        http://localhost:5001" $Green
        Write-ColorOutput "  API Docs:      http://localhost:5001/swagger" $Green
        Write-ColorOutput ""
        Write-ColorOutput "Use '.\build-and-run.ps1 -Logs' to view logs" $Yellow
        Write-ColorOutput "Use '.\build-and-run.ps1 -Stop' to stop containers" $Yellow
    }
    catch {
        Write-ColorOutput "Failed to start containers!" $Red
        Write-ColorOutput $_.Exception.Message $Red
        exit 1
    }
}

function Stop-Containers {
    Write-ColorOutput "Stopping containers..." $Blue
    
    try {
        docker-compose down
        Write-ColorOutput "Containers stopped successfully!" $Green
    }
    catch {
        Write-ColorOutput "Failed to stop containers!" $Red
        Write-ColorOutput $_.Exception.Message $Red
    }
}

function Show-Logs {
    Write-ColorOutput "Showing container logs..." $Blue
    
    try {
        docker-compose logs -f
    }
    catch {
        Write-ColorOutput "Failed to show logs!" $Red
        Write-ColorOutput $_.Exception.Message $Red
    }
}

function Clean-All {
    Write-ColorOutput "Cleaning up Docker resources..." $Blue
    
    try {
        # Stop and remove containers
        docker-compose down --rmi all --volumes --remove-orphans
        
        # Remove any dangling images
        docker image prune -f
        
        Write-ColorOutput "Cleanup completed successfully!" $Green
    }
    catch {
        Write-ColorOutput "Cleanup failed!" $Red
        Write-ColorOutput $_.Exception.Message $Red
    }
}

# Main script logic
if ($Help) {
    Show-Help
    exit 0
}

# Check if Docker is available
if (-not (Test-Docker)) {
    exit 1
}

# Process commands
if ($Build) {
    Build-Images
}

if ($Run) {
    Start-Containers
}

if ($Stop) {
    Stop-Containers
}

if ($Clean) {
    Clean-All
}

if ($Logs) {
    Show-Logs
}

# If no specific action is provided, show help
if (-not ($Build -or $Run -or $Stop -or $Clean -or $Logs)) {
    Show-Help
} 