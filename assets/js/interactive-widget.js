/**
 * Smidr Hugo Theme - Interactive Widget Controller
 * Pure vanilla JS, CSP-compliant, no inline scripts.
 */
(function () {
  'use strict';

  function initWidgets() {
    const widgets = document.querySelectorAll('.interactive-widget-box');
    if (!widgets.length) return;

    widgets.forEach(root => {
      if (root.dataset.initialized) return;
      root.dataset.initialized = 'true';

      const canvas = root.querySelector('.widget-display-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const sliderKp = root.querySelector('.slider-kp');
      const sliderZeta = root.querySelector('.slider-zeta');
      const sliderWn = root.querySelector('.slider-wn');
      const valKp = root.querySelector('.val-kp');
      const valZeta = root.querySelector('.val-zeta');
      const valWn = root.querySelector('.val-wn');

      let animPhase = 0;
      let animFrameId = null;

      function draw() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const Kp = sliderKp ? parseFloat(sliderKp.value) : 2.5;
        const zeta = sliderZeta ? parseFloat(sliderZeta.value) : 0.45;
        const wn = sliderWn ? parseFloat(sliderWn.value) : 3.0;

        if (valKp) valKp.textContent = Kp.toFixed(1);
        if (valZeta) valZeta.textContent = zeta.toFixed(2);
        if (valWn) valWn.textContent = wn.toFixed(1);

        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = isLight ? '#f1f5f9' : '#0f172a';
        ctx.fillRect(0, 0, width, height);

        // Draw coordinate grid lines
        ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw reference target step line at y = 50
        const targetY = 50;
        ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, targetY);
        ctx.lineTo(width, targetY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label target step
        ctx.fillStyle = isLight ? '#64748b' : '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText('Target Step Ref (1.0)', 10, targetY - 6);

        // Compute simulated 2nd-order step response
        const pts = [];
        const baseZeroY = height - 30;
        const targetAmp = baseZeroY - targetY;
        const wd = wn * Math.sqrt(Math.max(0.001, 1 - zeta * zeta));

        for (let x = 0; x < width; x++) {
          const t = (x / width) * 4.0;
          let yVal = 0;

          if (zeta < 1.0) {
            // Underdamped oscillation
            const env = Math.exp(-zeta * wn * t);
            const osc = Math.cos(wd * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t);
            yVal = 1 - env * osc;
          } else {
            // Overdamped
            yVal = 1 - Math.exp(-wn * t);
          }

          // Apply Kp gain scale with subtle animation pulse
          const pulse = Math.sin(animPhase * 2 + t * 4) * 0.02 * (Kp / 5.0);
          const scaledAmp = (yVal + pulse) * targetAmp;
          pts.push({ x: x, y: baseZeroY - scaledAmp });
        }

        // Draw glow path
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.3)' : 'rgba(0, 240, 255, 0.35)';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Draw main response line
        ctx.strokeStyle = isLight ? '#0284c7' : '#00f0ff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw tracker beacon circle at animated position
        const trackerIdx = Math.floor(((Math.sin(animPhase) + 1) / 2) * (pts.length - 1));
        const beacon = pts[trackerIdx];
        if (beacon) {
          ctx.beginPath();
          ctx.arc(beacon.x, beacon.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = isLight ? '#7e22ce' : '#ff007a';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      function loop() {
        animPhase += 0.025;
        draw();
        animFrameId = requestAnimationFrame(loop);
      }

      [sliderKp, sliderZeta, sliderWn].forEach(slider => {
        if (slider) slider.addEventListener('input', draw);
      });

      loop();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets);
  } else {
    initWidgets();
  }
})();
