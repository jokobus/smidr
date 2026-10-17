/**
 * Smidr Hugo Theme - Core Script
 * Handles theme toggling, dynamic tab/favicon, mobile navigation, and code copy actions.
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

  // Generate dynamic alert favicon via SVG data URI with cyberpunk gradient hammer and alert beacon
  const awayFaviconSvg = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="awayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff" />
          <stop offset="50%" stop-color="#8a2be2" />
          <stop offset="100%" stop-color="#ff007a" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="#090d16" />
      <rect x="2" y="2" width="96" height="96" rx="22" fill="none" stroke="url(#awayGrad)" stroke-width="3" />
      <g transform="translate(50, 52) rotate(-35) translate(-50, -50)">
        <path d="M46 44 L54 44 L55 86 L45 86 Z" fill="#94a3b8" />
        <rect x="44" y="62" width="12" height="4" rx="2" fill="#00f0ff" />
        <rect x="44" y="74" width="12" height="4" rx="2" fill="#ff007a" />
        <path d="M22 24 L78 24 L82 30 L80 44 L76 48 L24 48 L20 44 L18 30 Z" fill="url(#awayGrad)" />
      </g>
      <circle cx="82" cy="18" r="14" fill="#ff007a" />
      <circle cx="82" cy="18" r="7" fill="#ffffff" />
    </svg>
  `.trim())}`;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      const awayTitle = document.body.dataset.tabAwayTitle || "🔨 Smidr: Don't miss this update!";
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

  // --- Mobile Navigation Drawer Toggle ---
  function setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!menuBtn || !drawer) return;

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      drawer.classList.toggle('open');
      drawer.setAttribute('aria-hidden', isExpanded);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
        drawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // --- Enhanced Code Blocks (Language Tags & Copy to Clipboard) ---
  function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.article-content pre > code, .highlight > pre > code');
    
    codeBlocks.forEach(code => {
      const pre = code.closest('pre');
      if (!pre || pre.closest('.highlight-wrapper') || pre.closest('.code-runner-box') || pre.closest('.pgp-card') || pre.closest('.pgp-armored-block')) return;

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

  // --- OpenPGP Card Copy Handlers ---
  function setupPgpCopy() {
    document.addEventListener('click', async (e) => {
      const copyPgpBtn = e.target.closest('[data-action="copy-pgp"]');
      if (copyPgpBtn) {
        const block = copyPgpBtn.closest('.pgp-armored-block') || copyPgpBtn.closest('.pgp-card');
        const codeEl = block ? block.querySelector('.pgp-armored-code') : null;
        if (codeEl) {
          try {
            await navigator.clipboard.writeText(codeEl.innerText.trim());
            copyPgpBtn.classList.add('copied');
            copyPgpBtn.innerHTML = `<span>✓</span> <span class="copy-text">Copied!</span>`;
            setTimeout(() => {
              copyPgpBtn.classList.remove('copied');
              copyPgpBtn.innerHTML = `<span>📋</span> <span class="copy-text">Copy Key</span>`;
            }, 2000);
          } catch (err) {
            console.error('Failed to copy PGP key:', err);
          }
        }
        return;
      }

      const copyFpBtn = e.target.closest('[data-action="copy-fp"]');
      if (copyFpBtn) {
        const fpVal = copyFpBtn.dataset.fp || copyFpBtn.closest('.pgp-fp-value-row')?.querySelector('.pgp-fp-code')?.innerText;
        if (fpVal) {
          try {
            await navigator.clipboard.writeText(fpVal.replace(/\s+/g, ''));
            copyFpBtn.classList.add('copied');
            copyFpBtn.innerHTML = `<span>✓</span> <span class="copy-text">Copied!</span>`;
            setTimeout(() => {
              copyFpBtn.classList.remove('copied');
              copyFpBtn.innerHTML = `<span>📋</span> <span class="copy-text">Copy</span>`;
            }, 2000);
          } catch (err) {
            console.error('Failed to copy fingerprint:', err);
          }
        }
      }
    });
  }

  // --- Flashcard Interaction Handler ---
  function setupFlashcards() {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.flashcard-container');
      if (card && !e.target.closest('a, button, input, textarea')) {
        card.classList.toggle('is-flipped');
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('flashcard-container')) {
        e.preventDefault();
        e.target.classList.toggle('is-flipped');
      }
    });
  }

  // --- DOM Ready Hook ---
  document.addEventListener('DOMContentLoaded', () => {
    enhanceCodeBlocks();
    setupMobileMenu();
    setupPgpCopy();
    setupFlashcards();
    
    // Bind theme buttons
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', window.toggleTheme);
    });
  });

})();
