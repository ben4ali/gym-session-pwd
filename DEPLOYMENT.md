# Coolify Deployment Guide (Hostinger KVM2 VPS)

This guide covers deploying the **Gym Workout Tracker PWA** to your **Hostinger KVM2 VPS running Coolify**.

---

## 1. Included Production Files

The repository now contains all production deployment configurations:

- **`Dockerfile`**: High-performance multi-stage Docker build (`node:20-alpine` builder + `nginx:alpine` runtime). Resulting container is ultra-lightweight (~25MB) and consumes less than 15MB RAM on your KVM2 VPS.
- **`nginx.conf`**: Configured specifically for client-side routing (`try_files $uri $uri/ /index.html;`), gzip compression, long-term asset caching, and PWA cache bypass for `/sw.js` and `/manifest.json`.
- **`.dockerignore`**: Excludes `node_modules`, `dist`, and temporary files from the Docker build context.

---

## 2. Step-by-Step Deployment in Coolify

### Step A: Push Code to Git
If you haven't already initialized your Git repository, run:
```bash
git init
git add .
git commit -m "Initial commit: Gym Workout Tracker PWA"
git branch -M main
git remote add origin <your-github-or-gitlab-repo-url>
git push -u origin main
```

### Step B: Create Application in Coolify
1. Log into your **Coolify Dashboard** on your Hostinger VPS.
2. Select your **Project** and **Environment** (e.g. `Production`).
3. Click **+ New** and select **Application**.
4. Choose **Public Repository** or **Private Repository** (connect your GitHub/GitLab account if private).
5. Paste your repository URL and specify the branch (usually `main`).

### Step C: Configure Application Settings
Coolify will automatically detect the `Dockerfile`:
- **Build Pack**: `Dockerfile`
- **Port Exposes**: `80`
- **Domains**: Enter your domain or subdomain (e.g. `gym.yourdomain.com` or `https://gym.yourdomain.com`).
  - Coolify's built-in reverse proxy (Traefik / Caddy) will automatically provision and renew a free **Let's Encrypt SSL Certificate**.

### Step D: Deploy
1. Click **Deploy**.
2. Coolify will build the container, install production dependencies, compile the Vite bundle, and start Nginx.
3. Once finished, open your domain on your mobile browser (Safari on iOS or Chrome on Android).

---

## 3. Installing as a PWA on Your Mobile Phone

Because Coolify provides HTTPS out of the box, you can install the app natively on your phone:

- **iOS (Safari)**:
  1. Open your deployed URL in Safari.
  2. Tap the **Share** button (box with upward arrow).
  3. Scroll down and tap **Add to Home Screen**.
  4. The Gym app icon will appear on your iPhone home screen and run standalone with full-screen experience and zero browser address bars.

- **Android (Chrome)**:
  1. Open your deployed URL in Chrome.
  2. Tap the three dots menu in the top right.
  3. Tap **Install app** or **Add to Home screen**.
