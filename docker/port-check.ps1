#!/usr/bin/env pwsh

# Port conflict checker for Sudoku Solver development environment

$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$Blue = "`e[34m"
$Reset = "`e[0m"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = $Reset)
    Write-Host "$Color$Message$Reset"
}

function Test-Port {
    param([int]$Port, [string]$ServiceName)
    
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($connection) {
            Write-ColorOutput "✗ Port $Port is in use by $ServiceName" $Red
            return $false
        } else {
            Write-ColorOutput "✓ Port $Port is available for $ServiceName" $Green
            return $true
        }
    }
    catch {
        Write-ColorOutput "✓ Port $Port is available for $ServiceName" $Green
        return $true
    }
}

function Show-PortUsage {
    param([int]$Port)
    
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                    Select-Object -ExpandProperty OwningProcess | 
                    ForEach-Object { Get-Process -Id $_ -ErrorAction SilentlyContinue } |
                    Select-Object ProcessName, Id, Path -Unique
        
        if ($processes) {
            Write-ColorOutput "Processes using port $Port:" $Yellow
            foreach ($process in $processes) {
                Write-ColorOutput "  - $($process.ProcessName) (PID: $($process.Id))" $Red
            }
        }
    }
    catch {
        Write-ColorOutput "Could not determine what's using port $Port" $Yellow
    }
}

# Main port check
Write-ColorOutput "Sudoku Solver Port Check" $Blue
Write-ColorOutput "=======================" $Blue
Write-ColorOutput ""

$portsOk = $true

# Check Angular port
$angularOk = Test-Port -Port 4200 -ServiceName "Angular UI"
if (-not $angularOk) {
    Show-PortUsage -Port 4200
    $portsOk = $false
}

# Check API port
$apiOk = Test-Port -Port 5001 -ServiceName "C# API"
if (-not $apiOk) {
    Show-PortUsage -Port 5001
    $portsOk = $false
}

Write-ColorOutput ""

if ($portsOk) {
    Write-ColorOutput "✓ All ports are available!" $Green
    Write-ColorOutput "You can safely start the development environment." $Green
    exit 0
} else {
    Write-ColorOutput "✗ Port conflicts detected!" $Red
    Write-ColorOutput ""
    Write-ColorOutput "Solutions:" $Yellow
    Write-ColorOutput "  1. Stop the conflicting processes" $Green
    Write-ColorOutput "  2. Or modify ports in docker-compose.yml" $Green
    Write-ColorOutput "  3. Or use different ports for your other services" $Green
    Write-ColorOutput ""
    Write-ColorOutput "To kill a process using a port:" $Yellow
    Write-ColorOutput "  Stop-Process -Id <PID> -Force" $Green
    exit 1
} 