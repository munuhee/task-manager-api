param(
  [switch]$UseDocker
)

Write-Host "Bootstrap script for Task Manager API" -ForegroundColor Cyan

# Check Node
try {
  $node = & node -v 2>$null
  $npm = & npm -v 2>$null
} catch {
  $node = $null
  $npm = $null
}

if (-not $node -or -not $npm) {
  Write-Host "Node.js/npm not found. Install Node.js LTS from https://nodejs.org/" -ForegroundColor Yellow
  exit 1
}

Write-Host "Node: $node" -ForegroundColor Green
Write-Host "npm: $npm" -ForegroundColor Green

Push-Location -Path (Join-Path $PSScriptRoot "..")

Write-Host "Running npm install..." -ForegroundColor Cyan
npm install

if ($UseDocker) {
  # Check docker
  try { $dc = & docker -v 2>$null } catch { $dc = $null }
  if (-not $dc) {
    Write-Host "Docker not found. Install Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Pop-Location
    exit 1
  }

  Write-Host "Building and starting containers with docker-compose..." -ForegroundColor Cyan
  docker-compose build
  docker-compose up -d
  Write-Host "Containers started. Use 'docker-compose logs -f' to follow logs." -ForegroundColor Green
  Pop-Location
  exit 0
}

Write-Host "If you want to run with Docker, re-run this script with -UseDocker." -ForegroundColor Yellow
Write-Host "To start the API locally after install, run: npm start (or npm run dev)" -ForegroundColor Cyan

Pop-Location
