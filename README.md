<div align="center">

# 🧠 Dev Cheatsheets

### A fast, searchable, professional reference for everyday developer commands

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-00ff9d?style=for-the-badge&labelColor=0a0e17)](https://abdosorour7.github.io/dev-commands-cheatsheet) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-00cfff?style=for-the-badge&labelColor=0a0e17)](https://github.com/abdosorour7/dev-commands-cheatsheet/issues)

<br/>

**Sections:** Git · Docker — and growing

**Data-driven · Fast search · Copy-ready · Multilingual**

<br/>

![Preview of the cheatsheet UI](https://raw.githubusercontent.com/abdosorour7/dev-commands-cheatsheet/main/preview.png)

</div>

---

## 🚀 Why This Repo

- Built for speed: open, search, copy, and move on
- Covers real daily workflows for the tools developers use most
- Easy to extend with **new sections** (Git, Docker, …) without touching the rendering code
- Designed to be contributor-friendly
- Clean UI that is readable for long sessions

---

## ✨ Features

- 🗂️ **Multiple sections** — switch between **Git** and **Docker** cheatsheets with a single click; new sections drop in via a JSON manifest
- ✨ **Multilingual** — switch between English 🇬🇧, Italian 🇮🇹, French 🇫🇷, and Spanish 🇪🇸; your choice is remembered across visits
- 🔍 **Instant search** — filter any command or description in real time, scoped to the active section
- 📋 **One-click copy** — click any command to copy it to your clipboard
- ⚠️ **Danger warnings** — destructive commands are clearly marked
- ⌨️ **Keyboard shortcut** — press `/` to focus search instantly
- 📱 **Fully responsive** — works great on mobile and desktop
- 🌙 **Dark terminal theme** — easy on the eyes, built for developers
- 📡 **PWA / offline** — installable, with service worker caching
- 🧩 **Modular architecture** — separate data, rendering, state, and interactions

---

## 🏗️ Architecture

This project uses a clean static architecture with no framework and no build requirement.

- **`index.html`**: page shell, section pills, semantic structure
- **`assets/css/styles.css`**: visual design, layout, responsive styles
- **`assets/data/sections.json`**: manifest for each section (`key`, `title`, `logo`, `#RRGGBB` `color`, docs URL, `docsLabelKey`)
- **`assets/brands/`**: SVG marks for the section switcher (see `README.md` in that folder for attribution)
- **`assets/data/{section}.{lang}.json`**: per-section command data (e.g. `git.en.json`, `docker.en.json`)
- **`assets/data/ui.json`**: all UI strings keyed by locale (`en`, `it`, `fr`, `es`)
- **`assets/js/app.js`**: app bootstrap and orchestration (sections + language)
- **`assets/js/modules/`**:
  - `paths.js` — resolves `assets/data/…`, `assets/brands/…`, and other static URLs from the current page (GitHub Pages–friendly)
  - `data-loader.js` — loads `sections.json` and section data on demand (per language, with English fallback per command)
  - `render.js` — renders section pills, category tabs, and command cards
  - `state.js` — section, category, and search filtering state
  - `interactions.js` — copy, keyboard, scroll behavior
  - `i18n.js` — language switching, UI strings, and `localStorage` persistence (lang + section)

Scripts are loaded as **classic** `<script defer>` files (not ES modules) so the app runs even when a simple local server serves `.js` as `text/plain` (common with `python -m http.server` on Windows). Strict MIME checks for `type="module"` do not apply.

This keeps the app easy to maintain, easy to extend, and contributor-friendly.

### ➕ Adding a new section (e.g. Linux, Kubernetes)

1. Add an entry in `assets/data/sections.json` (each section needs a stable `key`, human `title`, `logo` path under `assets/brands/` or `assets/`, theme `color` as `#RRGGBB`, docs link, and `docsLabelKey` matching a key in `ui.json`):

```json
{
  "key": "kubernetes",
  "title": "Kubernetes",
  "logo": "assets/brands/kubernetes.svg",
  "color": "#326CE5",
  "docsUrl": "https://kubernetes.io/docs/reference/kubectl/",
  "docsLabelKey": "footerDocs"
}
```

2. Add the logo SVG under `assets/brands/` (square viewBox, ~24px artwork scales cleanly in the section pills).
3. Create `assets/data/kubernetes.en.json` using the same shape as `git.en.json` / `docker.en.json` (top-level `categories`, each with `commands`).
4. Optional: add localized variants like `kubernetes.fr.json`. Missing translations fall back to English at runtime with an `EN` badge.
5. Add new static files to `sw.js`'s `ASSETS` array and bump `CACHE_NAME` so they work offline after deploy.

No JavaScript changes are required for a new section beyond listing new files in the service worker.

### ➕ Adding a new command

1. Add the command to the appropriate `assets/data/{section}.en.json` (required, source of truth).
2. Optionally add translated entries in the other `{section}.{lang}.json` files in the same PR.
3. The UI shows an **EN** badge when a command is shown in English for the active language: missing locale file (all commands), missing row in a locale file, or when `descriptionHtml` still matches the English text after merge (so leaving English copy in a translated file is detected automatically).

### 🌍 Adding a new language

1. Add the locale's UI strings to `assets/data/ui.json`.
2. Add a button to the `#lang-switcher` in `index.html` and to the `SUPPORTED_LANGS` array in `assets/js/modules/i18n.js`.
3. Translate the per-section files you want to support (`git.{lang}.json`, `docker.{lang}.json`, …). Files can be partial — any missing commands fall back to English at runtime.

**EN badge (automatic):** `assets/js/modules/data-loader.js` merges each section with English, then marks cards with `_fallback: "en"` when there is no `{section}.{lang}.json`, when a command row is absent in that file, or when `descriptionHtml` equals the English entry (normalized whitespace). The card renderer reads `_fallback` and shows the localized “not translated” hint from `ui.json`.

---

## 📚 Sections

| Section | Categories | Commands |
|---------|-----------:|---------:|
| 🔱 Git | 13 | 127 |
| 🐳 Docker | 11 | 142 |

### Git categories
⚙️ Setup & Config · 📁 Starting a Repo · 🔄 Basic Workflow · 🌿 Branching · ☁️ Remote (GitHub) · ↩️ Undo & Fix · 📦 Stash · 🏷️ Tags · 🔏 Signing & Verification · 🔍 History & Diff · 🧹 Cleanup & Maintenance · 🌲 Worktrees · 🚀 Advanced Branching

### Docker categories
⚙️ Setup & Info · 🐳 Images · 🚀 Run Containers · 🔁 Container Lifecycle · 🔍 Inspect & Logs · 💾 Volumes · 🌐 Networks · 🐙 Docker Compose · 📝 Dockerfile Instructions · 🏷️ Registry & Sharing · 🧹 Cleanup & Maintenance

---

## 🚀 Quick Start

### Option 1 — Use the live website
Just visit: **[abdosorour7.github.io/dev-commands-cheatsheet](https://abdosorour7.github.io/dev-commands-cheatsheet)**

### Option 2 — Run locally
```bash
git clone https://github.com/abdosorour7/dev-commands-cheatsheet.git
cd dev-commands-cheatsheet
```

Open `index.html` first (double-click it, or open it in your browser).

If the page works, you are done.

If commands do not load (browser blocks `file://` JSON loading), run a local server:

```bash
python -m http.server 8080
```

Then open: **http://localhost:8080**

If Python is not installed, use one of these alternatives:

```bash
# Option A (Node.js)
npx serve .

# Option B (VS Code extension)
Use "Live Server" and open the project root
```

No build tools required for local development.

---

## 🧱 Project Structure

```text
dev-commands-cheatsheet/
├─ index.html
├─ manifest.json
├─ sw.js
├─ assets/
│  ├─ brands/
│  │  ├─ README.md
│  │  ├─ git.svg
│  │  └─ docker.svg
│  ├─ css/
│  │  └─ styles.css
│  ├─ data/
│  │  ├─ sections.json       ← list of sections (Git, Docker, …)
│  │  ├─ git.en.json         ← Git — English (canonical source)
│  │  ├─ git.it.json         ← Git — Italian
│  │  ├─ git.fr.json         ← Git — French
│  │  ├─ git.es.json         ← Git — Spanish
│  │  ├─ docker.en.json      ← Docker — English (canonical source)
│  │  └─ ui.json             ← UI strings for all locales
│  └─ js/
│     ├─ README.md
│     ├─ app.js
│     └─ modules/
│        ├─ paths.js
│        ├─ data-loader.js
│        ├─ i18n.js
│        ├─ interactions.js
│        ├─ render.js
│        └─ state.js
└─ README.md
```

---

## 🌟 Support This Project

- ⭐ Star the repository if it helped you
- 🍴 Fork it and customize your own version
- 📣 Share it with teammates or in dev communities
- 🐛 Open issues for mistakes or missing commands

---

## 🤝 Contributing

Contributions are warmly welcome and highly appreciated.

- ➕ Add useful missing commands to existing sections
- 🆕 Propose entirely new sections (Linux, Kubernetes, npm, AWS CLI, …)
- 📝 Improve command descriptions and examples
- 🌍 Add or improve translations
- 🎨 Suggest UI/UX improvements

Open an issue or PR directly and include clear details/screenshots when relevant.

---

## 📄 License

MIT © [abdosorour7](https://github.com/abdosorour7) — free to use, share, and modify.

---

<div align="center">

If this helped you, please consider giving it a ⭐ — it helps others discover it!

***I'm not primarily a web developer — I just build practical tools that solve real problems.***

Built with thoughtful AI assistance.

---

**Made with ❤️ for the developer community**

</div>
