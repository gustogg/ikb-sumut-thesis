const themeButton = document.querySelector("[data-theme-toggle]");

function getPreferredTheme() {
  const savedTheme = localStorage.getItem("ikbs-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("ikbs-theme", theme);

  if (themeButton) {
    themeButton.textContent =
      theme === "dark" ? "Gunakan Light Mode" : "Gunakan Dark Mode";
  }
}

applyTheme(getPreferredTheme());

themeButton?.addEventListener("click", () => {
  const nextTheme = document.documentElement.classList.contains("dark")
    ? "light"
    : "dark";

  applyTheme(nextTheme);
});

document
  .querySelectorAll("[data-static-filter-form]")
  .forEach((form) => {
    form.addEventListener("submit", (event) => {
      const select = form.querySelector("select");
      const selectedOption = select?.selectedOptions?.[0];
      const staticUrl = selectedOption?.dataset?.staticUrl;

      if (!staticUrl) {
        return;
      }

      event.preventDefault();
      window.location.assign(staticUrl);
    });
  });
