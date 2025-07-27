# Docker Development Environment

This directory contains Docker configuration for local development of the Sudoku Solver application.

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- PowerShell (for Windows)

### Simple Commands
```powershell
# Start development environment
.\dev.ps1 start

# Stop development environment  
.\dev.ps1 stop

# Restart development environment
.\dev.ps1 restart

# View logs
.\dev.ps1 logs

# Rebuild containers
.\dev.ps1 build

# Clean up everything
.\dev.ps1 clean
```

## Services

Once started, the following services will be available:

- **Angular UI**: http://localhost:4200
- **C# API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/swagger

## Container Names

The Docker containers are named:
- **sudoku-solver-ui**: Angular frontend
- **sudoku-solver-api**: C# API backend
- **sudoku-solver-network**: Docker network

## Development Features

### Hot Reloading
- **Angular**: File changes in `sudoku-ui/` will automatically trigger rebuilds
- **C# API**: Source code is mounted for easy debugging

### Volume Mounts
- `../sudoku-ui` → `/app` (Angular source)
- `../SudokuSolver` → `/src/SudokuSolver` (C# solver library)
- `../SudokuSolver.API` → `/src/SudokuSolver.API` (C# API)

### Environment
- Development mode enabled
- File watching with polling for Docker compatibility
- CORS configured for local development

## Manual Docker Commands

If you prefer to use Docker commands directly:

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose build

# Clean up
docker-compose down --rmi all --volumes

# Check specific container
docker logs sudoku-solver-ui
docker logs sudoku-solver-api
```

## Troubleshooting

### Port Conflicts
If ports 4200 or 5000 are already in use:
1. Stop the conflicting service
2. Or modify the ports in `docker-compose.yml`

### Build Issues
```powershell
# Clean everything and rebuild
.\dev.ps1 clean
.\dev.ps1 build
.\dev.ps1 start
```

### Angular Hot Reload Not Working
The Angular container uses polling for file watching. If changes aren't detected:
1. Check that the volume mounts are working
2. Restart the containers: `.\dev.ps1 restart`

### API Connection Issues
1. Ensure the API container is running: `docker ps`
2. Check API logs: `docker logs sudoku-solver-api`
3. Verify the API is accessible at http://localhost:5000/swagger

## File Structure

```
docker/
├── Dockerfile.angular          # Angular frontend container
├── Dockerfile.api             # C# API backend container
├── docker-compose.yml         # Main compose configuration
├── docker-compose.override.yml # Development overrides
├── .dockerignore              # Files to exclude from builds
├── build-and-run.ps1          # Full-featured PowerShell script
├── dev.ps1                    # Simple development script
├── health-check.ps1           # Health monitoring
└── README.md                  # This file
```

## Development Workflow

1. **Start the environment**: `.\dev.ps1 start`
2. **Make changes** to your code
3. **View changes** in the browser (Angular hot reloads automatically)
4. **Test API** using Swagger UI
5. **View logs** if needed: `.\dev.ps1 logs`
6. **Stop when done**: `.\dev.ps1 stop`

## Container Management

### View Running Containers
```bash
docker ps --filter "name=sudoku-solver"
```

### View Container Logs
```bash
docker logs sudoku-solver-ui
docker logs sudoku-solver-api
```

### Execute Commands in Containers
```bash
docker exec -it sudoku-solver-ui sh
docker exec -it sudoku-solver-api sh
```

## Production Notes

This setup is designed for local development only. For production:
- Remove volume mounts
- Use multi-stage builds
- Configure proper environment variables
- Set up proper networking and security 