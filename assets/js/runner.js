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

  // Bind code runner components
  document.addEventListener('DOMContentLoaded', () => {
    const runners = document.querySelectorAll('.code-runner-box');

    runners.forEach(runner => {
      const runBtn = runner.querySelector('.runner-btn-run');
      const clearBtn = runner.querySelector('.runner-btn-clear');
      const textarea = runner.querySelector('.runner-textarea');
      const stdoutEl = runner.querySelector('.runner-stdout');
      const stderrEl = runner.querySelector('.runner-stderr');
      const lang = runner.dataset.lang || 'python';

      const copyBtn = runner.querySelector('.runner-btn-copy');

      if (!runBtn || !textarea || !stdoutEl) return;

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

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          stdoutEl.textContent = '';
          if (stderrEl) stderrEl.textContent = '';
        });
      }

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
