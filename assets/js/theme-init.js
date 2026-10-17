/**
 * Smidr Hugo Theme - Early Theme Initializer
 * Runs synchronously in <head> to eliminate dark/light theme flash.
 */
(function () {
  try {
    var THEME_KEY = 'smidr_theme_preference';
    var saved = localStorage.getItem(THEME_KEY);
    var theme = saved;
    if (!theme) {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
