#!/bin/bash

# CelebrateHub Setup Script
# This script will set up the entire project for new users

set -e  # Exit on any error

echo "🚀 Welcome to CelebrateHub Setup!"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_node() {
    print_info "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        echo "Please install Node.js from https://nodejs.org/"
        echo "Recommended version: Node.js 18+ or 20+"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
}

# Check if npm is installed
check_npm() {
    print_info "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed!"
        echo "Please install npm (usually comes with Node.js)"
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_status "npm found: $NPM_VERSION"
}

# Install root dependencies
install_root_deps() {
    print_info "Installing root dependencies..."
    if [ ! -f "package.json" ]; then
        print_error "package.json not found! Are you in the correct directory?"
        exit 1
    fi
    
    npm install
    print_status "Root dependencies installed"
}

# Install client dependencies
install_client_deps() {
    print_info "Installing client dependencies..."
    if [ ! -d "client" ]; then
        print_error "Client directory not found!"
        exit 1
    fi
    
    cd client
    npm install
    cd ..
    print_status "Client dependencies installed"
}

# Create environment files
setup_env() {
    print_info "Setting up environment files..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_info "Creating .env file..."
        cat > .env << 'EOF'
# Firebase Configuration (Server-side)
FIREBASE_PROJECT_ID=celebratehub-mvp
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email@celebratehub-mvp.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key

# Server Configuration
PORT=5001
NODE_ENV=development
EOF
        print_warning "Created .env file with placeholder values"
        print_info "You'll need to update this with your actual Firebase credentials"
    else
        print_status ".env file already exists"
    fi
    
    # Create client .env file if it doesn't exist
    if [ ! -f "client/.env" ]; then
        print_info "Creating client/.env file..."
        cat > client/.env << 'EOF'
# Firebase Configuration (Client-side)
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=celebratehub-mvp.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=celebratehub-mvp
REACT_APP_FIREBASE_STORAGE_BUCKET=celebratehub-mvp.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
EOF
        print_warning "Created client/.env file with placeholder values"
        print_info "You'll need to update this with your actual Firebase credentials"
    else
        print_status "Client .env file already exists"
    fi
}

# Check if ports are available
check_ports() {
    print_info "Checking if required ports are available..."
    
    # Check port 5001 (server)
    if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 5001 is already in use. The server might already be running."
    else
        print_status "Port 5001 is available"
    fi
    
    # Check port 3000 (client)
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 3000 is already in use. The client might already be running."
    else
        print_status "Port 3000 is available"
    fi
}

# Create start script
create_start_script() {
    print_info "Creating start script..."
    cat > start-app.sh << 'EOF'
#!/bin/bash

# CelebrateHub Start Script
echo "🚀 Starting CelebrateHub..."

# Kill any existing processes
pkill -f "node server/index.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Start server in background
echo "Starting server on port 5001..."
cd server && node index.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Start client
echo "Starting client on port 3000..."
cd ../client && npm start &
CLIENT_PID=$!

echo "✅ CelebrateHub is starting up!"
echo "📱 Client: http://localhost:3000"
echo "🔧 Server: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
EOF
    chmod +x start-app.sh
    print_status "Created start-app.sh script"
}

# Main setup function
main() {
    echo ""
    print_info "Starting CelebrateHub setup..."
    echo ""
    
    # Run all checks and installations
    check_node
    check_npm
    install_root_deps
    install_client_deps
    setup_env
    check_ports
    create_start_script
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo "================================="
    echo ""
    print_info "Next steps:"
    echo "1. Set up your Firebase project (see FIREBASE_SETUP.md)"
    echo "2. Update .env files with your Firebase credentials"
    echo "3. Run: ./start-app.sh"
    echo ""
    print_info "Or start manually:"
    echo "  Server: cd server && node index.js"
    echo "  Client: cd client && npm start"
    echo ""
    print_warning "Don't forget to:"
    echo "- Enable GitHub authentication in Firebase Console"
    echo "- Create a GitHub OAuth App"
    echo "- Update environment variables with real credentials"
    echo ""
}

# Run main function
main