/**
 * Smidr Hugo Theme - Modern Inline Footnote Popovers
 * Shows footnote definitions directly inline on hover or click without jumping to bottom.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Hugo Goldmark renders: <sup id="fnref:1"><a href="#fn:1" class="footnote-ref" role="doc-noteref">1</a></sup>
    // Footnote definition in list: <li id="fn:1"><p>... <a href="#fnref:1" class="footnote-backref" role="doc-backlink">↩︎</a></p></li>
    const footnoteLinks = document.querySelectorAll('a.footnote-ref, a[role="doc-noteref"], sup[id^="fnref:"] a');

    if (footnoteLinks.length === 0) return;

    footnoteLinks.forEach(ref => {
      const targetId = ref.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      const footnoteEl = document.querySelector(targetId);
      if (!footnoteEl) return;

      // Extract footnote content, removing return-arrow backlinks
      const clone = footnoteEl.cloneNode(true);
      clone.querySelectorAll('a.footnote-backref, a[role="doc-backlink"], a[href^="#fnref"]').forEach(el => el.remove());
      const contentHtml = clone.innerHTML.trim();

      // Create popover container
      const popover = document.createElement('div');
      popover.className = 'footnote-popover';
      popover.setAttribute('role', 'tooltip');
      popover.innerHTML = contentHtml;

      const parentSup = ref.closest('sup') || ref.parentElement;
      parentSup.classList.add('has-footnote-popover');
      parentSup.style.position = 'relative';
      parentSup.appendChild(popover);

      // Helper to adjust positioning if offscreen
      function adjustPosition() {
        popover.classList.add('visible');
        const rect = popover.getBoundingClientRect();
        if (rect.left < 10) {
          popover.style.left = '0';
          popover.style.transform = 'none';
        } else if (rect.right > window.innerWidth - 10) {
          popover.style.left = 'auto';
          popover.style.right = '0';
          popover.style.transform = 'none';
        }
      }

      function hidePosition() {
        popover.classList.remove('visible');
        popover.style.left = '';
        popover.style.right = '';
        popover.style.transform = '';
      }

      // Hover events with gentle grace period so users can hover into popover
      let hoverTimer = null;
      parentSup.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
        adjustPosition();
      });

      parentSup.addEventListener('mouseleave', () => {
        hoverTimer = setTimeout(() => {
          hidePosition();
        }, 150);
      });

      // Keyboard accessibility (focus/blur)
      ref.addEventListener('focus', adjustPosition);
      ref.addEventListener('blur', hidePosition);

      // Touch toggle
      ref.addEventListener('click', (e) => {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
          // If on touch, first tap shows popover, second tap follows jump
          if (!popover.classList.contains('visible')) {
            e.preventDefault();
            document.querySelectorAll('.footnote-popover.visible').forEach(p => p.classList.remove('visible'));
            adjustPosition();
          }
        }
      });
    });

    // Dismiss active popover on tap elsewhere
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.has-footnote-popover')) {
        document.querySelectorAll('.footnote-popover.visible').forEach(p => {
          p.classList.remove('visible');
          p.style.left = '';
          p.style.right = '';
          p.style.transform = '';
        });
      }
    });
  });

})();
