<div align="center">

# 🧠 Git Commands Cheatsheet

### A fast, searchable, professional reference for Git commands

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-00ff9d?style=for-the-badge&labelColor=0a0e17)](https://abdosorour7.github.io/git-commands-cheatsheet) <!-- [![Stars](https://img.shields.io/github/stars/abdosorour7/git-commands-cheatsheet?style=for-the-badge&color=ffd166&labelColor=0a0e17)](https://github.com/abdosorour7/git-commands-cheatsheet/stargazers) --> [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-00cfff?style=for-the-badge&labelColor=0a0e17)](https://github.com/abdosorour7/git-commands-cheatsheet/issues)

<br/>

**115 commands · 12 categories · Data-driven · Fast search · Copy-ready**

<br/>

![Preview of the cheatsheet UI](https://raw.githubusercontent.com/abdosorour7/git-commands-cheatsheet/main/preview.png)

</div>

---

## 🚀 Why This Repo

- Built for speed: open, search, copy, and move on
- Covers real daily Git workflows, not just basic commands
- Designed to be contributor-friendly and easy to expand
- Clean UI that is readable for long sessions

---

## ✨ Features

- ✨ **Multilingual** — Switch between English 🇬🇧, Italian 🇮🇹, French 🇫🇷, and Spanish 🇪🇸 with the language switcher; your choice is remembered across visits
- 🔍 **Instant search** — filter any command or description in real time
- 📋 **One-click copy** — click any command to copy it to your clipboard
- 🗂️ **12 categories** — organized from Setup to Advanced Branching
- ⚠️ **Danger warnings** — destructive commands are clearly marked
- ⌨️ **Keyboard shortcut** — press `/` to focus search instantly
- 📱 **Fully responsive** — works great on mobile and desktop
- 🌙 **Dark terminal theme** — easy on the eyes, built for developers
- 🧩 **Modular architecture** — separate data, rendering, state, and interactions

---

## 🏗️ Architecture

This project uses a clean static architecture with no framework and no build requirement.

- **`index.html`**: page shell and semantic structure
- **`assets/css/styles.css`**: visual design, layout, responsive styles
- **`assets/data/commands.en.json`**: English command data (canonical source of truth)
- **`assets/data/commands.it.json`**: Italian translations
- **`assets/data/commands.fr.json`**: French translations
- **`assets/data/commands.es.json`**: Spanish translations
- **`assets/data/ui.json`**: all UI strings keyed by locale (`en`, `it`, `fr`, `es`)
- **`assets/js/app.js`**: app bootstrap and orchestration
- **`assets/js/modules/`**:
  - `data-loader.js` for data fetching (accepts a `lang` param, loads `commands.{lang}.json`)
  - `render.js` for UI rendering
  - `state.js` for filtering/state logic
  - `interactions.js` for copy, keyboard, and scroll behavior
  - `i18n.js` for language switching, UI string application, and `localStorage` persistence

This keeps the app easy to maintain, easy to extend, and contributor-friendly.

> **Adding a new language:** create `assets/data/commands.{lang}.json` (translate `title`, `searchDescription`, and `descriptionHtml` fields — leave `command`, `key`, `icon`, `color`, `codeHtml` as-is), add the locale's UI strings to `assets/data/ui.json`, and add a button to the `#lang-switcher` in `index.html`. Translation files can be partial: any missing commands automatically fall back to English at runtime.

### ➕ Adding a new command

1. Add the command to `assets/data/commands.en.json` (required, source of truth).
2. Optionally add translated entries in `assets/data/commands.fr.json` and `assets/data/commands.it.json` and `assets/data/commands.es.json` in the same PR.
3. If translations are not added yet, the command still appears in FR/IT with an `EN` badge until translated.

---

## 📚 Categories

| # | Category | Commands |
|---|----------|----------|
| 1 | ⚙️ Setup & Config | 7 |
| 2 | 📁 Starting a Repo | 4 |
| 3 | 🔄 Basic Workflow | 11 |
| 4 | 🌿 Branching | 17 |
| 5 | ☁️ Remote (GitHub) | 13 |
| 6 | ↩️ Undo & Fix | 11 |
| 7 | 📦 Stash | 7 |
| 8 | 🏷️ Tags | 6 |
| 9 | 🔍 History & Diff | 18 |
| 10 | 🧹 Cleanup & Maintenance | 8 |
| 11 | 🌲 Worktrees | 8 |
| 12 | 🚀 Advanced Branching | 5 |

---

## 🚀 Quick Start

### Option 1 — Use the live website
Just visit: **[abdosorour7.github.io/git-commands-cheatsheet](https://abdosorour7.github.io/git-commands-cheatsheet)**

### Option 2 — Run locally
```bash
git clone https://github.com/abdosorour7/git-commands-cheatsheet.git
cd git-commands-cheatsheet
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

You can still open `index.html` directly, but some browsers may block local JSON loading over `file://`.

No build tools required for local development.

---

## 🧱 Project Structure

```text
git-commands-cheatsheet/
├─ index.html
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  ├─ data/
│  │  ├─ commands.en.json   ← English (canonical source of truth)
│  │  ├─ commands.it.json   ← Italian translations
│  │  ├─ commands.fr.json   ← French translations
│  │  ├─ commands.es.json   ← Spanish translations
│  │  └─ ui.json            ← UI strings for all locales
│  └─ js/
│     ├─ app.js
│     └─ modules/
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

- ➕ Add useful missing Git commands
- 📝 Improve command descriptions and examples
- 🎨 Suggest UI/UX improvements
- 🧪 Help improve quality and consistency

Open an issue or PR directly and include clear details/screenshots when relevant.

---

## 📄 License

MIT © [abdosorour7](https://github.com/abdosorour7) — free to use, share, and modify.

---

<div align="center">

If this helped you, please consider giving it a ⭐ — it helps others discover it!

***I’m not primarily a web developer — I just build some practical tools that solve real problems.***

Built with thoughtful AI assistance.

---

**Made with ❤️ for the developer community**

</div>

