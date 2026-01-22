# Expo React Native Development Container
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Expo CLI globally
RUN npm install -g expo-cli @expo/ngrok

# Expose Expo ports
# 8081 - Metro bundler
# 19000 - Expo DevTools
# 19001 - Expo DevTools
# 19002 - Expo DevTools UI
EXPOSE 8081 19000 19001 19002

# Set environment variables for Expo
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Default command
CMD ["npx", "expo", "start", "--tunnel"]
