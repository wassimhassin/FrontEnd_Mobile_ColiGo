#!/bin/bash

# ===========================================
# SYNC & RUN - Pull updates and restart app
# ===========================================

echo "🔄 Pulling latest changes..."
git pull origin main

echo "🐳 Rebuilding and restarting container..."
docker-compose down
docker-compose up --build -d

echo "📱 Waiting for Expo to start..."
sleep 5

echo "✅ Done! Scan the QR code below:"
docker-compose logs -f expo
