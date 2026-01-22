# My App - React Native + Expo + NativeWind

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose installed
- Expo Go app on your phone

### First Time Setup
```bash
# Clone the repo
git clone <your-repo-url>
cd my-app

# Start the app
docker-compose up --build
```

Scan the **QR code** with Expo Go app.

---

## 🔄 Team Workflow

### When Your Colleague Pushes Updates

```bash
# One command to sync everything
./sync.sh
```

Or manually:
```bash
git pull origin main
docker-compose down
docker-compose up --build
```

### When YOU Push Updates

```bash
git add .
git commit -m "your message"
git push origin main
```

Then tell your colleague to run `./sync.sh`

---

## 📋 Common Commands

| Action | Command |
|--------|---------|
| Start app | `docker-compose up` |
| Start (rebuild) | `docker-compose up --build` |
| Stop app | `docker-compose down` |
| View logs | `docker-compose logs -f expo` |
| Sync updates | `./sync.sh` |
| Enter container | `docker exec -it my-app-expo sh` |
| Install new package | `docker exec -it my-app-expo npm install <package>` |

---

## 📦 Adding New Packages

```bash
# From your machine (while container is running)
docker exec -it my-app-expo npm install <package-name>

# Then commit the updated package.json
git add package.json package-lock.json
git commit -m "Add <package-name>"
git push
```

---

## 🗂️ Project Structure

```
src/
├── components/   # Reusable UI components
├── screens/      # App screens
├── hooks/        # Custom React hooks
├── services/     # API calls (axios)
├── store/        # Zustand state management
├── utils/        # Helper functions
├── types/        # TypeScript interfaces
└── constants/    # App constants
```

---

## 🛠️ Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: React Navigation
- **State**: Zustand (client) + React Query (server)
- **HTTP**: Axios
- **Storage**: Expo Secure Store

---

## ⚠️ Troubleshooting

### QR Code not working?
Make sure you're using `--tunnel` mode (default in docker-compose)

### Port already in use?
```bash
docker-compose down
docker-compose up
```

### Package version mismatch?
```bash
docker-compose down
docker-compose up --build  # Rebuilds with fresh node_modules
```

### Need to clear cache?
```bash
docker exec -it my-app-expo npx expo start --clear
```
