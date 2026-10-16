/**
 * Smidr Hugo Theme - KaTeX Auto-Render Engine
 * Safely initializes and renders LaTeX equations without inline script tags or inline event handlers (strict CSP compliant).
 */

(function () {
  'use strict';

  function renderKaTeX() {
    // Only attempt rendering if the KaTeX stylesheet is loaded on the page
    const hasKaTeX = document.querySelector('link[href*="katex"]');
    if (!hasKaTeX) return;

    let attempts = 0;
    const maxAttempts = 60; // poll for up to 6 seconds for deferred CDN script
    const interval = setInterval(() => {
      attempts++;
      if (typeof window.renderMathInElement === 'function') {
        clearInterval(interval);
        window.renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderKaTeX);
  } else {
    renderKaTeX();
  }
})();
