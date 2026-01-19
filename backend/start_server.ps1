# Backend Server Startup Script
Write-Host "=== Starting Backend Server ===" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location $PSScriptRoot

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file with DATABASE_URL" -ForegroundColor Yellow
    Write-Host "Example: DATABASE_URL=postgresql://user:password@localhost:5432/meal_recommendation" -ForegroundColor Yellow
    exit 1
}

# Check Python
Write-Host "Python version:" -ForegroundColor Yellow
python --version

# Check dependencies
Write-Host "Checking dependencies..." -ForegroundColor Yellow
$missing = @()
$packages = @("fastapi", "uvicorn", "sqlalchemy", "psycopg2")
foreach ($pkg in $packages) {
    $installed = pip show $pkg 2>&1
    if ($LASTEXITCODE -ne 0) {
        $missing += $pkg
    }
}

if ($missing.Count -gt 0) {
    Write-Host "ERROR: Missing packages: $($missing -join ', ')" -ForegroundColor Red
    Write-Host "Installing missing packages..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

# Test database connection
Write-Host "Testing database connection..." -ForegroundColor Yellow
try {
    python -c "from app.repositories.database import engine; conn = engine.connect(); conn.close(); print('✅ Database connection OK')" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: Database connection failed, but continuing..." -ForegroundColor Yellow
        Write-Host "Make sure PostgreSQL is running and .env has correct DATABASE_URL" -ForegroundColor Yellow
    }
} catch {
    Write-Host "WARNING: Could not test database connection" -ForegroundColor Yellow
}

# Start server
Write-Host ""
Write-Host "Starting FastAPI server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API docs at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
