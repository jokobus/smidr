/**
 * Smidr Hugo Theme - Client-Side BibTeX Parser & In-Text Citation Manager
 * Parses standard .bib files/blocks, supports multiple citation styles (numeric, author-year, alphabetic),
 * live style toggling in the header, filtering cited vs all entries, and smooth offset anchor jumps.
 */

(function () {
  'use strict';

  // Parse BibTeX format into structured JavaScript objects
  function parseBibtex(text) {
    const entries = [];
    if (!text) return entries;

    // Normalize newlines and remove BibTeX % comments
    const cleanText = text.replace(/%.*$/gm, '');

    // Regex to match @type{key, body}
    const entryRegex = /@(\w+)\s*\{\s*([^,\s]+)\s*,([^@]*)\}/gs;
    let match;

    while ((match = entryRegex.exec(cleanText)) !== null) {
      const type = match[1].toLowerCase();
      const key = match[2].trim();
      const body = match[3];

      const fields = { type, key, raw: match[0].trim() };

      // Match field = {value} or field = "value" or field = 2026
      const fieldRegex = /([a-zA-Z_]+)\s*=\s*(?:\{([^}]*)\}|"([^"]*)"|(\d+))/g;
      let fieldMatch;

      while ((fieldMatch = fieldRegex.exec(body)) !== null) {
        const fieldName = fieldMatch[1].toLowerCase();
        const fieldValue = (fieldMatch[2] !== undefined ? fieldMatch[2] : (fieldMatch[3] !== undefined ? fieldMatch[3] : fieldMatch[4])).trim();
        fields[fieldName] = fieldValue.replace(/[\{\}]/g, '');
      }

      entries.push(fields);
    }

    return entries;
  }

  // Extract author last names
  function getAuthorLastNames(authorsStr) {
    if (!authorsStr) return ['Anonymous'];
    const authors = authorsStr.split(/\s+and\s+/i);
    return authors.map(author => {
      const parts = author.trim().split(/,\s*/);
      if (parts.length > 1) {
        return parts[0].trim();
      }
      const words = author.trim().split(/\s+/);
      return words[words.length - 1];
    });
  }

  // Format full authors for reference list
  function formatAuthors(authorsStr) {
    if (!authorsStr) return 'Anonymous';
    const authors = authorsStr.split(/\s+and\s+/i);
    const formatted = authors.map(author => {
      const parts = author.trim().split(/,\s*/);
      if (parts.length > 1) {
        return `${parts[1]} ${parts[0]}`;
      }
      return author.trim();
    });

    if (formatted.length === 1) return formatted[0];
    if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
    return `${formatted.slice(0, -1).join(', ')}, and ${formatted[formatted.length - 1]}`;
  }

  // Compute author-year label: "Kalman, 1960", "Astrom & Murray, 2010", "Smith et al., 2024"
  function getAuthorYearLabel(entry, inline = true) {
    const lastNames = getAuthorLastNames(entry.author);
    const year = entry.year || 'n.d.';
    let authorPart = '';
    if (lastNames.length === 1) {
      authorPart = lastNames[0];
    } else if (lastNames.length === 2) {
      authorPart = `${lastNames[0]} & ${lastNames[1]}`;
    } else {
      authorPart = `${lastNames[0]} et al.`;
    }
    return inline ? `${authorPart}, ${year}` : `${authorPart} (${year})`;
  }

  // Compute alphabetic label: "Kal60", "AM10", "AMS10", "Ast+10"
  function getAlphaLabel(entry) {
    const lastNames = getAuthorLastNames(entry.author);
    const year = (entry.year || '').toString();
    const shortYear = year.length >= 2 ? year.slice(-2) : '??';

    if (lastNames.length === 1) {
      const name = lastNames[0].replace(/[^a-zA-Z]/g, '');
      const prefix = name.length >= 3 ? name.slice(0, 3) : (name + '   ').slice(0, 3);
      return prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase() + shortYear;
    } else if (lastNames.length === 2) {
      return (lastNames[0][0] + lastNames[1][0]).toUpperCase() + shortYear;
    } else if (lastNames.length === 3) {
      return (lastNames[0][0] + lastNames[1][0] + lastNames[2][0]).toUpperCase() + shortYear;
    } else {
      const name = lastNames[0].replace(/[^a-zA-Z]/g, '');
      const prefix = name.length >= 3 ? name.slice(0, 3) : name;
      return prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase() + '+' + shortYear;
    }
  }

  // Format a single entry into clean academic HTML
  function renderCitationHtml(entry) {
    const authors = formatAuthors(entry.author);
    const title = entry.title || 'Untitled';
    const venue = entry.journal || entry.booktitle || entry.school || entry.publisher || '';
    const year = entry.year || '';
    const volume = entry.volume ? `vol. ${entry.volume}` : '';
    const number = entry.number ? `no. ${entry.number}` : '';
    const pages = entry.pages ? `pp. ${entry.pages}` : '';
    const doi = entry.doi || '';
    const url = entry.url || (doi ? `https://doi.org/${doi}` : '');

    let details = [];
    if (venue) details.push(`<em>${venue}</em>`);
    if (volume) details.push(volume);
    if (number) details.push(number);
    if (pages) details.push(pages);
    if (year) details.push(year);

    let html = `
      <span class="bib-authors">${authors}.</span>
      <span class="bib-title">"${title}."</span>
      <span class="bib-venue">${details.join(', ')}.</span>
    `;

    if (url) {
      html += ` <a href="${url}" class="bib-doi-link" target="_blank" rel="noopener noreferrer"><span>🔗</span> ${doi ? `doi:${doi}` : 'Link'}</a>`;
    }

    return html;
  }

  // Main init function
  function initBibtex() {
    const bibSections = document.querySelectorAll('.smidr-bibliography-section');
    const citeLinks = Array.from(document.querySelectorAll('a.cite-ref'));

    if (bibSections.length === 0 && citeLinks.length === 0) return;

    // Collect all entries across bibliography sources
    const allEntries = new Map();
    bibSections.forEach(section => {
      const sourceEl = section.querySelector('.bibtex-source');
      if (sourceEl) {
        const parsed = parseBibtex(sourceEl.textContent);
        parsed.forEach(entry => {
          allEntries.set(entry.key.toLowerCase(), entry);
        });
      }
    });

    // Map citation keys to sequential numbers [1], [2], ...
    const keyToNumber = new Map();
    let counter = 1;

    citeLinks.forEach(link => {
      const rawKey = link.dataset.citeKey || '';
      const key = rawKey.toLowerCase();
      if (!key) return;

      if (!keyToNumber.has(key)) {
        keyToNumber.set(key, counter++);
      }

      // Add tooltip preview on hover
      const entry = allEntries.get(key);
      if (entry && !link.querySelector('.cite-tooltip')) {
        const tooltip = document.createElement('div');
        tooltip.className = 'cite-tooltip';
        tooltip.innerHTML = `<strong>${formatAuthors(entry.author)}</strong> (${entry.year || 'n.d.'})<br><em>"${entry.title || 'Untitled'}"</em>`;
        link.appendChild(tooltip);
      }
    });

    // Active citation style (numeric | author-year | alphabetic)
    const primarySection = bibSections[0];
    let currentStyle = (primarySection && primarySection.dataset.defaultStyle) || 'numeric';
    let currentFilter = (primarySection && primarySection.dataset.showAll === 'true') ? 'all' : 'cited';

    // If no citations are cited in text, default filter to 'all' so list isn't empty
    if (keyToNumber.size === 0) {
      currentFilter = 'all';
    }

    // Function to apply citation style across document
    function applyStyle(style) {
      currentStyle = style;

      // Update groups and in-text links
      const groups = document.querySelectorAll('.cite-group');
      if (groups.length > 0) {
        groups.forEach(group => {
          const links = Array.from(group.querySelectorAll('a.cite-ref'));
          if (links.length === 0) return;

          if (style === 'numeric') {
            const nums = links.map(link => {
              const k = (link.dataset.citeKey || '').toLowerCase();
              return keyToNumber.get(k) || k;
            });
            links.forEach((link, idx) => {
              const span = link.querySelector('.cite-num');
              if (span) {
                if (idx === 0) {
                  span.textContent = `[${nums.join(', ')}]`;
                } else {
                  span.textContent = '';
                }
              }
            });
          } else if (style === 'author-year') {
            links.forEach(link => {
              const k = (link.dataset.citeKey || '').toLowerCase();
              const entry = allEntries.get(k);
              const label = entry ? getAuthorYearLabel(entry, true) : k;
              const span = link.querySelector('.cite-num');
              if (span) span.textContent = `(${label})`;
            });
          } else if (style === 'alphabetic') {
            links.forEach(link => {
              const k = (link.dataset.citeKey || '').toLowerCase();
              const entry = allEntries.get(k);
              const label = entry ? getAlphaLabel(entry) : k;
              const span = link.querySelector('.cite-num');
              if (span) span.textContent = `[${label}]`;
            });
          }
        });
      }

      // Update standalone links not in groups
      citeLinks.forEach(link => {
        if (link.closest('.cite-group')) return;
        const k = (link.dataset.citeKey || '').toLowerCase();
        const span = link.querySelector('.cite-num');
        if (!span) return;

        if (style === 'numeric') {
          const num = keyToNumber.get(k) || k;
          span.textContent = `[${num}]`;
        } else if (style === 'author-year') {
          const entry = allEntries.get(k);
          const label = entry ? getAuthorYearLabel(entry, true) : k;
          span.textContent = `(${label})`;
        } else if (style === 'alphabetic') {
          const entry = allEntries.get(k);
          const label = entry ? getAlphaLabel(entry) : k;
          span.textContent = `[${label}]`;
        }
      });

      // Update bibliography entry labels
      document.querySelectorAll('.bib-entry').forEach(entryEl => {
        const key = entryEl.dataset.key;
        const entry = allEntries.get(key);
        const numSpan = entryEl.querySelector('.bib-num');
        if (!numSpan || !entry) return;

        if (style === 'numeric') {
          const num = keyToNumber.get(key) || '*';
          numSpan.textContent = `[${num}]`;
        } else if (style === 'author-year') {
          numSpan.textContent = getAuthorYearLabel(entry, false);
        } else if (style === 'alphabetic') {
          numSpan.textContent = `[${getAlphaLabel(entry)}]`;
        }
      });

      // Update active state on style switcher buttons
      document.querySelectorAll('.bib-style-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.style === style);
      });
    }

    // Function to apply filter (cited vs all)
    function applyFilter(filter) {
      currentFilter = filter;
      document.querySelectorAll('.bib-entry').forEach(entryEl => {
        const isCited = entryEl.dataset.cited === 'true';
        if (filter === 'cited' && !isCited) {
          entryEl.style.display = 'none';
        } else {
          entryEl.style.display = '';
        }
      });

      document.querySelectorAll('.bib-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
      });
    }

    // Render bibliography lists
    bibSections.forEach(section => {
      const listEl = section.querySelector('.bib-entries-list');
      if (!listEl) return;

      listEl.innerHTML = '';

      // Count cited entries
      let citedCount = 0;
      allEntries.forEach((_, key) => {
        if (keyToNumber.has(key)) citedCount++;
      });
      const allCount = allEntries.size;

      // Update counters in header
      const citedBadge = section.querySelector('.bib-count-cited');
      if (citedBadge) citedBadge.textContent = citedCount.toString();
      const allBadge = section.querySelector('.bib-count-all');
      if (allBadge) allBadge.textContent = allCount.toString();

      // Sort entries: first cited in text by [1], [2] order, then remaining alphabetically
      const sortedKeys = Array.from(allEntries.keys()).sort((a, b) => {
        const numA = keyToNumber.get(a) || 9999;
        const numB = keyToNumber.get(b) || 9999;
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
      });

      sortedKeys.forEach(key => {
        const entry = allEntries.get(key);
        const isCited = keyToNumber.has(key);
        const num = keyToNumber.get(key) || '*';

        const li = document.createElement('li');
        li.className = 'bib-entry';
        li.dataset.key = key;
        li.dataset.cited = isCited ? 'true' : 'false';
        li.id = `bib-${key.replace(/[^a-z0-9_-]/g, '-')}`;

        li.innerHTML = `
          <div class="bib-entry-main">
            <span class="bib-num">[${num}]</span>
            <div class="bib-body">
              <div class="bib-formatted">${renderCitationHtml(entry)}</div>
              <details class="bib-raw-details">
                <summary class="bib-raw-summary">
                  <span>BibTeX</span>
                </summary>
                <div class="bib-raw-box">
                  <div class="bib-raw-header">
                    <span class="bibtex-badge">@${entry.type.toUpperCase()}</span>
                    <button class="code-copy-btn bib-copy-btn" type="button" aria-label="Copy BibTeX snippet">
                      <span>📋</span> <span>Copy BibTeX</span>
                    </button>
                  </div>
                  <pre class="bib-raw-code"><code>${entry.raw}</code></pre>
                </div>
              </details>
            </div>
          </div>
        `;

        // Wire copy button
        const copyBtn = li.querySelector('.bib-copy-btn');
        if (copyBtn) {
          copyBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
              await navigator.clipboard.writeText(entry.raw);
              copyBtn.classList.add('copied');
              copyBtn.innerHTML = `<span>✓</span> <span>Copied!</span>`;
              setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = `<span>📋</span> <span>Copy BibTeX</span>`;
              }, 2000);
            } catch (err) {
              console.error('Failed to copy BibTeX: ', err);
            }
          });
        }

        listEl.appendChild(li);
      });

      // Wire interactive style buttons
      section.querySelectorAll('.bib-style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          applyStyle(btn.dataset.style);
        });
      });

      // Wire interactive filter buttons
      section.querySelectorAll('.bib-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          applyFilter(btn.dataset.filter);
        });
      });
    });

    // Apply initial style & filter
    applyStyle(currentStyle);
    applyFilter(currentFilter);

    // Wire standalone bibtex card copy buttons
    document.querySelectorAll('.bibtex-card').forEach(card => {
      const btn = card.querySelector('.bib-copy-btn');
      const code = card.querySelector('code');
      if (btn && code) {
        btn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(code.innerText);
            btn.classList.add('copied');
            btn.innerHTML = `<span>✓</span> <span>Copied!</span>`;
            setTimeout(() => {
              btn.classList.remove('copied');
              btn.innerHTML = `<span>📋</span> <span>Copy BibTeX</span>`;
            }, 2000);
          } catch (err) {
            console.error('Failed to copy BibTeX: ', err);
          }
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initBibtex);

})();
