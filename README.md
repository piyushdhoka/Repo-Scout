# Repo Scout

Repo Scout helps you discover, filter, and contribute to open-source projects by surfacing GitHub issues that match your skills and interests. This repository contains the web frontend and an optional backend proxy to simplify calls to the GitHub API.

## Features
- Search and filter GitHub issues by language, label, repository, and more
- Modern dark-themed UI with responsive design
- Clear contribution guidance for first-time contributors
- Optional backend server that can proxy GitHub API requests
- Collapsible sidebar and keyboard-friendly navigation

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm (or yarn / bun)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/piyushdhoka/Repo-Scout.git
   cd Repo-Scout
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun run dev
   ```
4. To run frontend and backend together (if provided):
   ```bash
   npm run dev:all
   ```
5. To run only the backend server (if present):
   ```bash
   npm run server
   ```

## Environment & Authentication (optional)

This project supports sign-in flows (Google/GitHub) via Firebase in development. To enable authentication:

1. Create a Firebase project and register a Web app: https://console.firebase.google.com
2. In Firebase Console → Authentication → Sign-in method, enable Google and/or GitHub.
3. If using GitHub sign-in, create a GitHub OAuth app and set the callback URL to your Firebase auth handler (example: `https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler`).
4. Add Firebase config values to a root `.env` (copy `.env.example` if present):

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

5. (Optional) If you want the backend to proxy authenticated GitHub requests, create `server/.env` from `server/.env.example` and set `GITHUB_TOKEN`.

Notes:
- After adding or changing `.env` files restart the dev servers so environment variables are picked up.
- In development the app typically uses `signInWithPopup`, which should work on `localhost` if allowed by your auth provider settings.

## Contributing

Thanks for wanting to contribute! The preferred workflow:

1. Fork the repository and create a branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make changes, run the app and tests, then commit:
   ```bash
   git add .
   git commit -m "feat: describe your change"
   ```
3. Push to your fork and open a Pull Request.

Guidelines:
- Follow existing code style
- Write clear commit messages
- Add tests and documentation when appropriate

## License

This project is licensed under the MIT License.
