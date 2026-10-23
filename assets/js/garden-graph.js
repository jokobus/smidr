/**
 * Smidr Hugo Theme - Digital Garden Knowledge Graph
 * Lightweight, high-performance canvas force-directed graph.
 * Fully interactive (drag, hover, click to navigate) and responsive on mobile.
 */

(function () {
  'use strict';

  function initGardenGraph(container) {
    const canvas = container.querySelector('.garden-canvas');
    const dataScript = container.querySelector('.garden-data');
    if (!canvas || !dataScript) return;

    let graphData;
    try {
      graphData = JSON.parse(dataScript.textContent);
      if (typeof graphData === 'string') graphData = JSON.parse(graphData);
      if (typeof graphData.nodes === 'string') graphData.nodes = JSON.parse(graphData.nodes);
      if (typeof graphData.links === 'string') graphData.links = JSON.parse(graphData.links);
    } catch (e) {
      console.warn('Failed to parse garden graph data', e);
      return;
    }

    if (!graphData.nodes || graphData.nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    let width = 600;
    let height = 300;
    const dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      const rect = container.getBoundingClientRect();
      width = Math.max(300, Math.floor(rect.width));
      height = window.innerWidth < 640 ? 250 : 320;
      
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Prepare nodes & links
    const nodes = graphData.nodes.map((n) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      type: n.type || 'post', // 'post', 'tag', 'category'
      x: width / 2 + (Math.random() - 0.5) * (width * 0.7),
      y: height / 2 + (Math.random() - 0.5) * (height * 0.7),
      vx: 0,
      vy: 0,
      radius: n.isCurrent ? 10 : (n.type === 'category' ? 8 : (n.type === 'tag' ? 6 : 7))
    }));

    const nodeMap = new Map();
    nodes.forEach(n => nodeMap.set(n.id, n));

    const links = [];
    (graphData.links || []).forEach(l => {
      const source = nodeMap.get(l.source);
      const target = nodeMap.get(l.target);
      if (source && target) {
        links.push({ source, target });
      }
    });

    let draggedNode = null;
    let hoveredNode = null;

    // Simulation parameters
    const repulsion = nodes.length > 20 ? 350 : 550;
    const springLength = nodes.length > 20 ? 55 : 75;
    const springStrength = 0.04;
    const damping = 0.82;

    function tick() {
      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);
          const force = repulsion / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          n1.vx -= fx;
          n1.vy -= fy;
          n2.vx += fx;
          n2.vy += fy;
        }
      }

      // Spring force on links
      for (const link of links) {
        const dx = link.target.x - link.source.x;
        const dy = link.target.y - link.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const displacement = dist - springLength;
        const force = displacement * springStrength;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        link.source.vx += fx;
        link.source.vy += fy;
        link.target.vx -= fx;
        link.target.vy -= fy;
      }

      // Center gravity & update position
      let totalEnergy = 0;
      for (const node of nodes) {
        if (node === draggedNode) continue;
        node.vx += (width / 2 - node.x) * 0.008;
        node.vy += (height / 2 - node.y) * 0.008;
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;

        // Boundaries
        node.x = Math.max(node.radius + 6, Math.min(width - node.radius - 6, node.x));
        node.y = Math.max(node.radius + 6, Math.min(height - node.radius - 6, node.y));
        totalEnergy += Math.abs(node.vx) + Math.abs(node.vy);
      }
      return totalEnergy;
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const edgeColor = isDark ? 'rgba(0, 240, 255, 0.22)' : 'rgba(2, 132, 199, 0.25)';
      const nodeColorPost = isDark ? '#00f0ff' : '#0284c7';
      const nodeColorTag = isDark ? '#a855f7' : '#7e22ce';
      const nodeColorCat = isDark ? '#10b981' : '#059669';
      const nodeColorCurrent = '#ff007a';

      // Draw links
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = 1.3;
      for (const link of links) {
        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        
        if (node.id === graphData.currentNodeId) {
          ctx.fillStyle = nodeColorCurrent;
          ctx.shadowColor = nodeColorCurrent;
          ctx.shadowBlur = 12;
        } else if (node.type === 'category') {
          ctx.fillStyle = nodeColorCat;
          ctx.shadowColor = nodeColorCat;
          ctx.shadowBlur = 8;
        } else if (node.type === 'tag') {
          ctx.fillStyle = nodeColorTag;
          ctx.shadowColor = nodeColorTag;
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = nodeColorPost;
          ctx.shadowColor = nodeColorPost;
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow

        // Label on hover or for current node or when few nodes
        if (node === hoveredNode || node.id === graphData.currentNodeId || nodes.length <= 12) {
          ctx.font = '11px sans-serif';
          ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';
          ctx.textAlign = 'center';
          ctx.fillText(node.title, node.x, node.y - node.radius - 4);
        }
      }
    }

    let isVisible = true;
    let isRunning = false;
    let animId = null;

    function wakeUp() {
      if (!isRunning && isVisible) {
        isRunning = true;
        loop();
      }
    }

    function loop() {
      if (!isVisible) {
        isRunning = false;
        return;
      }
      const energy = tick();
      render();
      if (draggedNode || energy > 0.05) {
        animId = requestAnimationFrame(loop);
      } else {
        isRunning = false;
      }
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            wakeUp();
          } else {
            isRunning = false;
            if (animId) cancelAnimationFrame(animId);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(container);
    } else {
      wakeUp();
    }

    // Mouse & Touch interaction
    function getMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function findNodeAt(pos) {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dx = pos.x - n.x;
        const dy = pos.y - n.y;
        if (dx * dx + dy * dy <= (n.radius + 6) * (n.radius + 6)) {
          return n;
        }
      }
      return null;
    }

    canvas.addEventListener('mousemove', (e) => {
      const pos = getMousePos(e);
      if (draggedNode) {
        draggedNode.x = pos.x;
        draggedNode.y = pos.y;
        wakeUp();
      } else {
        const prevHovered = hoveredNode;
        hoveredNode = findNodeAt(pos);
        canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
        if (prevHovered !== hoveredNode) {
          render();
        }
      }
    });

    canvas.addEventListener('mousedown', (e) => {
      const pos = getMousePos(e);
      const clicked = findNodeAt(pos);
      if (clicked) {
        draggedNode = clicked;
        wakeUp();
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (draggedNode) {
        if (hoveredNode && hoveredNode.url) {
          window.location.href = hoveredNode.url;
        }
        draggedNode = null;
        wakeUp();
      }
    });

    // Touch support for mobile phones
    canvas.addEventListener('touchstart', (e) => {
      const pos = getMousePos(e);
      const clicked = findNodeAt(pos);
      if (clicked) {
        e.preventDefault();
        draggedNode = clicked;
        hoveredNode = clicked;
        wakeUp();
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (draggedNode) {
        e.preventDefault();
        const pos = getMousePos(e);
        draggedNode.x = pos.x;
        draggedNode.y = pos.y;
        wakeUp();
      }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      if (draggedNode) {
        if (hoveredNode && hoveredNode.url) {
          window.location.href = hoveredNode.url;
        }
        draggedNode = null;
        hoveredNode = null;
        wakeUp();
      }
    });
  }

  function initAll() {
    document.querySelectorAll('.garden-graph-container').forEach(initGardenGraph);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
