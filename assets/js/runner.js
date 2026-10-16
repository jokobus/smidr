/**
 * Smidr Hugo Theme - Client-Side Interactive Code Runners & Playgrounds
 *
 * SAFETY & ARCHITECTURE NOTE:
 * All code execution occurs 100% client-side within the visitor's browser sandbox
 * using WebAssembly (Pyodide) or isolated evaluation. NO code is transmitted to,
 * processed by, or executed on the hosting server (Raspberry Pi / GitHub Pages).
 * The hosting server remains completely immune to remote code injection and computational overload.
 */

(function () {
  'use strict';

  let pyodideInstance = null;
  let isPyodideLoading = false;

  async function initPyodideIfNeeded() {
    if (pyodideInstance) return pyodideInstance;
    if (isPyodideLoading) {
      while (isPyodideLoading) {
        await new Promise(r => setTimeout(r, 100));
      }
      return pyodideInstance;
    }

    isPyodideLoading = true;
    try {
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }
      pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
      });
      return pyodideInstance;
    } finally {
      isPyodideLoading = false;
    }
  }

  // Update line numbers and auto-calculate height
  function updateLines(textarea, lineNumbersEl, isFullscreen) {
    if (!textarea || !lineNumbersEl) return;
    const lines = textarea.value.split('\n').length;
    let numbers = '';
    for (let i = 1; i <= lines; i++) {
      numbers += i + '\n';
    }
    lineNumbersEl.textContent = numbers;

    if (!isFullscreen) {
      // Calculate dynamic spacious vertical height: minimum 220px, up to 500px
      const targetHeight = Math.min(Math.max(lines * 21 + 36, 220), 500);
      textarea.style.height = targetHeight + 'px';
      lineNumbersEl.style.height = targetHeight + 'px';
    } else {
      textarea.style.height = '100%';
      lineNumbersEl.style.height = '100%';
    }
  }

  // Bind code runner components
  document.addEventListener('DOMContentLoaded', () => {
    const runners = document.querySelectorAll('.code-runner-box');

    runners.forEach(runner => {
      const runBtn = runner.querySelector('.runner-btn-run');
      const clearBtn = runner.querySelector('.runner-btn-clear');
      const copyBtn = runner.querySelector('.runner-btn-copy');
      const fullscreenBtn = runner.querySelector('.runner-btn-fullscreen');
      const textarea = runner.querySelector('.runner-textarea');
      const lineNumbersEl = runner.querySelector('.runner-line-numbers');
      const stdoutEl = runner.querySelector('.runner-stdout');
      const stderrEl = runner.querySelector('.runner-stderr');
      const lang = runner.dataset.lang || 'python';

      if (!runBtn || !textarea || !stdoutEl) return;

      // Initialize line numbers and height
      if (lineNumbersEl) {
        updateLines(textarea, lineNumbersEl, false);
        textarea.addEventListener('input', () => {
          updateLines(textarea, lineNumbersEl, runner.classList.contains('is-fullscreen'));
        });
        textarea.addEventListener('scroll', () => {
          lineNumbersEl.scrollTop = textarea.scrollTop;
        });
      }

      // Fullscreen Toggle
      if (fullscreenBtn) {
        const expandIcon = fullscreenBtn.querySelector('.fullscreen-icon-expand');
        const compressIcon = fullscreenBtn.querySelector('.fullscreen-icon-compress');

        const toggleFullscreen = () => {
          const isFs = runner.classList.toggle('is-fullscreen');
          if (isFs) {
            document.body.classList.add('runner-fs-active');
            if (expandIcon) expandIcon.style.display = 'none';
            if (compressIcon) compressIcon.style.display = 'block';
          } else {
            document.body.classList.remove('runner-fs-active');
            if (expandIcon) expandIcon.style.display = 'block';
            if (compressIcon) compressIcon.style.display = 'none';
          }
          if (lineNumbersEl) {
            updateLines(textarea, lineNumbersEl, isFs);
          }
        };

        fullscreenBtn.addEventListener('click', toggleFullscreen);

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && runner.classList.contains('is-fullscreen')) {
            toggleFullscreen();
          }
        });
      }

      // Copy Code
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(textarea.value);
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = `<span>✓</span> <span class="copy-text">Copied!</span>`;
            setTimeout(() => {
              copyBtn.classList.remove('copied');
              copyBtn.innerHTML = `<span>📋</span> <span class="copy-text">Copy</span>`;
            }, 2000);
          } catch (err) {
            console.error('Failed to copy code from sandbox: ', err);
          }
        });
      }

      // Clear Output
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          stdoutEl.textContent = '';
          if (stderrEl) stderrEl.textContent = '';
        });
      }

      // Execute Code
      runBtn.addEventListener('click', async () => {
        const code = textarea.value;
        stdoutEl.textContent = '';
        if (stderrEl) stderrEl.textContent = '';
        
        runBtn.disabled = true;
        const originalBtnText = runBtn.innerHTML;
        runBtn.innerHTML = `<span>⏳</span> <span>Executing...</span>`;

        try {
          if (lang.toLowerCase() === 'python' || lang.toLowerCase() === 'py') {
            stdoutEl.textContent = 'Initializing Pyodide WebAssembly runtime in browser...\n';
            const pyodide = await initPyodideIfNeeded();
            
            // Redirect Python stdout to output element
            pyodide.setStdout({
              batched: (text) => {
                stdoutEl.textContent += text + '\n';
              }
            });
            pyodide.setStderr({
              batched: (errText) => {
                if (stderrEl) stderrEl.textContent += errText + '\n';
              }
            });

            stdoutEl.textContent = ''; // clear init message
            const result = await pyodide.runPythonAsync(code);
            if (result !== undefined && result !== null && !stdoutEl.textContent) {
              stdoutEl.textContent = String(result);
            }
          } else if (lang.toLowerCase() === 'javascript' || lang.toLowerCase() === 'js') {
            // Client-side JS execution with console interception
            let logs = [];
            const customConsole = {
              log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
              error: (...args) => {
                if (stderrEl) stderrEl.textContent += args.join(' ') + '\n';
              },
              warn: (...args) => logs.push('[WARN] ' + args.join(' '))
            };

            const runSandbox = new Function('console', `
              "use strict";
              ${code}
            `);

            runSandbox(customConsole);
            if (logs.length > 0) {
              stdoutEl.textContent = logs.join('\n');
            } else if (!stderrEl.textContent) {
              stdoutEl.textContent = 'Code executed successfully (no console output).';
            }
          } else {
            stdoutEl.textContent = `Execution for '${lang}' is not yet supported in-browser.`;
          }
        } catch (err) {
          if (stderrEl) {
            stderrEl.textContent = String(err);
          } else {
            stdoutEl.textContent = 'Execution Error: ' + String(err);
          }
        } finally {
          runBtn.disabled = false;
          runBtn.innerHTML = originalBtnText;
        }
      });
    });
  });

})();
