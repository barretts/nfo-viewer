# nfo-viewer

A cross-platform NFO file viewer inspired by [iNFekt](https://github.com/syndicodefront/infekt). Works in the browser and as a native desktop app.

## Features

- **CP437 encoding support** — correctly renders classic NFO ASCII art
- **Block character rendering** — highlights box-drawing and block characters
- **Multiple themes** — Classic Blue, Green, Amber, Dark, Light, White on Black
- **Zoom controls** — Ctrl+/- or toolbar buttons
- **Export to PNG** — save rendered NFO as an image
- **Drag & drop** — drop .nfo files directly into the viewer
- **Native desktop app** — via Tauri with .nfo file association
- **GitHub Pages** — also deployable as a web app

## Quick Start (Web)

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Build for Web (GitHub Pages)

```bash
npm run build
```

Output is in `dist/`. Push to GitHub and enable Pages from the `deploy-pages` workflow.

## Build Native Desktop App

Requires [Rust](https://rustup.rs/) and Tauri v2 prerequisites.

```bash
npm install
npx tauri build
```

The built installer will be in `src-tauri/target/release/bundle/`.

### File Association

The desktop build registers `.nfo` and `.diz` file associations automatically. After installing, you can double-click NFO files to open them in nfo-viewer.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+O | Open file |
| Ctrl+= | Zoom in |
| Ctrl+- | Zoom out |
| Ctrl+0 | Reset zoom |

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Lucide icons
- **Build**: Vite
- **Desktop**: Tauri v2 (Rust)
- **CI/CD**: GitHub Actions (Pages deploy + Tauri builds)

## License

MIT
