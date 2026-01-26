#!/bin/bash

# Script de build Docker pour SmartLogi Frontend
# Usage: ./scripts/build.sh [version]

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="smartlogi-frontend"
REGISTRY="" # Ajouter votre registry Docker Hub ou autre (ex: "username/")
VERSION=${1:-"latest"}

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Build Docker - SmartLogi Frontend${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker est installé${NC}"
echo ""

# Build de l'image
echo -e "${BLUE}📦 Build de l'image Docker...${NC}"
docker build -t ${REGISTRY}${IMAGE_NAME}:${VERSION} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build réussi${NC}"
else
    echo -e "${RED}❌ Échec du build${NC}"
    exit 1
fi

# Tag latest si une version spécifique est fournie
if [ "$VERSION" != "latest" ]; then
    echo -e "${BLUE}🏷️  Tag de l'image comme 'latest'...${NC}"
    docker tag ${REGISTRY}${IMAGE_NAME}:${VERSION} ${REGISTRY}${IMAGE_NAME}:latest
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Build terminé avec succès!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Image: ${REGISTRY}${IMAGE_NAME}:${VERSION}"
echo ""
echo -e "Commandes utiles:"
echo -e "  • Lancer le container:  ${BLUE}docker run -p 8080:80 ${REGISTRY}${IMAGE_NAME}:${VERSION}${NC}"
echo -e "  • Avec Docker Compose:  ${BLUE}docker-compose up -d${NC}"
echo -e "  • Push vers registry:   ${BLUE}docker push ${REGISTRY}${IMAGE_NAME}:${VERSION}${NC}"
echo ""
