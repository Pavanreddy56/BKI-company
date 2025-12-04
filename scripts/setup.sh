#!/bin/bash
# Blue Kailash International - Setup Script
# This script sets up the development environment

set -e

echo "=================================="
echo "Blue Kailash International - Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for required tools
check_requirements() {
    echo -e "\n${YELLOW}Checking requirements...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Node.js is not installed. Please install Node.js 18 or higher.${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}npm is not installed. Please install npm.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}All requirements met!${NC}"
}

# Install dependencies
install_dependencies() {
    echo -e "\n${YELLOW}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}Dependencies installed successfully!${NC}"
}

# Setup environment variables
setup_env() {
    echo -e "\n${YELLOW}Setting up environment variables...${NC}"
    
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Blue Kailash International Environment Configuration

# Database
DATABASE_URL=postgresql://bluekailash:bluekailash_secret@localhost:5432/bluekailash

# Session
SESSION_SECRET=$(openssl rand -hex 32)

# Replit Auth (for local development)
REPL_ID=local-development
ISSUER_URL=https://replit.com/oidc

# Application
NODE_ENV=development
PORT=5000
EOF
        echo -e "${GREEN}.env file created successfully!${NC}"
    else
        echo -e "${YELLOW}.env file already exists. Skipping...${NC}"
    fi
}

# Initialize database
init_database() {
    echo -e "\n${YELLOW}Initializing database...${NC}"
    
    if [ -n "$DATABASE_URL" ]; then
        npm run db:push
        echo -e "${GREEN}Database initialized successfully!${NC}"
    else
        echo -e "${YELLOW}DATABASE_URL not set. Using in-memory storage.${NC}"
    fi
}

# Main setup flow
main() {
    check_requirements
    install_dependencies
    setup_env
    
    # Source .env file
    if [ -f ".env" ]; then
        export $(cat .env | xargs)
    fi
    
    init_database
    
    echo -e "\n${GREEN}=================================="
    echo "Setup completed successfully!"
    echo "=================================="
    echo -e "${NC}"
    echo "To start the development server, run:"
    echo "  npm run dev"
    echo ""
    echo "To start with Docker, run:"
    echo "  cd docker && docker-compose up -d"
}

main "$@"
