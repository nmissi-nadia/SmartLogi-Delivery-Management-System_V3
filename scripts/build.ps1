# Script de build Docker pour SmartLogi Frontend
# Usage: .\scripts\build.ps1 [version]

param(
    [string]$Version = "latest"
)

# Configuration
$ImageName = "smartlogi-frontend"
$Registry = "" # Ajouter votre registry Docker Hub ou autre (ex: "username/")

Write-Host "========================================" -ForegroundColor Blue
Write-Host "  Build Docker - SmartLogi Frontend" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Vérifier que Docker est installé
try {
    docker --version | Out-Null
    Write-Host "✓ Docker est installé" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas installé" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Build de l'image
Write-Host "📦 Build de l'image Docker..." -ForegroundColor Blue
$FullImageName = "${Registry}${ImageName}:${Version}"

docker build -t $FullImageName .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build réussi" -ForegroundColor Green
} else {
    Write-Host "❌ Échec du build" -ForegroundColor Red
    exit 1
}

# Tag latest si une version spécifique est fournie
if ($Version -ne "latest") {
    Write-Host "🏷️  Tag de l'image comme 'latest'..." -ForegroundColor Blue
    docker tag $FullImageName "${Registry}${ImageName}:latest"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Build terminé avec succès!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Image: $FullImageName"
Write-Host ""
Write-Host "Commandes utiles:"
Write-Host "  • Lancer le container:  " -NoNewline
Write-Host "docker run -p 8080:80 $FullImageName" -ForegroundColor Blue
Write-Host "  • Avec Docker Compose:  " -NoNewline
Write-Host "docker-compose up -d" -ForegroundColor Blue
Write-Host "  • Push vers registry:   " -NoNewline
Write-Host "docker push $FullImageName" -ForegroundColor Blue
Write-Host ""
