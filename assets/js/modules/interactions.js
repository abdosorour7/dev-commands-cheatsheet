(function (w) {
  w.DevCheatsheet = w.DevCheatsheet || {};
  w.DevCheatsheet.interactions = {
    bindCopyButtons() {
      document.querySelectorAll(".copy-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const card = button.closest(".cmd-card");
          const cmdText = card
            .querySelector(".cmd-code")
            .innerText.replace(/\s+/g, " ")
            .replace(" / ", "\n")
            .trim();

          navigator.clipboard.writeText(cmdText).then(() => {
            button.classList.add("copied");
            button.textContent = "✓";
            setTimeout(() => {
              button.classList.remove("copied");
              button.textContent = "⧉";
            }, 1500);
          });
        });
      });
    },
    bindKeyboardShortcuts(searchInput) {
      document.addEventListener("keydown", (event) => {
        if (event.key === "/" && document.activeElement !== searchInput) {
          event.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
        if (event.key === "Escape") {
          searchInput.blur();
        }
      });
    },
    bindScrollToTop(scrollButton) {
      window.addEventListener("scroll", () => {
        scrollButton.classList.toggle("show", window.scrollY > 400);
      });

      scrollButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    },
  };
})(window);
