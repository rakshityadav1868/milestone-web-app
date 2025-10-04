#!/bin/bash

# CelebrateHub Quick Setup Script
# This script installs all dependencies and sets up the project

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}[$1]${NC} $2"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Header
echo -e "${PURPLE}🚀 CelebrateHub Quick Setup${NC}"
echo -e "${PURPLE}============================${NC}"

# Check if Node.js is installed
print_status "1" "Checking system requirements..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm 8 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$NODE_MAJOR" -lt 16 ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please upgrade to Node.js 16 or higher."
    exit 1
fi

print_success "Node.js version: $(node --version)"
print_success "npm version: $(npm --version)"

# Install dependencies
print_status "2" "Installing dependencies..."

print_info "Installing root dependencies..."
npm install
print_success "Root dependencies installed"

print_info "Installing client dependencies..."
cd client && npm install && cd ..
print_success "Client dependencies installed"

print_info "Installing server dependencies..."
cd server && npm install && cd ..
print_success "Server dependencies installed"

print_info "Installing functions dependencies..."
cd functions && npm install && cd ..
print_success "Functions dependencies installed"

# Success message
echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}🎉 CelebrateHub Setup Complete!${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "${YELLOW}🎉 Setup complete! You can now run the app with:${NC}"
echo ""
echo -e "${CYAN}1. npm run dev-demo    # Start in demo mode (recommended for first run)${NC}"
echo -e "${CYAN}2. npm run dev         # Start with full features (requires API keys)${NC}"
echo ""
echo -e "${YELLOW}📚 Additional Information:${NC}"
echo -e "${BLUE}   • Frontend will run on: http://localhost:3000${NC}"
echo -e "${BLUE}   • Backend will run on: http://localhost:5001${NC}"
echo -e "${BLUE}   • Demo mode doesn't require API keys${NC}"
echo -e "${BLUE}   • Full mode requires Firebase and OpenAI configuration${NC}"
echo ""
echo -e "${YELLOW}📖 For more information, check the README.md file${NC}"
echo -e "${GREEN}============================================================${NC}"
