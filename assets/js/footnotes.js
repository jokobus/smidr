/**
 * Smidr Hugo Theme - Modern Inline Footnote Popovers
 * Shows footnote definitions directly inline on hover or click without jumping to bottom.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Standard Hugo markdown renders footnotes with sup.footnote-ref a[href^="#fn:"]
    const footnoteRefs = document.querySelectorAll('sup.footnote-ref a');

    footnoteRefs.forEach(ref => {
      const targetId = ref.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      const footnoteEl = document.querySelector(targetId);
      if (!footnoteEl) return;

      // Extract footnote content, removing return-arrow link
      const clone = footnoteEl.cloneNode(true);
      const returnLink = clone.querySelector('a.footnote-backref, a[href^="#fnref"]');
      if (returnLink) returnLink.remove();
      const contentHtml = clone.innerHTML.trim();

      // Create popover container
      const popover = document.createElement('div');
      popover.className = 'footnote-popover';
      popover.setAttribute('role', 'tooltip');
      popover.innerHTML = contentHtml;

      const parentSup = ref.closest('sup');
      parentSup.style.position = 'relative';
      parentSup.appendChild(popover);

      // Hover events
      parentSup.addEventListener('mouseenter', () => {
        popover.classList.add('visible');
      });

      parentSup.addEventListener('mouseleave', () => {
        popover.classList.remove('visible');
      });

      // Click/Tap toggle for touch devices
      ref.addEventListener('click', (e) => {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
          e.preventDefault();
          popover.classList.toggle('visible');
        }
      });
    });

    // Dismiss any active popover on tap elsewhere
    document.addEventListener('click', (e) => {
      if (!e.target.closest('sup.footnote-ref')) {
        document.querySelectorAll('.footnote-popover.visible').forEach(p => p.classList.remove('visible'));
      }
    });
  });

})();
