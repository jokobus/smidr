/**
 * Interactive Periodic Table of the Elements (PSE) - Smidr Theme
 * Features:
 * - Bilingual (DE/EN) with instant language toggle
 * - Show/hide Lanthanides & Actinides (f-block)
 * - Show/hide Transition Metals (d-block) with smooth collapse to 8 Main Groups (I-VIII)
 * - Dynamic search & category filtering
 * - Interactive Steckbrief modal with detailed metrics and Wikipedia links
 * - Keyboard navigation (← / → / Esc)
 * - Zoom controls (+ / - / reset)
 * - URL Hash deep-linking (#el-Fe, #26)
 */

(function () {
  'use strict';

  function initPSE() {
    const container = document.querySelector('.pse-container');
    if (!container || !window.SMIDR_PSE_DATA) return;

    const data = window.SMIDR_PSE_DATA;
    let currentLang = container.dataset.lang || 'en';
    let hideDBlock = false;
    let hideFBlock = false;
    let activeCategory = null;
    let currentScale = 1.0;
    let currentModalZ = 1;
    let currentSearchQuery = '';
    let isDetailedSearchOpen = false;
    let detailedFilters = {
      enMin: null,
      enMax: null,
      densityMin: null,
      densityMax: null,
      mpMin: null,
      mpMax: null,
      bpMin: null,
      bpMax: null,
      config: '',
      ox: ''
    };

    // Elements lookup map by Z
    const elemMap = new Map();
    data.forEach(el => elemMap.set(el.z, el));

    // Dictionaries
    const i18n = {
      en: {
        search_placeholder: "Search element (e.g. Fe, Iron, 26)...",
        detailed_search: "Detailed Search",
        density_label: "Density",
        density_unit: "g/cm³",
        boiling_point: "Boiling Point",
        melting_point: "Melting Point",
        electronegativity: "Electronegativity (Pauling)",
        electron_config: "Electron Configuration",
        electron_config_placeholder: "e.g. 3d, 4f, [Xe], 6s",
        oxidation_states: "Oxidation States",
        oxidation_states_placeholder: "e.g. +2, +3, -1",
        filter_min: "Min",
        filter_max: "Max",
        reset_filters: "Reset Filters",
        results_count: "elements",
        toggle_f_block: "Lanthanoids & Actinoids",
        toggle_d_block: "Transition Metals (3-12)",
        main_groups_badge: "8 Main Groups",
        full_table_badge: "Complete 18 Groups",
        group_col_prefix: "Group",
        period_row_prefix: "P",
        state_title: "State at 20°C:",
        cat_title: "Categories:",
        state_solid: "Solid",
        state_liquid: "Liquid",
        state_gas: "Gas",
        state_synthetic: "Synthetic",
        cat_alkali: "Alkali metals",
        cat_alkaline: "Alkaline earth",
        cat_transition: "Transition metals",
        cat_post_transition: "Post-transition",
        cat_metalloid: "Metalloids",
        cat_nonmetal: "Nonmetals",
        cat_halogen: "Halogens",
        cat_noble: "Noble gases",
        cat_lanthanide: "Lanthanoids",
        cat_actinide: "Actinoids",
        lbl_z: "Atomic Number",
        lbl_mass: "Relative Atomic Mass",
        lbl_en_pauling: "Electronegativity (Pauling)",
        lbl_en_ar: "Electronegativity (Allred-Rochow)",
        lbl_config: "Electron Configuration",
        lbl_ox: "Oxidation States",
        lbl_mp: "Melting Point",
        lbl_bp: "Boiling Point",
        lbl_density: "Density (20°C)",
        lbl_discovery: "Discovered",
        lbl_block: "Block & Period",
        wiki_btn: "Wikipedia Article ↗",
        prev: "← Previous",
        next: "Next →",
        close: "Close (Esc)",
        zoom_in: "Zoom In (+)",
        zoom_out: "Zoom Out (−)",
        zoom_reset: "Reset Zoom"
      },
      de: {
        search_placeholder: "Element suchen (z.B. Fe, Eisen, 26)...",
        detailed_search: "Erweiterte Suche",
        density_label: "Dichte",
        density_unit: "g/cm³",
        boiling_point: "Siedepunkt",
        melting_point: "Schmelzpunkt",
        electronegativity: "Elektronegativität (Pauling)",
        electron_config: "Elektronenkonfiguration",
        electron_config_placeholder: "z.B. 3d, 4f, [Xe], 6s",
        oxidation_states: "Oxidationsstufen",
        oxidation_states_placeholder: "z.B. +2, +3, -1",
        filter_min: "Min",
        filter_max: "Max",
        reset_filters: "Filter zurücksetzen",
        results_count: "Elemente",
        toggle_f_block: "Lanthanoide & Actinoide",
        toggle_d_block: "Nebengruppen (3-12)",
        main_groups_badge: "8 Hauptgruppen",
        full_table_badge: "Alle 18 Gruppen",
        group_col_prefix: "Gruppe",
        period_row_prefix: "P",
        state_title: "Aggregatzustand (20°C):",
        cat_title: "Serien:",
        state_solid: "Fest",
        state_liquid: "Flüssig",
        state_gas: "Gasförmig",
        state_synthetic: "Künstlich",
        cat_alkali: "Alkalimetalle",
        cat_alkaline: "Erdalkalimetalle",
        cat_transition: "Übergangsmetalle",
        cat_post_transition: "Metalle",
        cat_metalloid: "Halbmetalle",
        cat_nonmetal: "Nichtmetalle",
        cat_halogen: "Halogene",
        cat_noble: "Edelgase",
        cat_lanthanide: "Lanthanoide",
        cat_actinide: "Actinoide",
        lbl_z: "Ordnungszahl",
        lbl_mass: "Relative Atommasse",
        lbl_en_pauling: "Elektronegativität (Pauling)",
        lbl_en_ar: "Elektronegativität (Allred-Rochow)",
        lbl_config: "Elektronenkonfiguration",
        lbl_ox: "Oxidationsstufen",
        lbl_mp: "Schmelzpunkt",
        lbl_bp: "Siedepunkt",
        lbl_density: "Dichte (20°C)",
        lbl_discovery: "Entdeckung",
        lbl_block: "Block & Periode",
        wiki_btn: "Wikipedia-Artikel ↗",
        prev: "← Vorheriges",
        next: "Nächstes →",
        close: "Schließen (Esc)",
        zoom_in: "Vergrößern (+)",
        zoom_out: "Verkleinern (−)",
        zoom_reset: "Zoom zurücksetzen"
      }
    };

    // Category keys and color mapping
    const categories = [
      { key: "alkali", labelKey: "cat_alkali", color: "var(--pse-cat-alkali)" },
      { key: "alkaline-earth", labelKey: "cat_alkaline", color: "var(--pse-cat-alkaline)" },
      { key: "transition", labelKey: "cat_transition", color: "var(--pse-cat-transition)" },
      { key: "post-transition", labelKey: "cat_post_transition", color: "var(--pse-cat-post-transition)" },
      { key: "metalloid", labelKey: "cat_metalloid", color: "var(--pse-cat-metalloid)" },
      { key: "nonmetal", labelKey: "cat_nonmetal", color: "var(--pse-cat-nonmetal)" },
      { key: "halogen", labelKey: "cat_halogen", color: "var(--pse-cat-halogen)" },
      { key: "noble", labelKey: "cat_noble", color: "var(--pse-cat-noble)" },
      { key: "lanthanide", labelKey: "cat_lanthanide", color: "var(--pse-cat-lanthanide)" },
      { key: "actinide", labelKey: "cat_actinide", color: "var(--pse-cat-actinide)" }
    ];

    // Groups info (18 standard columns)
    const groupsInfo = [
      { g: 1, roman: "I A", name_en: "Alkali metals", name_de: "Alkalimetalle" },
      { g: 2, roman: "II A", name_en: "Alkaline earth", name_de: "Erdalkalimetalle" },
      { g: 3, roman: "III B", name_en: "Scandium group", name_de: "Scandiumgruppe" },
      { g: 4, roman: "IV B", name_en: "Titanium group", name_de: "Titangruppe" },
      { g: 5, roman: "V B", name_en: "Vanadium group", name_de: "Vanadiumgruppe" },
      { g: 6, roman: "VI B", name_en: "Chromium group", name_de: "Chromgruppe" },
      { g: 7, roman: "VII B", name_en: "Manganese group", name_de: "Mangangruppe" },
      { g: 8, roman: "VIII B", name_en: "Iron group", name_de: "Eisengruppe" },
      { g: 9, roman: "VIII B", name_en: "Cobalt group", name_de: "Cobaltgruppe" },
      { g: 10, roman: "VIII B", name_en: "Nickel group", name_de: "Nickelgruppe" },
      { g: 11, roman: "I B", name_en: "Copper group", name_de: "Kupfergruppe" },
      { g: 12, roman: "II B", name_en: "Zinc group", name_de: "Zinkgruppe" },
      { g: 13, roman: "III A", name_en: "Boron group", name_de: "Borgruppe" },
      { g: 14, roman: "IV A", name_en: "Carbon group", name_de: "Kohlenstoffgruppe" },
      { g: 15, roman: "V A", name_en: "Pnictogens", name_de: "Stickstoffgruppe" },
      { g: 16, roman: "VI A", name_en: "Chalcogens", name_de: "Chalkogene" },
      { g: 17, roman: "VII A", name_en: "Halogens", name_de: "Halogene" },
      { g: 18, roman: "VIII A", name_en: "Noble gases", name_de: "Edelgase" }
    ];

    // Main 8 Groups (when d-block is hidden)
    const mainGroupsInfo = [
      { g: 1, roman: "I A", name_en: "Alkali metals", name_de: "Alkalimetalle" },
      { g: 2, roman: "II A", name_en: "Alkaline earth", name_de: "Erdalkalimetalle" },
      { g: 13, roman: "III A", name_en: "Boron group", name_de: "Borgruppe" },
      { g: 14, roman: "IV A", name_en: "Carbon group", name_de: "Kohlenstoffgruppe" },
      { g: 15, roman: "V A", name_en: "Nitrogen group", name_de: "Stickstoffgruppe" },
      { g: 16, roman: "VI A", name_en: "Chalcogens", name_de: "Chalkogene" },
      { g: 17, roman: "VII A", name_en: "Halogens", name_de: "Halogene" },
      { g: 18, roman: "VIII A", name_en: "Noble gases", name_de: "Edelgase" }
    ];

    // Calculate grid placement
    function getGridCoords(el, isDBlockHidden) {
      const z = el.z;
      const p = el.p;
      const g = el.g;
      const cat = el.cat;

      // Lanthanides & Actinides (f-block rows)
      if (cat === 'lanthanide') {
        const colOffset = z - 57; // 0 to 14
        return {
          row: 10,
          col: 4 + colOffset, // Place in columns 4 to 18
          isFBlock: true,
          isDBlock: false
        };
      }
      if (cat === 'actinide') {
        const colOffset = z - 89; // 0 to 14
        return {
          row: 11,
          col: 4 + colOffset,
          isFBlock: true,
          isDBlock: false
        };
      }

      // Standard elements in main grid (Period 1 to 7)
      const gridRow = 1 + p; // Row 1 is header, periods 1-7 are rows 2-8
      let gridCol = 1 + g;   // Col 1 is period header, groups 1-18 are cols 2-19

      const isDBlockElem = (g >= 3 && g <= 12 && p >= 4);

      if (isDBlockHidden) {
        if (g <= 2) {
          gridCol = 1 + g;
        } else if (g >= 13) {
          gridCol = 1 + (g - 10); // 13 -> 3, 14 -> 4, etc. (Cols 3 to 8)
        }
      }

      return {
        row: gridRow,
        col: gridCol,
        isFBlock: false,
        isDBlock: isDBlockElem
      };
    }

    // Build DOM structure
    function buildPSE() {
      container.innerHTML = '';

      const t = i18n[currentLang];

      // 1. Toolbar
      const toolbar = document.createElement('div');
      toolbar.className = 'pse-toolbar';

      // Controls left: Search + Category Filters
      const controlsLeft = document.createElement('div');
      controlsLeft.className = 'pse-controls-group';

      const searchBox = document.createElement('div');
      searchBox.className = 'pse-search-box';
      searchBox.innerHTML = `
        <div class="pse-search-input-wrap">
          <span class="pse-search-icon">🔍</span>
          <input type="text" id="pse-search-input" placeholder="${t.search_placeholder}" autocomplete="off" value="${currentSearchQuery || ''}" />
          <button class="pse-search-clear" id="pse-search-clear" title="Clear" style="${currentSearchQuery ? 'display:block;' : ''}">✕</button>
        </div>
        <button type="button" class="pse-detailed-search-btn ${isDetailedSearchOpen ? 'active' : ''}" id="pse-btn-detailed-search" title="${t.detailed_search}">
          <span>⚙️</span>
          <span>${t.detailed_search}</span>
        </button>
      `;

      controlsLeft.appendChild(searchBox);

      // Controls right: Toggles, Language, Zoom
      const controlsRight = document.createElement('div');
      controlsRight.className = 'pse-controls-group';

      // Transition Metals Toggle (Hauptgruppen collapse)
      const dBlockBtn = document.createElement('button');
      dBlockBtn.className = `pse-btn ${!hideDBlock ? 'active' : ''}`;
      dBlockBtn.id = 'pse-btn-dblock';
      dBlockBtn.innerHTML = `<span>⊞</span> <span>${t.toggle_d_block}</span>`;
      dBlockBtn.title = hideDBlock ? t.full_table_badge : t.main_groups_badge;

      // Lanthanides & Actinides Toggle
      const fBlockBtn = document.createElement('button');
      fBlockBtn.className = `pse-btn ${hideFBlock ? '' : 'active'}`;
      fBlockBtn.id = 'pse-btn-fblock';
      fBlockBtn.innerHTML = `<span>⊟</span> <span>${t.toggle_f_block}</span>`;

      // Language Switcher Toggle
      const langBtn = document.createElement('button');
      langBtn.className = 'pse-btn';
      langBtn.id = 'pse-btn-lang';
      langBtn.innerHTML = `<span>🌐</span> <strong>${currentLang.toUpperCase()}</strong>`;
      langBtn.title = currentLang === 'en' ? 'Auf Deutsch umschalten' : 'Switch to English';

      // Zoom Buttons
      const zoomWrap = document.createElement('div');
      zoomWrap.className = 'pse-zoom-btns';
      zoomWrap.innerHTML = `
        <button id="pse-zoom-out" title="${t.zoom_out}">−</button>
        <button id="pse-zoom-reset" title="${t.zoom_reset}">100%</button>
        <button id="pse-zoom-in" title="${t.zoom_in}">+</button>
      `;

      controlsRight.appendChild(dBlockBtn);
      controlsRight.appendChild(fBlockBtn);
      controlsRight.appendChild(langBtn);
      controlsRight.appendChild(zoomWrap);

      toolbar.appendChild(controlsLeft);
      toolbar.appendChild(controlsRight);
      container.appendChild(toolbar);

      // 1b. Detailed Search Panel
      const detailedPanel = document.createElement('div');
      detailedPanel.className = 'pse-detailed-panel';
      detailedPanel.id = 'pse-detailed-panel';
      detailedPanel.style.display = isDetailedSearchOpen ? 'block' : 'none';
      detailedPanel.innerHTML = `
        <div class="pse-detailed-grid">
          <div class="pse-detailed-field">
            <label>${t.electronegativity}</label>
            <div class="pse-range-inputs">
              <input type="number" step="0.1" min="0" max="4.0" id="pse-filter-en-min" placeholder="${t.filter_min} (0.7)" value="${detailedFilters.enMin !== null ? detailedFilters.enMin : ''}" />
              <span>–</span>
              <input type="number" step="0.1" min="0" max="4.0" id="pse-filter-en-max" placeholder="${t.filter_max} (4.0)" value="${detailedFilters.enMax !== null ? detailedFilters.enMax : ''}" />
            </div>
          </div>
          <div class="pse-detailed-field">
            <label>${t.density_label} (${t.density_unit})</label>
            <div class="pse-range-inputs">
              <input type="number" step="0.01" min="0" id="pse-filter-density-min" placeholder="${t.filter_min}" value="${detailedFilters.densityMin !== null ? detailedFilters.densityMin : ''}" />
              <span>–</span>
              <input type="number" step="0.01" min="0" id="pse-filter-density-max" placeholder="${t.filter_max}" value="${detailedFilters.densityMax !== null ? detailedFilters.densityMax : ''}" />
            </div>
          </div>
          <div class="pse-detailed-field">
            <label>${t.melting_point} (°C)</label>
            <div class="pse-range-inputs">
              <input type="number" step="1" id="pse-filter-mp-min" placeholder="${t.filter_min}" value="${detailedFilters.mpMin !== null ? detailedFilters.mpMin : ''}" />
              <span>–</span>
              <input type="number" step="1" id="pse-filter-mp-max" placeholder="${t.filter_max}" value="${detailedFilters.mpMax !== null ? detailedFilters.mpMax : ''}" />
            </div>
          </div>
          <div class="pse-detailed-field">
            <label>${t.boiling_point} (°C)</label>
            <div class="pse-range-inputs">
              <input type="number" step="1" id="pse-filter-bp-min" placeholder="${t.filter_min}" value="${detailedFilters.bpMin !== null ? detailedFilters.bpMin : ''}" />
              <span>–</span>
              <input type="number" step="1" id="pse-filter-bp-max" placeholder="${t.filter_max}" value="${detailedFilters.bpMax !== null ? detailedFilters.bpMax : ''}" />
            </div>
          </div>
          <div class="pse-detailed-field">
            <label>${t.electron_config}</label>
            <input type="text" id="pse-filter-config" placeholder="${t.electron_config_placeholder}" value="${detailedFilters.config || ''}" />
          </div>
          <div class="pse-detailed-field">
            <label>${t.oxidation_states}</label>
            <input type="text" id="pse-filter-ox" placeholder="${t.oxidation_states_placeholder}" value="${detailedFilters.ox || ''}" />
          </div>
        </div>
        <div class="pse-detailed-footer">
          <span class="pse-detailed-count" id="pse-detailed-count"></span>
          <button type="button" class="pse-btn pse-btn-reset-filters" id="pse-btn-reset-filters">${t.reset_filters}</button>
        </div>
      `;
      container.appendChild(detailedPanel);

      // 2. Legend Bar (Categories & State of Matter)
      const legendBar = document.createElement('div');
      legendBar.className = 'pse-legend-bar';

      // Category items
      const catRow = document.createElement('div');
      catRow.className = 'pse-legend-row';
      catRow.innerHTML = `<span class="pse-legend-title">${t.cat_title}</span>`;

      const catItems = document.createElement('div');
      catItems.className = 'pse-legend-items';

      categories.forEach(cat => {
        const pill = document.createElement('span');
        pill.className = `pse-legend-pill ${activeCategory === cat.key ? 'active' : ''}`;
        pill.dataset.cat = cat.key;
        pill.innerHTML = `
          <span class="pse-pill-dot" style="background:${cat.color};"></span>
          <span>${t[cat.labelKey]}</span>
        `;
        pill.addEventListener('click', () => {
          if (activeCategory === cat.key) {
            activeCategory = null;
          } else {
            activeCategory = cat.key;
          }
          const allPills = container.querySelectorAll('.pse-legend-pill[data-cat]');
          allPills.forEach(p => p.classList.toggle('active', p.dataset.cat === activeCategory));
          applyAllFilters();
        });
        catItems.appendChild(pill);
      });
      catRow.appendChild(catItems);

      // State of Matter row
      const stateRow = document.createElement('div');
      stateRow.className = 'pse-legend-row';
      stateRow.innerHTML = `<span class="pse-legend-title">${t.state_title}</span>`;

      const stateItems = document.createElement('div');
      stateItems.className = 'pse-legend-items';

      const states = [
        { key: "solid", label: t.state_solid, dotClass: "pse-state-dot-solid" },
        { key: "liquid", label: t.state_liquid, dotClass: "pse-state-dot-liquid" },
        { key: "gas", label: t.state_gas, dotClass: "pse-state-dot-gas" },
        { key: "synthetic", label: t.state_synthetic, dotClass: "pse-state-dot-synthetic" }
      ];

      states.forEach(st => {
        const pill = document.createElement('span');
        pill.className = 'pse-legend-pill';
        pill.style.cursor = 'default';
        pill.innerHTML = `
          <span class="pse-pill-dot ${st.dotClass}"></span>
          <span>${st.label}</span>
        `;
        stateItems.appendChild(pill);
      });
      stateRow.appendChild(stateItems);

      legendBar.appendChild(catRow);
      legendBar.appendChild(stateRow);
      container.appendChild(legendBar);

      // 3. Grid Viewport & Canvas
      const viewport = document.createElement('div');
      viewport.className = 'pse-viewport';

      const canvas = document.createElement('div');
      canvas.className = 'pse-canvas';
      canvas.id = 'pse-canvas';

      const grid = document.createElement('div');
      grid.className = 'pse-grid';

      // Render Headers
      // Top-Left corner (Row 1, Col 1)
      const corner = document.createElement('div');
      corner.className = 'pse-hdr-col';
      corner.style.gridRow = '1';
      corner.style.gridColumn = '1';
      corner.textContent = '#';
      grid.appendChild(corner);

      // Group Column Headers (Row 1, Cols 2..19 or 2..9)
      const currentGroups = hideDBlock ? mainGroupsInfo : groupsInfo;
      currentGroups.forEach((gInfo, idx) => {
        const colHeader = document.createElement('div');
        colHeader.className = `pse-hdr-col ${gInfo.g >= 3 && gInfo.g <= 12 ? 'pse-hdr-d-block' : ''}`;
        colHeader.style.gridRow = '1';
        colHeader.style.gridColumn = String(2 + idx);
        colHeader.innerHTML = `
          <span>${gInfo.g}</span>
          <span class="sub">${gInfo.roman}</span>
        `;
        colHeader.title = currentLang === 'de' ? gInfo.name_de : gInfo.name_en;
        grid.appendChild(colHeader);
      });

      // Period Row Headers (Rows 2..8, Col 1)
      for (let p = 1; p <= 7; p++) {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'pse-hdr-row';
        rowHeader.style.gridRow = String(1 + p);
        rowHeader.style.gridColumn = '1';
        rowHeader.textContent = String(p);
        grid.appendChild(rowHeader);
      }

      // f-block divider row (Row 9)
      const fGap = document.createElement('div');
      fGap.className = 'pse-f-block-gap';
      fGap.style.gridRow = '9';
      grid.appendChild(fGap);

      // f-block row headers (Row 10 and 11, Col 1..3)
      const lanHeader = document.createElement('div');
      lanHeader.className = 'pse-hdr-row pse-f-block-row';
      lanHeader.style.gridRow = '10';
      lanHeader.style.gridColumn = '1 / span 3';
      lanHeader.style.fontSize = '0.7rem';
      lanHeader.textContent = currentLang === 'de' ? 'Lanthanoide *' : 'Lanthanoids *';
      grid.appendChild(lanHeader);

      const actHeader = document.createElement('div');
      actHeader.className = 'pse-hdr-row pse-f-block-row';
      actHeader.style.gridRow = '11';
      actHeader.style.gridColumn = '1 / span 3';
      actHeader.style.fontSize = '0.7rem';
      actHeader.textContent = currentLang === 'de' ? 'Actinoide **' : 'Actinoids **';
      grid.appendChild(actHeader);

      // Placeholders in Main Table for Lanthanides & Actinides (Period 6 & 7, Col 4)
      if (!hideDBlock) {
        const laPlaceholder = document.createElement('div');
        laPlaceholder.className = 'pse-f-placeholder';
        laPlaceholder.dataset.series = 'lanthanide';
        laPlaceholder.style.gridRow = '7'; // Period 6
        laPlaceholder.style.gridColumn = '4'; // Group 3
        laPlaceholder.innerHTML = `
          <span class="z-range">* 57–71</span>
          <span class="series-name">La–Lu</span>
        `;
        laPlaceholder.title = currentLang === 'de' ? 'Zu den Lanthanoiden springen' : 'View Lanthanoids';
        laPlaceholder.addEventListener('click', () => {
          if (hideFBlock) {
            hideFBlock = false;
            updateContainerClasses();
          }
          const target = document.querySelector('.pse-cell[data-z="57"]');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        grid.appendChild(laPlaceholder);

        const acPlaceholder = document.createElement('div');
        acPlaceholder.className = 'pse-f-placeholder';
        acPlaceholder.dataset.series = 'actinide';
        acPlaceholder.style.gridRow = '8'; // Period 7
        acPlaceholder.style.gridColumn = '4'; // Group 3
        acPlaceholder.innerHTML = `
          <span class="z-range">** 89–103</span>
          <span class="series-name">Ac–Lr</span>
        `;
        acPlaceholder.title = currentLang === 'de' ? 'Zu den Actinoiden springen' : 'View Actinoids';
        acPlaceholder.addEventListener('click', () => {
          if (hideFBlock) {
            hideFBlock = false;
            updateContainerClasses();
          }
          const target = document.querySelector('.pse-cell[data-z="89"]');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        grid.appendChild(acPlaceholder);
      }

      // Render all 118 Element Cells
      data.forEach(el => {
        const coords = getGridCoords(el, hideDBlock);
        const name = currentLang === 'de' ? el.n_de : el.n_en;

        const cell = document.createElement('div');
        let cellClass = `pse-cell`;
        if (coords.isDBlock) cellClass += ` pse-d-block`;
        if (coords.isFBlock) cellClass += ` pse-f-block-row`;

        cell.className = cellClass;
        cell.dataset.z = el.z;
        cell.dataset.sym = el.s.toLowerCase();
        cell.dataset.nameEn = el.n_en.toLowerCase();
        cell.dataset.nameDe = el.n_de.toLowerCase();
        cell.dataset.cat = el.cat;
        cell.dataset.state = el.state;

        cell.style.gridRow = String(coords.row);
        cell.style.gridColumn = String(coords.col);

        // Format melting/boiling
        let mpStr = el.mp !== '-' ? `${el.mp}°` : '-';
        let bpStr = el.bp !== '-' ? `${el.bp}°` : '-';

        cell.innerHTML = `
          <div class="pse-cell-top">
            <span class="pse-mass" title="${t.lbl_mass}: ${el.mass}">${el.mass}</span>
            <span class="pse-en" title="${t.lbl_en_pauling}: ${el.en}">${el.en !== '-' ? el.en : ''}</span>
          </div>
          <div class="pse-cell-mid">
            <span class="pse-z">${el.z}</span>
            <span class="pse-symbol">${el.s}</span>
          </div>
          <div class="pse-cell-bot">
            <span class="pse-name">${name}</span>
            <div class="pse-cell-bot-metrics">
              <span class="pse-mpbp" title="${t.lbl_mp}: ${mpStr} / ${t.lbl_bp}: ${bpStr}">${mpStr}/${bpStr}</span>
              <span class="pse-density" title="${t.lbl_density}: ${el.density}">${el.density.split(' ')[0]}</span>
            </div>
          </div>
        `;

        cell.addEventListener('click', () => openSteckbrief(el.z));
        grid.appendChild(cell);
      });

      canvas.appendChild(grid);
      viewport.appendChild(canvas);
      container.appendChild(viewport);

      // 4. Modal Dialog Overlay
      const modal = document.createElement('div');
      modal.className = 'pse-modal-overlay';
      modal.id = 'pse-modal';
      modal.innerHTML = `
        <div class="pse-modal-card" role="dialog" aria-modal="true">
          <button class="pse-modal-close" id="pse-modal-close" title="${t.close}">✕</button>
          
          <div class="pse-modal-header">
            <div class="pse-modal-symbol-badge" id="modal-symbol-badge">
              <span class="z" id="modal-z"></span>
              <span class="sym" id="modal-sym"></span>
              <span class="mass" id="modal-mass"></span>
            </div>
            <div class="pse-modal-title-wrap">
              <h2 class="pse-modal-title" id="modal-title"></h2>
              <div class="pse-modal-badges">
                <span class="pse-badge" id="modal-badge-cat"></span>
                <span class="pse-badge" id="modal-badge-state"></span>
                <span class="pse-badge" id="modal-badge-block"></span>
              </div>
            </div>
          </div>

          <div class="pse-prop-grid">
            <div class="pse-prop-item">
              <span class="pse-prop-label">${t.lbl_mass}</span>
              <span class="pse-prop-value" id="modal-prop-mass"></span>
            </div>
            <div class="pse-prop-item">
              <span class="pse-prop-label">${t.lbl_en_pauling}</span>
              <span class="pse-prop-value" id="modal-prop-en"></span>
            </div>
            <div class="pse-prop-item">
              <span class="pse-prop-label">${t.lbl_en_ar}</span>
              <span class="pse-prop-value" id="modal-prop-en-ar"></span>
            </div>
            <div class="pse-prop-item">
              <span class="pse-prop-label">${t.lbl_config}</span>
              <span class="pse-prop-value" id="modal-prop-config"></span>
            </div>
            <div class="pse-prop-item">
              <span class="pse-prop-label">${t.lbl_ox}</span>
              <span class="pse-prop-value" id="modal-prop-ox"></span>
            </div>
            <div class="pse-prop-item">
              <span class="pse-prop-label">${t.lbl_mp}</span>
              <span class="pse-prop-value" id="modal-prop-mp"></span>
            </div>
            <div class="pse-prop-item">
              <span class="pse-prop-label">${t.lbl_bp}</span>
              <span class="pse-prop-value" id="modal-prop-bp"></span>
            </div>
            <div class="pse-prop-item">
              <span class="pse-prop-label">${t.lbl_density}</span>
              <span class="pse-prop-value" id="modal-prop-density"></span>
            </div>
            <div class="pse-prop-item">
              <span class="pse-prop-label">${t.lbl_discovery}</span>
              <span class="pse-prop-value" id="modal-prop-year"></span>
            </div>
          </div>

          <div class="pse-modal-desc" id="modal-desc"></div>

          <div class="pse-modal-footer">
            <div class="pse-modal-nav">
              <button class="pse-btn" id="modal-btn-prev">${t.prev}</button>
              <button class="pse-btn" id="modal-btn-next">${t.next}</button>
            </div>
            <a href="#" target="_blank" rel="noopener noreferrer" class="pse-wiki-btn" id="modal-wiki-btn">
              <span>📖</span> <span id="modal-wiki-text">${t.wiki_btn}</span>
            </a>
          </div>
        </div>
      `;
      container.appendChild(modal);

      // Attach Event Handlers
      bindEvents();
      updateContainerClasses();
      checkUrlHash();
    }

    // Toggle container classes based on state
    function updateContainerClasses() {
      if (hideDBlock) {
        container.classList.add('collapse-d-block');
      } else {
        container.classList.remove('collapse-d-block');
      }

      if (hideFBlock) {
        container.classList.add('collapse-f-block');
      } else {
        container.classList.remove('collapse-f-block');
      }

      const dBtn = document.getElementById('pse-btn-dblock');
      if (dBtn) {
        dBtn.classList.toggle('active', !hideDBlock);
      }

      const fBtn = document.getElementById('pse-btn-fblock');
      if (fBtn) {
        fBtn.classList.toggle('active', !hideFBlock);
      }

      applyAllFilters();
    }

    // Helper functions for detailed filtering
    function normalizeConfig(str) {
      if (!str) return '';
      const superscripts = {
        '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5',
        '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁰': '0'
      };
      return str.replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰]/g, ch => superscripts[ch] || ch).toLowerCase().replace(/\s+/g, '');
    }

    function parseDensity(densityStr) {
      if (!densityStr || densityStr === '-') return null;
      const num = parseFloat(densityStr);
      if (isNaN(num)) return null;
      if (densityStr.includes('g/L')) {
        return num / 1000;
      }
      return num;
    }

    function matchOxidationState(oxStr, query) {
      if (!oxStr || oxStr === '-' || !query) return false;
      const q = query.trim();
      const cleanQ = q.replace(/^\+/, '');
      const isNeg = q.startsWith('-');
      const parts = oxStr.split(',').map(s => s.trim());
      return parts.some(part => {
        if (isNeg) {
          return part === q;
        }
        const cleanPart = part.replace(/^\+/, '');
        return cleanPart === cleanQ || part === q;
      });
    }

    // Unified Filtering (Search + Detailed Filters + Categories)
    function applyAllFilters() {
      const q = currentSearchQuery.trim().toLowerCase();
      const hasEn = detailedFilters.enMin !== null || detailedFilters.enMax !== null;
      const hasDensity = detailedFilters.densityMin !== null || detailedFilters.densityMax !== null;
      const hasMp = detailedFilters.mpMin !== null || detailedFilters.mpMax !== null;
      const hasBp = detailedFilters.bpMin !== null || detailedFilters.bpMax !== null;
      const hasConfig = Boolean(detailedFilters.config && detailedFilters.config.trim());
      const hasOx = Boolean(detailedFilters.ox && detailedFilters.ox.trim());
      const hasCategory = Boolean(activeCategory);

      const isFilterActive = Boolean(q || hasEn || hasDensity || hasMp || hasBp || hasConfig || hasOx || hasCategory);

      const normConfigQuery = hasConfig ? normalizeConfig(detailedFilters.config) : '';
      const oxQuery = hasOx ? detailedFilters.ox.trim() : '';

      const cells = container.querySelectorAll('.pse-cell');
      const laPlaceholder = container.querySelector('.pse-f-placeholder[data-series="lanthanide"]');
      const acPlaceholder = container.querySelector('.pse-f-placeholder[data-series="actinide"]');

      if (!isFilterActive) {
        cells.forEach(c => c.classList.remove('dimmed', 'matched'));
        if (laPlaceholder) laPlaceholder.classList.remove('dimmed', 'matched');
        if (acPlaceholder) acPlaceholder.classList.remove('dimmed', 'matched');

        const countEl = document.getElementById('pse-detailed-count');
        if (countEl) countEl.textContent = '';
        return;
      }

      let matchCount = 0;
      let hasLanthanideMatch = false;
      let hasActinideMatch = false;

      data.forEach(el => {
        let isMatch = true;

        // 1. Text Search Query
        if (q) {
          const zStr = String(el.z);
          const sym = el.s.toLowerCase();
          const nameEn = el.n_en.toLowerCase();
          const nameDe = el.n_de.toLowerCase();
          const matchesText = (
            zStr === q ||
            sym === q ||
            sym.startsWith(q) ||
            nameEn.includes(q) ||
            nameDe.includes(q)
          );
          if (!matchesText) isMatch = false;
        }

        // 2. Category
        if (isMatch && hasCategory) {
          if (el.cat !== activeCategory) isMatch = false;
        }

        // 3. Electronegativity (Pauling)
        if (isMatch && hasEn) {
          if (el.en === '-' || !el.en) {
            isMatch = false;
          } else {
            const enVal = parseFloat(el.en);
            if (isNaN(enVal)) {
              isMatch = false;
            } else {
              if (detailedFilters.enMin !== null && enVal < detailedFilters.enMin) isMatch = false;
              if (detailedFilters.enMax !== null && enVal > detailedFilters.enMax) isMatch = false;
            }
          }
        }

        // 4. Density
        if (isMatch && hasDensity) {
          const dVal = parseDensity(el.density);
          if (dVal === null) {
            isMatch = false;
          } else {
            if (detailedFilters.densityMin !== null && dVal < detailedFilters.densityMin) isMatch = false;
            if (detailedFilters.densityMax !== null && dVal > detailedFilters.densityMax) isMatch = false;
          }
        }

        // 5. Melting Point
        if (isMatch && hasMp) {
          if (el.mp === '-' || !el.mp) {
            isMatch = false;
          } else {
            const mpVal = parseFloat(el.mp);
            if (isNaN(mpVal)) {
              isMatch = false;
            } else {
              if (detailedFilters.mpMin !== null && mpVal < detailedFilters.mpMin) isMatch = false;
              if (detailedFilters.mpMax !== null && mpVal > detailedFilters.mpMax) isMatch = false;
            }
          }
        }

        // 6. Boiling Point
        if (isMatch && hasBp) {
          if (el.bp === '-' || !el.bp) {
            isMatch = false;
          } else {
            const bpVal = parseFloat(el.bp);
            if (isNaN(bpVal)) {
              isMatch = false;
            } else {
              if (detailedFilters.bpMin !== null && bpVal < detailedFilters.bpMin) isMatch = false;
              if (detailedFilters.bpMax !== null && bpVal > detailedFilters.bpMax) isMatch = false;
            }
          }
        }

        // 7. Electron Configuration
        if (isMatch && hasConfig) {
          const normElConfig = normalizeConfig(el.config);
          if (!normElConfig.includes(normConfigQuery)) isMatch = false;
        }

        // 8. Oxidation States
        if (isMatch && hasOx) {
          if (!matchOxidationState(el.ox, oxQuery)) isMatch = false;
        }

        // Apply classes to corresponding cell
        const cell = container.querySelector(`.pse-cell[data-z="${el.z}"]`);
        if (cell) {
          if (isMatch) {
            cell.classList.remove('dimmed');
            cell.classList.add('matched');
            matchCount++;
            if (el.cat === 'lanthanide') hasLanthanideMatch = true;
            if (el.cat === 'actinide') hasActinideMatch = true;
          } else {
            cell.classList.add('dimmed');
            cell.classList.remove('matched');
          }
        }
      });

      // Update Placeholders (La-Lu & Ac-Lr):
      // Only highlight if contains a currently hidden match for the search!
      if (laPlaceholder) {
        if (hasLanthanideMatch && hideFBlock) {
          laPlaceholder.classList.add('matched');
          laPlaceholder.classList.remove('dimmed');
        } else {
          laPlaceholder.classList.remove('matched');
          laPlaceholder.classList.add('dimmed');
        }
      }

      if (acPlaceholder) {
        if (hasActinideMatch && hideFBlock) {
          acPlaceholder.classList.add('matched');
          acPlaceholder.classList.remove('dimmed');
        } else {
          acPlaceholder.classList.remove('matched');
          acPlaceholder.classList.add('dimmed');
        }
      }

      // Result count display
      const countEl = document.getElementById('pse-detailed-count');
      if (countEl) {
        const t = i18n[currentLang];
        countEl.textContent = `${matchCount} / 118 ${t.results_count}`;
      }
    }

    // Event Bindings
    function bindEvents() {
      // D-Block Toggle
      const dBtn = document.getElementById('pse-btn-dblock');
      if (dBtn) {
        dBtn.addEventListener('click', () => {
          hideDBlock = !hideDBlock;
          buildPSE();
        });
      }

      // F-Block Toggle
      const fBtn = document.getElementById('pse-btn-fblock');
      if (fBtn) {
        fBtn.addEventListener('click', () => {
          hideFBlock = !hideFBlock;
          updateContainerClasses();
        });
      }

      // Language Switcher
      const langBtn = document.getElementById('pse-btn-lang');
      if (langBtn) {
        langBtn.addEventListener('click', () => {
          currentLang = currentLang === 'en' ? 'de' : 'en';
          container.dataset.lang = currentLang;
          buildPSE();
        });
      }

      // Detailed Search Toggle Button
      const detailedBtn = document.getElementById('pse-btn-detailed-search');
      const detailedPanel = document.getElementById('pse-detailed-panel');
      if (detailedBtn && detailedPanel) {
        detailedBtn.addEventListener('click', () => {
          isDetailedSearchOpen = !isDetailedSearchOpen;
          detailedPanel.style.display = isDetailedSearchOpen ? 'block' : 'none';
          detailedBtn.classList.toggle('active', isDetailedSearchOpen);
        });
      }

      // Detailed Search Input Handlers
      const parseNum = (val) => {
        const trimmed = (val || '').trim();
        if (!trimmed) return null;
        const n = parseFloat(trimmed);
        return isNaN(n) ? null : n;
      };

      const enMinIn = document.getElementById('pse-filter-en-min');
      const enMaxIn = document.getElementById('pse-filter-en-max');
      const dMinIn = document.getElementById('pse-filter-density-min');
      const dMaxIn = document.getElementById('pse-filter-density-max');
      const mpMinIn = document.getElementById('pse-filter-mp-min');
      const mpMaxIn = document.getElementById('pse-filter-mp-max');
      const bpMinIn = document.getElementById('pse-filter-bp-min');
      const bpMaxIn = document.getElementById('pse-filter-bp-max');
      const configIn = document.getElementById('pse-filter-config');
      const oxIn = document.getElementById('pse-filter-ox');
      const resetBtn = document.getElementById('pse-btn-reset-filters');

      const onDetailedChange = () => {
        if (enMinIn) detailedFilters.enMin = parseNum(enMinIn.value);
        if (enMaxIn) detailedFilters.enMax = parseNum(enMaxIn.value);
        if (dMinIn) detailedFilters.densityMin = parseNum(dMinIn.value);
        if (dMaxIn) detailedFilters.densityMax = parseNum(dMaxIn.value);
        if (mpMinIn) detailedFilters.mpMin = parseNum(mpMinIn.value);
        if (mpMaxIn) detailedFilters.mpMax = parseNum(mpMaxIn.value);
        if (bpMinIn) detailedFilters.bpMin = parseNum(bpMinIn.value);
        if (bpMaxIn) detailedFilters.bpMax = parseNum(bpMaxIn.value);
        if (configIn) detailedFilters.config = configIn.value;
        if (oxIn) detailedFilters.ox = oxIn.value;
        applyAllFilters();
      };

      [enMinIn, enMaxIn, dMinIn, dMaxIn, mpMinIn, mpMaxIn, bpMinIn, bpMaxIn, configIn, oxIn].forEach(input => {
        if (input) input.addEventListener('input', onDetailedChange);
      });

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          detailedFilters = {
            enMin: null,
            enMax: null,
            densityMin: null,
            densityMax: null,
            mpMin: null,
            mpMax: null,
            bpMin: null,
            bpMax: null,
            config: '',
            ox: ''
          };
          if (enMinIn) enMinIn.value = '';
          if (enMaxIn) enMaxIn.value = '';
          if (dMinIn) dMinIn.value = '';
          if (dMaxIn) dMaxIn.value = '';
          if (mpMinIn) mpMinIn.value = '';
          if (mpMaxIn) mpMaxIn.value = '';
          if (bpMinIn) bpMinIn.value = '';
          if (bpMaxIn) bpMaxIn.value = '';
          if (configIn) configIn.value = '';
          if (oxIn) oxIn.value = '';
          applyAllFilters();
        });
      }

      // Search Input
      const searchInput = document.getElementById('pse-search-input');
      const searchClear = document.getElementById('pse-search-clear');
      if (searchInput && searchClear) {
        searchInput.addEventListener('input', (e) => {
          currentSearchQuery = e.target.value.trim().toLowerCase();
          searchClear.style.display = currentSearchQuery ? 'block' : 'none';
          applyAllFilters();
        });

        searchClear.addEventListener('click', () => {
          searchInput.value = '';
          currentSearchQuery = '';
          searchClear.style.display = 'none';
          applyAllFilters();
          searchInput.focus();
        });
      }

      // Zoom Controls
      const canvas = document.getElementById('pse-canvas');
      const zoomIn = document.getElementById('pse-zoom-in');
      const zoomOut = document.getElementById('pse-zoom-out');
      const zoomReset = document.getElementById('pse-zoom-reset');

      function updateZoom() {
        if (canvas) {
          canvas.style.transform = `scale(${currentScale})`;
          if (zoomReset) {
            zoomReset.textContent = `${Math.round(currentScale * 100)}%`;
          }
        }
      }

      if (zoomIn) {
        zoomIn.addEventListener('click', () => {
          if (currentScale < 1.4) {
            currentScale = parseFloat((currentScale + 0.1).toFixed(1));
            updateZoom();
          }
        });
      }

      if (zoomOut) {
        zoomOut.addEventListener('click', () => {
          if (currentScale > 0.6) {
            currentScale = parseFloat((currentScale - 0.1).toFixed(1));
            updateZoom();
          }
        });
      }

      if (zoomReset) {
        zoomReset.addEventListener('click', () => {
          currentScale = 1.0;
          updateZoom();
        });
      }

      // Modal Handlers
      const modal = document.getElementById('pse-modal');
      const closeBtn = document.getElementById('pse-modal-close');
      const prevBtn = document.getElementById('modal-btn-prev');
      const nextBtn = document.getElementById('modal-btn-next');

      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }

      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const newZ = currentModalZ > 1 ? currentModalZ - 1 : 118;
          openSteckbrief(newZ);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const newZ = currentModalZ < 118 ? currentModalZ + 1 : 1;
          openSteckbrief(newZ);
        });
      }

      // Keyboard Controls
      window.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('open')) return;

        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowLeft') {
          const newZ = currentModalZ > 1 ? currentModalZ - 1 : 118;
          openSteckbrief(newZ);
        } else if (e.key === 'ArrowRight') {
          const newZ = currentModalZ < 118 ? currentModalZ + 1 : 1;
          openSteckbrief(newZ);
        }
      });
    }

    // Open Steckbrief Modal
    function openSteckbrief(z) {
      const el = elemMap.get(Number(z));
      if (!el) return;

      currentModalZ = el.z;
      const t = i18n[currentLang];
      const modal = document.getElementById('pse-modal');
      if (!modal) return;

      const name = currentLang === 'de' ? el.n_de : el.n_en;
      const desc = currentLang === 'de' ? el.desc_de : el.desc_en;
      const wikiUrl = currentLang === 'de' ? el.wiki_de : el.wiki_en;

      // Badge elements
      const badgeBadge = document.getElementById('modal-symbol-badge');
      badgeBadge.style.borderColor = `var(--pse-cat-${el.cat})`;

      document.getElementById('modal-z').textContent = el.z;
      document.getElementById('modal-sym').textContent = el.s;
      document.getElementById('modal-sym').style.color = `var(--pse-state-${el.state})`;
      document.getElementById('modal-mass').textContent = el.mass;

      document.getElementById('modal-title').textContent = `${name} (${el.s})`;

      // Category badge
      const catKey = categories.find(c => c.key === el.cat)?.labelKey || 'cat_nonmetal';
      document.getElementById('modal-badge-cat').innerHTML = `🏷️ ${t[catKey]}`;
      document.getElementById('modal-badge-cat').style.borderColor = `var(--pse-cat-${el.cat})`;

      // State badge
      const stateName = t[`state_${el.state}`] || el.state;
      document.getElementById('modal-badge-state').innerHTML = `💧 ${stateName}`;

      // Block & Group
      let block = 's';
      if (el.cat === 'lanthanide' || el.cat === 'actinide') block = 'f';
      else if (el.g >= 13) block = 'p';
      else if (el.g >= 3 && el.g <= 12) block = 'd';

      document.getElementById('modal-badge-block').innerHTML = `⚛️ Block ${block.toUpperCase()} • P${el.p} G${el.g}`;

      // Property grid
      document.getElementById('modal-prop-mass').textContent = el.mass;
      document.getElementById('modal-prop-en').textContent = el.en !== '-' ? el.en : '—';
      document.getElementById('modal-prop-en-ar').textContent = el.en_ar !== '-' ? el.en_ar : '—';
      document.getElementById('modal-prop-config').textContent = el.config;
      document.getElementById('modal-prop-ox').textContent = el.ox;
      document.getElementById('modal-prop-mp').textContent = el.mp !== '-' ? `${el.mp} °C` : '—';
      document.getElementById('modal-prop-bp').textContent = el.bp !== '-' ? `${el.bp} °C` : '—';
      document.getElementById('modal-prop-density').textContent = el.density;
      document.getElementById('modal-prop-year').textContent = el.year;

      // Description & Wiki
      document.getElementById('modal-desc').textContent = desc;

      const wikiBtn = document.getElementById('modal-wiki-btn');
      wikiBtn.href = wikiUrl;

      // Update URL hash without scroll jump
      history.replaceState(null, null, `#el-${el.s}`);

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      const modal = document.getElementById('pse-modal');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
      history.replaceState(null, null, window.location.pathname);
    }

    function checkUrlHash() {
      const hash = window.location.hash;
      if (!hash) return;

      if (hash.startsWith('#el-')) {
        const sym = hash.replace('#el-', '').toLowerCase();
        const found = data.find(el => el.s.toLowerCase() === sym);
        if (found) openSteckbrief(found.z);
      } else if (hash.startsWith('#z-')) {
        const z = parseInt(hash.replace('#z-', ''), 10);
        if (z >= 1 && z <= 118) openSteckbrief(z);
      } else {
        const num = parseInt(hash.replace('#', ''), 10);
        if (!isNaN(num) && num >= 1 && num <= 118) openSteckbrief(num);
      }
    }

    // Initial build
    buildPSE();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPSE);
  } else {
    initPSE();
  }
})();
