/**
 * Smidr Hugo Theme - Digital Garden Knowledge Graph
 * Lightweight, high-performance canvas force-directed graph.
 * Fully interactive (drag, hover, click to navigate).
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
      if (typeof graphData.nodes === 'string') graphData.nodes = JSON.parse(graphData.nodes);
      if (typeof graphData.links === 'string') graphData.links = JSON.parse(graphData.links);
    } catch (e) {
      console.warn('Failed to parse garden graph data', e);
      return;
    }

    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 280;
    
    // Scale for high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Prepare nodes & links
    const nodes = graphData.nodes.map((n, i) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      type: n.type || 'post', // 'post' or 'tag'
      x: width / 2 + (Math.random() - 0.5) * (width * 0.6),
      y: height / 2 + (Math.random() - 0.5) * (height * 0.6),
      vx: 0,
      vy: 0,
      radius: n.type === 'tag' ? 6 : (n.isCurrent ? 9 : 7)
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
    const repulsion = 450;
    const springLength = 65;
    const springStrength = 0.05;
    const damping = 0.85;

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
      for (const node of nodes) {
        if (node === draggedNode) continue;
        node.vx += (width / 2 - node.x) * 0.01;
        node.vy += (height / 2 - node.y) * 0.01;
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;

        // Boundaries
        node.x = Math.max(node.radius + 5, Math.min(width - node.radius - 5, node.x));
        node.y = Math.max(node.radius + 5, Math.min(height - node.radius - 5, node.y));
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const edgeColor = isDark ? 'rgba(0, 240, 255, 0.2)' : 'rgba(2, 132, 199, 0.25)';
      const nodeColorPost = isDark ? '#00f0ff' : '#0284c7';
      const nodeColorTag = isDark ? '#a855f7' : '#7e22ce';
      const nodeColorCurrent = '#ff007a';

      // Draw links
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = 1.2;
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
          ctx.shadowBlur = 10;
        } else if (node.type === 'tag') {
          ctx.fillStyle = nodeColorTag;
          ctx.shadowColor = nodeColorTag;
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = nodeColorPost;
          ctx.shadowColor = nodeColorPost;
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow

        // Label on hover or for current node
        if (node === hoveredNode || node.id === graphData.currentNodeId) {
          ctx.font = '11px sans-serif';
          ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';
          ctx.textAlign = 'center';
          ctx.fillText(node.title, node.x, node.y - node.radius - 4);
        }
      }
    }

    function loop() {
      tick();
      render();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

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
        if (dx * dx + dy * dy <= (n.radius + 4) * (n.radius + 4)) {
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
      } else {
        hoveredNode = findNodeAt(pos);
        canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
      }
    });

    canvas.addEventListener('mousedown', (e) => {
      const pos = getMousePos(e);
      const clicked = findNodeAt(pos);
      if (clicked) {
        draggedNode = clicked;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (draggedNode) {
        // If it was a quick click without much drag, navigate
        if (hoveredNode && hoveredNode.url) {
          window.location.href = hoveredNode.url;
        }
        draggedNode = null;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.garden-graph-container').forEach(initGardenGraph);
  });

})();
