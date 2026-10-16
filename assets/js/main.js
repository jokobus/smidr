/**
 * Smidr Hugo Theme - Core Script
 * Handles theme toggling, dynamic tab/favicon, and code copy actions.
 */

(function () {
  'use strict';

  // --- Theme Management ---
  const THEME_KEY = 'smidr_theme_preference';
  
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    
    // Update theme toggle icons/labels if present
    const toggleBtns = document.querySelectorAll('[data-action="toggle-theme"]');
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      const icon = btn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    });
  }

  // Initialize theme immediately to prevent FOUC
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  window.toggleTheme = function () {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  };

  // Listen to OS theme changes if user has no explicit override
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });

  // --- Dynamic Tab Title & Favicon ---
  const originalTitle = document.title;
  let originalFavicon = '';
  const faviconLink = document.querySelector('link[rel*="icon"]');
  if (faviconLink) {
    originalFavicon = faviconLink.href;
  }

  // Generate dynamic alert favicon via SVG data URI
  const awayFaviconSvg = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23ff007a"/><text x="50" y="68" font-size="52" text-anchor="middle" fill="white" font-family="monospace" font-weight="900">!</text></svg>`;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      const awayTitle = document.body.dataset.tabAwayTitle || "⚡ Smidr: Don't miss this update!";
      document.title = awayTitle;
      if (faviconLink) {
        faviconLink.href = awayFaviconSvg;
      }
    } else {
      document.title = originalTitle;
      if (faviconLink && originalFavicon) {
        faviconLink.href = originalFavicon;
      }
    }
  });

  // --- Enhanced Code Blocks (Language Tags & Copy to Clipboard) ---
  function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.article-content pre > code, .highlight > pre > code');
    
    codeBlocks.forEach(code => {
      const pre = code.closest('pre');
      if (!pre || pre.closest('.highlight-wrapper') || pre.closest('.runner-box')) return;

      // Extract language from class (e.g. language-python, language-rust)
      let lang = 'CODE';
      const classes = Array.from(code.classList);
      for (const cls of classes) {
        if (cls.startsWith('language-')) {
          lang = cls.replace('language-', '').toUpperCase();
          break;
        }
      }

      // Create wrapper structure
      const wrapper = document.createElement('div');
      wrapper.className = 'highlight-wrapper';

      const header = document.createElement('div');
      header.className = 'highlight-header';

      const badge = document.createElement('span');
      badge.className = 'code-lang-badge';
      badge.textContent = lang;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.setAttribute('type', 'button');
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      copyBtn.innerHTML = `<span>📋</span> <span class="copy-text">Copy</span>`;

      copyBtn.addEventListener('click', async () => {
        const textToCopy = code.innerText;
        try {
          await navigator.clipboard.writeText(textToCopy);
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = `<span>✓</span> <span class="copy-text">Copied!</span>`;
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `<span>📋</span> <span class="copy-text">Copy</span>`;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code: ', err);
        }
      });

      header.appendChild(badge);
      header.appendChild(copyBtn);

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }

  // --- DOM Ready Hook ---
  document.addEventListener('DOMContentLoaded', () => {
    enhanceCodeBlocks();
    
    // Bind theme buttons
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', window.toggleTheme);
    });
  });

})();
