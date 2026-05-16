# Frontend scripts

No bundler: plain scripts, load order matters.

## Load order (`index.html`)

1. `modules/paths.js` — `window.DevCheatsheet.paths` (URL helpers)
2. `modules/state.js` — `DevCheatsheet.state`
3. `modules/interactions.js` — `DevCheatsheet.interactions`
4. `modules/render.js` — `DevCheatsheet.render`
5. `modules/data-loader.js` — `DevCheatsheet.dataLoader`
6. `modules/i18n.js` — `DevCheatsheet.i18n`
7. `app.js` — bootstraps the page (expects all namespaces above)

All module files attach to `window.DevCheatsheet` and are deferred until after HTML parse.

## Adding a UI feature

Prefer a new file under `modules/` plus one line in `index.html` and `sw.js` precache, or extend the smallest existing module that owns that concern.
