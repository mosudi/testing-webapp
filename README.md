# 🚀 Apex Portfolio & Engineering Showcase

A high-performance, responsive Developer Portfolio and Cloud Engineering Showcase built with modern HTML5, Vanilla CSS3, and ES6+ JavaScript. Designed specifically for testing and hosting across modern deployment targets (Google Chrome PWA, GitHub Pages, Vercel, Netlify, Firebase Hosting, and local Five Server).

---

## ✨ Features

- **Modern Glassmorphic UI**: Ambient gradient canvas with animated floating orbs, frosted glass cards (`backdrop-filter: blur(16px)`), and curated neon accents.
- **Dark / Light Mode**: System-aware theme toggle with persistent preferences saved in `localStorage`.
- **Fluid Micro-Animations**: Smooth entry/exit transitions powered by `@starting-style` and `@media (prefers-reduced-motion)`.
- **Interactive Project Showcase**: Filter projects by categories (*Cloud & DevOps*, *AI & Full-Stack*, *Fintech & Web3*) with rich preview modals powered by native HTML5 `<dialog>`.
- **Chrome Deployment & Health Hub**: Embedded live inspector displaying real-time metrics:
  - Service Worker Cache state (`sw.js`)
  - Chrome PWA Installability (`manifest.json`)
  - Live network connectivity (`navigator.onLine`) & offline simulator
  - Viewport dimensions and Device Pixel Ratio (DPR)
- **Zero-Dependency Architecture**: No bloated build steps or package installation requirements. Runs out-of-the-box in any standard browser.

---

## 🛠️ Project Structure

```text
├── index.html                  # Semantic, accessible HTML5 layout
├── css/
│   └── style.css               # Complete Vanilla CSS design system & tokens
├── js/
│   └── app.js                  # Theme controller, project filters, modal & diagnostics
├── manifest.json               # Web App Manifest for Chrome PWA installation
├── sw.js                       # Offline caching Service Worker
├── favicon.svg                 # SVG App icon & Favicon
├── assets/
│   └── images/                 # Generated high-resolution project illustrations
│       ├── project-cloud.jpg
│       ├── project-ai.jpg
│       └── project-fintech.jpg
├── .gitignore
└── README.md
```

---

## 💻 Running Locally

### Option 1: Python HTTP Server (Built-in)
```bash
python -m http.server 8080
```
Open **[http://localhost:8080](http://localhost:8080)** in Google Chrome.

### Option 2: VS Code Five Server
Right-click `index.html` in VS Code and select **Open with Five Server**.

---

## 🚀 Deployment

- **GitHub Pages**:
  1. Push this repository to GitHub.
  2. Go to **Settings** > **Pages**.
  3. Under **Branch**, select `main` and root (`/`), then click **Save**.
- **Vercel / Netlify / Cloudflare Pages**:
  - Connect your GitHub repository.
  - Set build command to empty and publish directory to root (`./`).
