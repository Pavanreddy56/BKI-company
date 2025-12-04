#!/bin/bash
# Blue Kailash International - Docker Push Script
# This script builds and pushes Docker images to DockerHub

set -e

echo "=================================="
echo "Blue Kailash - Docker Push"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"docker.io"}
DOCKER_USERNAME=${DOCKER_USERNAME:-"bluekailash"}
IMAGE_PREFIX=${IMAGE_PREFIX:-"bluekailash"}
VERSION=${VERSION:-$(date +%Y%m%d-%H%M%S)}

# Check Docker login
check_docker_login() {
    echo -e "${YELLOW}Checking Docker login...${NC}"
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}Docker is not running or not accessible.${NC}"
        exit 1
    fi
    
    if [ -z "$DOCKER_PASSWORD" ]; then
        echo -e "${YELLOW}Please login to Docker:${NC}"
        docker login $DOCKER_REGISTRY
    else
        echo "$DOCKER_PASSWORD" | docker login $DOCKER_REGISTRY -u $DOCKER_USERNAME --password-stdin
    fi
    echo -e "${GREEN}Docker login successful!${NC}"
}

# Build images
build_images() {
    echo -e "\n${YELLOW}Building Docker images...${NC}"
    
    # Build backend
    echo "Building backend image..."
    docker build -f docker/Dockerfile.backend -t $IMAGE_PREFIX/backend:$VERSION -t $IMAGE_PREFIX/backend:latest .
    
    # Build frontend
    echo "Building frontend image..."
    docker build -f docker/Dockerfile.frontend -t $IMAGE_PREFIX/frontend:$VERSION -t $IMAGE_PREFIX/frontend:latest .
    
    echo -e "${GREEN}Images built successfully!${NC}"
}

# Push images
push_images() {
    echo -e "\n${YELLOW}Pushing images to registry...${NC}"
    
    # Push backend
    echo "Pushing backend image..."
    docker push $IMAGE_PREFIX/backend:$VERSION
    docker push $IMAGE_PREFIX/backend:latest
    
    # Push frontend
    echo "Pushing frontend image..."
    docker push $IMAGE_PREFIX/frontend:$VERSION
    docker push $IMAGE_PREFIX/frontend:latest
    
    echo -e "${GREEN}Images pushed successfully!${NC}"
}

# Display image info
display_info() {
    echo -e "\n${GREEN}=================================="
    echo "Docker Push Completed!"
    echo "=================================="
    echo -e "${NC}"
    echo "Images pushed:"
    echo "  - $IMAGE_PREFIX/backend:$VERSION"
    echo "  - $IMAGE_PREFIX/backend:latest"
    echo "  - $IMAGE_PREFIX/frontend:$VERSION"
    echo "  - $IMAGE_PREFIX/frontend:latest"
    echo ""
    echo "To pull and run these images:"
    echo "  docker pull $IMAGE_PREFIX/backend:latest"
    echo "  docker pull $IMAGE_PREFIX/frontend:latest"
}

# Main flow
main() {
    check_docker_login
    build_images
    push_images
    display_info
}

main "$@"
