#!/bin/bash

# AIOutlet Admin UI Setup Script

echo "🚀 Setting up AIOutlet Admin UI..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file. Please review and update the configuration."
else
    echo "ℹ️  .env file already exists."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check your internet connection and try again."
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Review and update the .env file with your backend URLs"
echo "2. Make sure your backend services are running:"
echo "   - Admin Service on port 3010"
echo "   - Auth Service on port 3001"
echo "3. Start the development server: npm start"
echo ""
echo "🌐 The admin UI will be available at http://localhost:3000"
echo ""
echo "🔑 Demo credentials:"
echo "   Email: admin@example.com"
echo "   Password: password123"