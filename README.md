# Shiny Love - Interactive Romantic Experience ❤️

A production-quality, mobile-first interactive mini-game and cinematic love letter website created for **Shiny**. Designed to be hosted on GitHub Pages and accessed via a QR code printed on a chocolate wrapper.

![Preview](assets/preview-placeholder.png) <!-- Conceptual preview link -->

## ✨ Features & Highlights

- **Cinematic Scene Manager**: 5 distinct interactive scenes with fluid GPU-accelerated CSS/JS transitions (`opacity`, `transform`, `blur`).
- **Zero-Dependency Vector & Particle Engine**: Pure HTML5 Canvas background rendering a twinkling starfield, ambient floating hearts/particles, and responsive touch explosion bursts.
- **3D Animated CSS/SVG Gift Box**: Interactive gift box that lifts its lid, releases pink light beams, and bursts hearts on tap.
- **Intimate Sequential Message Reveal**: Glassmorphism cards with typewriter line reveals.
- **Interactive Memory Cards**: 4 floating cards with unique rotation, touch tilt, particles, and progress tracking logic.
- **Climax Finale**: Dramatic heart expansion, aurora intensification, and final message reveal.
- **Web Audio API Synth**: Pure JavaScript sound synthesis generating warm chimes and arpeggios on interactions without needing external audio files. Includes mute/unmute control.
- **Secret Easter Egg**: Hidden long-press (2s) or multi-tap interaction revealing a sweet chocolate note.
- **Mobile First & Responsive**: Optimized for 360px–430px smartphone viewports, full touch target accessibility, and `prefers-reduced-motion` compliance.

---

## 📁 Directory Structure

```text
shiny-love/
├── index.html       # HTML5 Semantic structure & scene definitions
├── style.css        # Design system, glassmorphism tokens & animations
├── script.js        # Canvas particle engine, Audio API & scene logic
├── README.md        # Documentation & deployment guide
└── .gitignore       # Git ignore config
```

---

## 🚀 Local Development & Preview

No build tools or backend dependencies are required. To preview locally:

### Option 1: Python HTTP Server (Recommended)
Run the following command in the `shiny-love` directory:
```bash
python -m http.server 8080
```
Then open your browser at: [http://localhost:8080](http://localhost:8080)

### Option 2: VS Code Live Server
Right-click `index.html` in VS Code / Antigravity IDE and select **Open with Live Server**.

---

## 🌐 Publishing to GitHub Pages

1. **Create a GitHub Repository**:
   Create a new public repository on GitHub named `shiny-love`.

2. **Push Local Code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/shiny-love.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository **Settings** -> **Pages**.
   - Under **Build and deployment**, select `Deploy from a branch`.
   - Set Branch to `main` and Folder to `/ (root)`.
   - Click **Save**.

4. **Access Live URL**:
   Your website will be live in a few moments at:
   `https://YOUR_USERNAME.github.io/shiny-love/`

---

## 🍫 Creating the QR Code for Chocolate Cover

1. Copy your live website URL (`https://YOUR_USERNAME.github.io/shiny-love/`).
2. Go to any free QR code generator (e.g. [qr-code-generator.com](https://www.qr-code-generator.com/) or `qrcode` CLI).
3. Generate a high-resolution PNG/SVG QR code.
4. Print and attach the QR code to the chocolate wrapper!

---

## 📱 Mobile Viewport Testing

Tested against common mobile screen resolutions:
- **360 × 800** (Android standard)
- **390 × 844** (iPhone 12 / 13 / 14)
- **430 × 932** (iPhone 14 Pro Max / 15 Plus)
- **1366 × 768 / 1920 × 1080** (Desktop fallback)

Ensure to test portrait orientation on touch-enabled devices for the best experience.
