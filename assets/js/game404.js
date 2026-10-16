/**
 * Smidr Hugo Theme - Cyber Rover 404 Jump & Run Game
 * Retro cyberpunk mini-game embedded in the 404 error page.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game404-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scoreVal = document.getElementById('game-score-val');
    const highscoreVal = document.getElementById('game-highscore-val');

    const width = 640;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    let highScore = parseInt(localStorage.getItem('smidr_404_highscore') || '0', 10);
    if (highscoreVal) highscoreVal.textContent = highScore;

    let isPlaying = false;
    let isGameOver = false;
    let score = 0;
    let frame = 0;
    let gameSpeed = 4.5;

    // Cyber Rover Player
    const player = {
      x: 60,
      y: height - 50,
      w: 36,
      h: 28,
      vy: 0,
      gravity: 0.65,
      jumpForce: -11.5,
      isGrounded: true,
      jumpsLeft: 2 // allows double jump!
    };

    let obstacles = [];
    let particles = [];
    let stars = [];

    // Background cyber grid stars
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * (height - 60),
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.8 + 0.2
      });
    }

    function resetGame() {
      score = 0;
      frame = 0;
      gameSpeed = 4.5;
      obstacles = [];
      particles = [];
      player.y = height - 50;
      player.vy = 0;
      player.isGrounded = true;
      player.jumpsLeft = 2;
      isGameOver = false;
      isPlaying = true;
      if (scoreVal) scoreVal.textContent = '0';
    }

    function jump() {
      if (!isPlaying) {
        resetGame();
        return;
      }
      if (isGameOver) {
        resetGame();
        return;
      }
      if (player.jumpsLeft > 0) {
        player.vy = player.jumpForce;
        player.isGrounded = false;
        player.jumpsLeft--;
        // Spawn jump thruster particles
        for (let i = 0; i < 6; i++) {
          particles.push({
            x: player.x + 8,
            y: player.y + player.h,
            vx: (Math.random() - 0.5) * 3 - 2,
            vy: Math.random() * 3 + 1,
            size: Math.random() * 3 + 2,
            color: '#00f0ff',
            life: 20
          });
        }
      }
    }

    // Input handlers
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    });

    canvas.addEventListener('click', (e) => {
      e.preventDefault();
      jump();
    });

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      jump();
    }, { passive: false });

    function spawnObstacle() {
      const type = Math.random() > 0.3 ? 'spike' : 'barrier';
      const h = type === 'spike' ? 24 : 38;
      obstacles.push({
        x: width + 20,
        y: height - 25 - h,
        w: 20,
        h: h,
        type: type,
        passed: false
      });
    }

    function update() {
      if (!isPlaying || isGameOver) return;
      frame++;

      // Gradual speed acceleration
      if (frame % 300 === 0 && gameSpeed < 9) {
        gameSpeed += 0.4;
      }

      // Physics
      player.vy += player.gravity;
      player.y += player.vy;

      const groundY = height - 25 - player.h;
      if (player.y >= groundY) {
        player.y = groundY;
        player.vy = 0;
        player.isGrounded = true;
        player.jumpsLeft = 2;
      }

      // Stars
      for (const star of stars) {
        star.x -= star.speed * (gameSpeed * 0.4);
        if (star.x < 0) star.x = width;
      }

      // Obstacle spawning
      const minGap = Math.max(70, Math.floor(130 - gameSpeed * 5));
      if (frame % minGap === 0 && Math.random() > 0.25) {
        spawnObstacle();
      }

      // Update obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;

        // Collision check
        const pad = 4;
        if (
          player.x + pad < obs.x + obs.w &&
          player.x + player.w - pad > obs.x &&
          player.y + pad < obs.y + obs.h &&
          player.y + player.h - pad > obs.y
        ) {
          isGameOver = true;
          if (score > highScore) {
            highScore = score;
            localStorage.setItem('smidr_404_highscore', String(highScore));
            if (highscoreVal) highscoreVal.textContent = highScore;
          }
        }

        // Score increment
        if (!obs.passed && obs.x + obs.w < player.x) {
          obs.passed = true;
          score += 10;
          if (scoreVal) scoreVal.textContent = score;
        }

        if (obs.x < -50) {
          obstacles.splice(i, 1);
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
      }
    }

    function render() {
      // Clear
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, width, height);

      // Stars / Cyber dust
      ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      for (const star of stars) {
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }

      // Ground cyber line
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, height - 25);
      ctx.lineTo(width, height - 25);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Ground grid pattern
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      const gridOffset = (frame * gameSpeed) % 24;
      for (let x = -gridOffset; x < width; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, height - 25);
        ctx.lineTo(x - 20, height);
        ctx.stroke();
      }

      // Draw Obstacles
      for (const obs of obstacles) {
        ctx.fillStyle = obs.type === 'spike' ? '#ff007a' : '#f59e0b';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        if (obs.type === 'spike') {
          ctx.beginPath();
          ctx.moveTo(obs.x + obs.w / 2, obs.y);
          ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
          ctx.lineTo(obs.x, obs.y + obs.h);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
          // Laser core
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(obs.x + 3, obs.y + 4, obs.w - 6, obs.h - 8);
        }
        ctx.shadowBlur = 0;
      }

      // Draw Particles
      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      // Draw Cyber Rover Player
      ctx.save();
      ctx.translate(player.x, player.y);

      // Body (Hexagonal rover pod)
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.fillRect(0, 6, player.w - 6, player.h - 14);

      // Cockpit visor
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(player.w - 14, 8, 8, 8);

      // Rover Wheels / Treads
      ctx.fillStyle = '#334155';
      ctx.fillRect(-2, player.h - 8, player.w - 2, 8);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(2, player.h - 6, 6, 4);
      ctx.fillRect(player.w - 14, player.h - 6, 6, 4);

      // Antenna / Sensor
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(8, 6);
      ctx.lineTo(4, 0);
      ctx.stroke();
      ctx.fillStyle = '#ff007a';
      ctx.beginPath();
      ctx.arc(4, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // UI Overlays
      if (!isPlaying) {
        ctx.fillStyle = 'rgba(6, 9, 17, 0.75)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = 'bold 20px monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.textAlign = 'center';
        ctx.fillText('MISSION 404: CYBER ROVER RUNNER', width / 2, height / 2 - 12);
        ctx.font = '14px monospace';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText('Press SPACE or TAP TO LAUNCH', width / 2, height / 2 + 18);
      } else if (isGameOver) {
        ctx.fillStyle = 'rgba(6, 9, 17, 0.85)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = 'bold 24px monospace';
        ctx.fillStyle = '#ff007a';
        ctx.textAlign = 'center';
        ctx.fillText('SYSTEM OVERHEAT - MISSION TERMINATED', width / 2, height / 2 - 15);
        ctx.font = '14px monospace';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(`Final Score: ${score}  |  Press SPACE or TAP to Reboot`, width / 2, height / 2 + 18);
      }
    }

    function gameLoop() {
      update();
      render();
      requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
  });

})();
