/**
 * Smidr Hugo Theme - Blog Filtering & Sorting
 * Client-side multi-tag & multi-category selector, AND/OR logic, and sorting.
 */

(function () {
  'use strict';

  function initBlogFilter() {
    const grid = document.getElementById('blog-posts-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.post-card'));
    const filterBtns = Array.from(document.querySelectorAll('.tax-checkbox-btn'));
    const modeBtn = document.getElementById('filter-mode-btn');
    const clearBtn = document.getElementById('filter-clear-btn');
    const sortSelect = document.getElementById('posts-sort-select');
    const emptyState = document.getElementById('posts-empty-state');
    const emptyClearBtn = document.getElementById('empty-clear-btn');
    const countLabel = document.getElementById('filter-count-label');

    const blogLayout = grid.closest('.blog-layout');
    const termVal = blogLayout ? (blogLayout.dataset.term || '').toLowerCase() : '';
    const termType = blogLayout ? (blogLayout.dataset.termType || '') : '';

    const selectedCategories = new Set();
    const selectedTags = new Set();
    let matchMode = 'AND'; // 'AND' or 'OR'

    function updateUI() {
      // Update buttons active states and aria
      filterBtns.forEach(btn => {
        const type = btn.dataset.type;
        const val = btn.dataset.value;
        const isSelected = type === 'category' ? selectedCategories.has(val) : selectedTags.has(val);
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      });

      const totalActive = selectedCategories.size + selectedTags.size;
      if (clearBtn) {
        clearBtn.style.display = totalActive > 0 ? 'inline-block' : 'none';
      }
      if (countLabel) {
        if (totalActive > 0) {
          countLabel.textContent = `${totalActive} active filter${totalActive > 1 ? 's' : ''}`;
          countLabel.style.display = 'block';
        } else {
          countLabel.style.display = 'none';
        }
      }

      if (modeBtn) {
        modeBtn.className = `filter-mode-btn mode-${matchMode.toLowerCase()}`;
        const modeText = modeBtn.querySelector('.mode-text');
        if (modeText) modeText.textContent = matchMode;
      }

      // Filter cards
      let visibleCount = 0;
      cards.forEach(card => {
        const cardCats = (card.dataset.categories || '').split(',').map(s => s.trim()).filter(Boolean);
        const cardTags = (card.dataset.tags || '').split(',').map(s => s.trim()).filter(Boolean);

        let matches = true;

        if (totalActive > 0) {
          if (matchMode === 'OR') {
            const hasCat = Array.from(selectedCategories).some(c => cardCats.includes(c));
            const hasTag = Array.from(selectedTags).some(t => cardTags.includes(t));
            matches = hasCat || hasTag;
          } else {
            // AND mode: must match all selected categories and all selected tags
            const matchesAllCats = Array.from(selectedCategories).every(c => cardCats.includes(c));
            const matchesAllTags = Array.from(selectedTags).every(t => cardTags.includes(t));
            matches = matchesAllCats && matchesAllTags;
          }
        }

        if (matches) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    function sortCards() {
      const sortVal = sortSelect ? sortSelect.value : 'date-desc';
      cards.sort((a, b) => {
        switch (sortVal) {
          case 'date-asc':
            return parseInt(a.dataset.date || 0, 10) - parseInt(b.dataset.date || 0, 10);
          case 'title-asc':
            return (a.dataset.title || '').localeCompare(b.dataset.title || '');
          case 'title-desc':
            return (b.dataset.title || '').localeCompare(a.dataset.title || '');
          case 'time-asc':
            return parseInt(a.dataset.readingTime || 0, 10) - parseInt(b.dataset.readingTime || 0, 10);
          case 'time-desc':
            return parseInt(b.dataset.readingTime || 0, 10) - parseInt(a.dataset.readingTime || 0, 10);
          case 'date-desc':
          default:
            return parseInt(b.dataset.date || 0, 10) - parseInt(a.dataset.date || 0, 10);
        }
      });

      // Re-append sorted cards in order
      cards.forEach(card => grid.appendChild(card));
    }

    // Handle clicks on category/tag buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.dataset.type;
        const val = btn.dataset.value;
        const set = type === 'category' ? selectedCategories : selectedTags;
        const wasSelected = set.has(val);
        const totalActive = selectedCategories.size + selectedTags.size;

        if (wasSelected) {
          // If you click a second time on an already selected tag or category, deselect all other choices
          if (totalActive > 1) {
            selectedCategories.clear();
            selectedTags.clear();
            set.add(val);
          } else {
            // Only this item was selected, deselect it
            set.delete(val);
          }
        } else {
          set.add(val);
        }

        updateUI();
      });
    });

    // Toggle match mode (AND / OR)
    if (modeBtn) {
      modeBtn.addEventListener('click', () => {
        matchMode = matchMode === 'AND' ? 'OR' : 'AND';
        updateUI();
      });
    }

    // Reset filters
    function clearAll() {
      selectedCategories.clear();
      selectedTags.clear();
      updateUI();
    }

    if (clearBtn) clearBtn.addEventListener('click', clearAll);
    if (emptyClearBtn) emptyClearBtn.addEventListener('click', clearAll);

    // Sort listener
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        sortCards();
      });
    }

    // Check if on a single term page
    if (termVal) {
      filterBtns.forEach(btn => {
        if (btn.dataset.value === termVal) {
          if (btn.dataset.type === 'category' || termType === 'category') {
            selectedCategories.add(termVal);
          } else {
            selectedTags.add(termVal);
          }
        }
      });
    }

    // Run initial sorting and filtering
    sortCards();
    updateUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogFilter);
  } else {
    initBlogFilter();
  }
})();
