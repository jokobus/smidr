/**
 * Smidr Hugo Theme - Client-Side BibTeX Parser & In-Text Citation Manager
 * Parses standard .bib files/blocks, numbers [1], [2] citations, creates hover tooltips,
 * and generates clean IEEE/ACM formatted references with one-click copy buttons.
 */

(function () {
  'use strict';

  // Parse BibTeX format into structured JavaScript objects
  function parseBibtex(text) {
    const entries = [];
    if (!text) return entries;

    // Normalize newlines and clean comments
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
        // Clean inner braces (e.g. {IEEE})
        fields[fieldName] = fieldValue.replace(/[\{\}]/g, '');
      }

      entries.push(fields);
    }

    return entries;
  }

  // Format authors into "A. Author, B. Author, and C. Author"
  function formatAuthors(authorsStr) {
    if (!authorsStr) return 'Anonymous';
    const authors = authorsStr.split(/\s+and\s+/i);
    const formatted = authors.map(author => {
      const parts = author.trim().split(/,\s*/);
      if (parts.length > 1) {
        // "Last, First" -> "First Last"
        return `${parts[1]} ${parts[0]}`;
      }
      return author.trim();
    });

    if (formatted.length === 1) return formatted[0];
    if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
    return `${formatted.slice(0, -1).join(', ')}, and ${formatted[formatted.length - 1]}`;
  }

  // Format a single entry into a clean academic citation
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
    const bibSections = document.querySelectorAll('.smidr-bibliography');
    const citeLinks = Array.from(document.querySelectorAll('a.cite-ref'));

    if (bibSections.length === 0 && citeLinks.length === 0) return;

    // Collect all entries across bibliography sources
    const allEntries = new Map();
    bibSections.forEach(section => {
      const sourceEl = section.querySelector('.bibtex-source');
      if (sourceEl) {
        const parsed = parseBibtex(sourceEl.textContent);
        parsed.forEach(entry => allEntries.set(entry.key, entry));
      }
    });

    // Map citation keys to sequential numbers [1], [2], ...
    const keyToNumber = new Map();
    let counter = 1;

    citeLinks.forEach(link => {
      const key = link.dataset.citeKey;
      if (!key) return;

      if (!keyToNumber.has(key)) {
        keyToNumber.set(key, counter++);
      }

      const num = keyToNumber.get(key);
      const spanNum = link.querySelector('.cite-num');
      if (spanNum) spanNum.textContent = `[${num}]`;

      // Add tooltip preview on hover
      const entry = allEntries.get(key);
      if (entry) {
        const tooltip = document.createElement('div');
        tooltip.className = 'cite-tooltip';
        tooltip.innerHTML = `<strong>${formatAuthors(entry.author)}</strong> (${entry.year || 'n.d.'})<br><em>"${entry.title || 'Untitled'}"</em>`;
        link.appendChild(tooltip);
      }
    });

    // Render bibliography lists
    bibSections.forEach(section => {
      const listEl = section.querySelector('.bib-entries-list');
      if (!listEl) return;

      listEl.innerHTML = '';

      // Sort entries: first those cited in text by their [1], [2] order, then remaining
      const sortedKeys = Array.from(allEntries.keys()).sort((a, b) => {
        const numA = keyToNumber.get(a) || 9999;
        const numB = keyToNumber.get(b) || 9999;
        return numA - numB;
      });

      sortedKeys.forEach(key => {
        const entry = allEntries.get(key);
        const num = keyToNumber.get(key) || '*';

        const li = document.createElement('li');
        li.className = 'bib-entry';
        li.id = `bib-${key.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`;

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
    });

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
