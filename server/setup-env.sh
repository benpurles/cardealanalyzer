#!/bin/bash

# Setup environment file with Zyte API key
echo "Setting up environment file..."

# Create .env file with the provided API key
cat > .env << EOF
# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Zyte API Key (required for web scraping)
ZYTE_API_KEY=a8d8f19e5b804891b4afe7e931d6d1a8

# Market Data API Keys (optional - will use fallback data if not provided)
KBB_API_KEY=
NADA_API_KEY=
EDMUNDS_API_KEY=
CARGURUS_API_KEY=
EOF

echo "✅ Environment file created with your Zyte API key!"
echo "🔑 ZYTE_API_KEY=a8d8f19e5b804891b4afe7e931d6d1a8"
echo ""
echo "Next steps:"
echo "1. Run: node test-server.js"
echo "2. Test with: node ../test-scraper.js" 