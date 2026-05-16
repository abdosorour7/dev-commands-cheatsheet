/**
 * URL helpers for static assets and JSON data (classic scripts — no import.meta).
 * Resolves relative to the current page so GitHub Pages subpaths work.
 */
(function (window) {
  const NS = (window.DevCheatsheet = window.DevCheatsheet || {});

  function getAssetBase() {
    let pathname = window.location.pathname || "/";
    if (pathname.endsWith(".html")) {
      pathname = pathname.slice(0, pathname.lastIndexOf("/") + 1);
    } else if (!pathname.endsWith("/")) {
      pathname += "/";
    }
    return new URL(pathname, window.location.origin).href;
  }

  /**
   * @param {string} relativePath Path under site root, e.g. "assets/brands/git.svg"
   * @returns {string} Absolute URL
   */
  function assetUrl(relativePath) {
    if (!relativePath || typeof relativePath !== "string") return "";
    const trimmed = relativePath.replace(/^\/+/, "");
    if (!trimmed || trimmed.includes("..")) return "";
    return new URL(trimmed, getAssetBase()).href;
  }

  /**
   * @param {string} filename File name only, e.g. "ui.json"
   */
  function dataUrl(filename) {
    return assetUrl(`assets/data/${filename}`);
  }

  NS.paths = { getAssetBase, assetUrl, dataUrl };
})(window);
