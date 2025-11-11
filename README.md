# Repo Scout


A web app to discover and contribute to open source projects by finding GitHub issues that match your skills and interests. Features powerful search and filtering tools to help you get started with open source contributions.

## Features
- Search and filter GitHub issues by language, label, and more
- Modern dark-themed UI with responsive design
- Easy navigation and contribution guidance
- Backend server with GitHub API proxy
- Collapsible sidebar navigation

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/) (optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vivekd16/repo-scout.git
   cd repo-scout
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```
3. **Start the development server (frontend only):**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Start both frontend and backend together:**
   ```bash
   npm run dev:all
   ```

5. **Start the backend server separately:**
   ```bash
   npm run server
   ```

## Authentication setup (Google / GitHub)

To enable Google and GitHub sign-in for the app you'll need a Firebase project and to configure OAuth providers:

1. Create a Firebase project at https://console.firebase.google.com and register a Web app.
2. In the Firebase console go to Authentication -> Sign-in method, and enable:
   - Google
   - GitHub (you'll need to create a GitHub OAuth app and provide its Client ID and Client Secret to Firebase)
3. When creating the GitHub OAuth app, set the Authorization callback URL to the Firebase handler for your project, e.g.:
   - https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler
4. Copy the Firebase SDK config values and add them to the root `.env` (copy `.env.example`):

```bash
# root .env (Vite)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

5. (Optional) If you want the backend to proxy GitHub requests using a token, create `server/.env` from `server/.env.example` and set `GITHUB_TOKEN`.

Notes:
- After adding `.env` files restart the dev servers so Vite picks up the new env vars.
- In development the app uses signInWithPopup which should work on `localhost` — make sure your Firebase/auth settings allow the host if necessary.


## Contributing

We welcome contributions! To get started:

1. **Fork the repository** and create your branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m "feat: describe your change"
   ```
3. **Push to your fork** and open a Pull Request:
   ```bash
   git push origin feat/your-feature-name
   ```
4. **Describe your changes** in the PR and request a review.

### Guidelines
- Follow the existing code style and naming conventions.
- Write clear, concise commit messages.
- Add tests or documentation as needed.

## License

This project is licensed under the MIT License.


