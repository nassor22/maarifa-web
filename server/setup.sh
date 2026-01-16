#!/bin/bash

echo "========================================="
echo "MaarifaHub Database Setup"
echo "========================================="
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed!"
    echo ""
    echo "Please install MongoDB using one of these methods:"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt-get install -y mongodb"
    echo "  # OR for the latest version:"
    echo "  wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -"
    echo "  echo \"deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/6.0 multiverse\" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install -y mongodb-org"
    echo ""
    echo "macOS:"
    echo "  brew tap mongodb/brew"
    echo "  brew install mongodb-community"
    echo ""
    echo "After installation, run this script again."
    exit 1
fi

echo "✅ MongoDB is installed"
echo ""

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is already running"
else
    echo "⚠️  MongoDB is not running"
    echo "Starting MongoDB..."
    
    # Try to start MongoDB using systemctl
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
        sudo systemctl enable mongod
        echo "✅ MongoDB started with systemctl"
    elif command -v brew &> /dev/null; then
        brew services start mongodb-community
        echo "✅ MongoDB started with brew services"
    else
        # Manual start
        mkdir -p ~/mongodb/data
        mongod --dbpath ~/mongodb/data --fork --logpath ~/mongodb/mongod.log
        echo "✅ MongoDB started manually"
    fi
fi

echo ""
echo "========================================="
echo "Installing Server Dependencies"
echo "========================================="
echo ""

cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "To start the backend server:"
echo "  cd server"
echo "  npm run dev"
echo ""
echo "To start the frontend:"
echo "  npm run dev"
echo ""
echo "API will be available at: http://localhost:5000/api"
echo "Frontend will be available at: http://localhost:5173"
echo ""
