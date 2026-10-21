/**
 * Smidr Hugo Theme - Cyber Rover 404 Jump & Run Game
 * Retro cyberpunk & sci-fi arcade mini-game embedded in the 404 error page.
 * Enhanced with adaptive light/dark mode, collectibles, rocket propulsion,
 * terrain chasms, and rare background easter egg encounters (~every 200 pts).
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game404-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scoreVal = document.getElementById('game-score-val');
    const coinsVal = document.getElementById('game-coins-val');
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
    let coins = 0;
    let frame = 0;
    let baseGameSpeed = 4.2;
    let gameSpeed = 4.2;

    // Rocket thruster / Düsenantrieb state
    let rocketFuel = 0;
    const MAX_ROCKET_FUEL = 300;

    // Rare Gem Easter Eggs (every ~200 points)
    let nextGemScore = 200;
    let activeGem = null;

    // Floating text popups ("+25", "ROCKET!", etc.)
    let popups = [];

    // Screen toast / notification banner
    let toast = { text: '', life: 0 };

    // Cyber Rover Player
    const player = {
      x: 60,
      y: height - 52,
      w: 38,
      h: 26,
      vy: 0,
      gravity: 0.65,
      jumpForce: -11.5,
      isGrounded: true,
      jumpsLeft: 2
    };

    let obstacles = [];
    let coinItems = [];
    let powerups = [];
    let particles = [];
    let stars = [];

    // Background cosmic stars for dark mode
    for (let i = 0; i < 45; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * (height - 65),
        size: Math.random() * 2 + 0.6,
        speed: Math.random() * 0.7 + 0.2,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    function showToast(text, duration = 120) {
      toast.text = text;
      toast.life = duration;
    }

    function addPopup(text, x, y, color = '#fcd34d') {
      popups.push({
        text,
        x,
        y,
        color,
        life: 45,
        maxLife: 45
      });
    }

    function resetGame() {
      score = 0;
      coins = 0;
      frame = 0;
      baseGameSpeed = 4.2;
      gameSpeed = 4.2;
      rocketFuel = 0;
      nextGemScore = 200;
      activeGem = null;
      obstacles = [];
      coinItems = [];
      powerups = [];
      particles = [];
      popups = [];
      player.y = height - 25 - player.h;
      player.vy = 0;
      player.isGrounded = true;
      player.jumpsLeft = 2;
      isGameOver = false;
      isPlaying = true;
      if (scoreVal) scoreVal.textContent = '0';
      if (coinsVal) coinsVal.textContent = '0';
    }

    function jump() {
      if (!isPlaying || isGameOver) {
        resetGame();
        return;
      }

      // If rocket boost is active, jumping gives a gentle upward boost
      if (rocketFuel > 0) {
        player.vy = -3.5;
        return;
      }

      if (player.jumpsLeft > 0) {
        player.vy = player.jumpForce;
        player.isGrounded = false;
        player.jumpsLeft--;

        // Thruster sparks
        for (let i = 0; i < 7; i++) {
          particles.push({
            x: player.x + 8,
            y: player.y + player.h,
            vx: (Math.random() - 0.5) * 4 - 2,
            vy: Math.random() * 3 + 1.5,
            size: Math.random() * 3 + 2,
            color: player.jumpsLeft === 0 ? '#ff007a' : '#00f0ff',
            life: 22
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

    // Obstacle spawner (Spikes, Barriers, Crevasses/Gruben, Drones)
    function spawnObstacle() {
      const roll = Math.random();
      const groundY = height - 25;

      if (roll < 0.38) {
        // Ground Spikes
        obstacles.push({
          x: width + 20,
          y: groundY - 24,
          w: 22,
          h: 24,
          type: 'spike',
          passed: false
        });
      } else if (roll < 0.65) {
        // Cyber Barrier Pylon
        obstacles.push({
          x: width + 20,
          y: groundY - 38,
          w: 20,
          h: 38,
          type: 'barrier',
          passed: false
        });
      } else if (roll < 0.85) {
        // Terrain Crevasse / Grube (chasm in the ground)
        obstacles.push({
          x: width + 20,
          y: groundY,
          w: 58,
          h: 25,
          type: 'pit',
          passed: false
        });
      } else {
        // Floating Hover Drone
        obstacles.push({
          x: width + 20,
          y: groundY - 55,
          w: 26,
          h: 20,
          type: 'drone',
          passed: false
        });
      }
    }

    // Spawn collectible coins
    function spawnCoins() {
      const groundY = height - 25;
      const roll = Math.random();
      const startX = width + 20;

      if (rocketFuel > 0 || roll < 0.3) {
        // Sky cluster (perfect for rocket flight!)
        for (let i = 0; i < 3; i++) {
          coinItems.push({
            x: startX + i * 28,
            y: 45 + Math.sin(i) * 12,
            w: 16,
            h: 16,
            collected: false
          });
        }
      } else if (roll < 0.7) {
        // Arc formation (jump arch)
        for (let i = 0; i < 3; i++) {
          coinItems.push({
            x: startX + i * 26,
            y: groundY - 45 - Math.sin((i / 2) * Math.PI) * 22,
            w: 16,
            h: 16,
            collected: false
          });
        }
      } else {
        // Ground-level coin
        coinItems.push({
          x: startX,
          y: groundY - 24,
          w: 16,
          h: 16,
          collected: false
        });
      }
    }

    // Spawn Rocket Thruster Power-up
    function spawnPowerup() {
      if (rocketFuel > 0) return; // don't spawn if already blasting
      const groundY = height - 25;
      powerups.push({
        x: width + 20,
        y: groundY - 48,
        w: 24,
        h: 24,
        type: 'rocket',
        bobOffset: Math.random() * Math.PI,
        collected: false
      });
    }

    // Trigger rare gem easter eggs (~every 200 points)
    function triggerRareGem() {
      const types = ['alien_ufo', 'neil_armstrong', 'death_star', 'x_fighter'];
      const chosen = types[Math.floor(Math.random() * types.length)];

      if (chosen === 'alien_ufo') {
        activeGem = {
          type: 'alien_ufo',
          x: width + 60,
          y: 42,
          speed: 2.2,
          beamAngle: 0
        };
        showToast('🛸 Rare Gem: Alien Explorer UFO!');
      } else if (chosen === 'neil_armstrong') {
        activeGem = {
          type: 'neil_armstrong',
          x: width + 50,
          y: height - 25 - 34,
          speed: gameSpeed, // moves with terrain
          waveHand: 0
        };
        showToast('👨‍🚀 Rare Gem: Apollo 11 & American Flag!');
      } else if (chosen === 'death_star') {
        activeGem = {
          type: 'death_star',
          x: width + 70,
          y: 52,
          speed: 0.6,
          radius: 30
        };
        showToast("🌌 Rare Gem: That's no moon... Death Star!");
      } else if (chosen === 'x_fighter') {
        activeGem = {
          type: 'x_fighter',
          x: -80,
          y: 35,
          speed: 7.5
        };
        showToast('🚀 Rare Gem: X-Wing Starfighter Zoom!');
      }
    }

    function triggerGameOver() {
      isGameOver = true;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('smidr_404_highscore', String(highScore));
        if (highscoreVal) highscoreVal.textContent = highScore;
      }
      // Overheat explosion particles
      for (let i = 0; i < 28; i++) {
        particles.push({
          x: player.x + player.w / 2,
          y: player.y + player.h / 2,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          size: Math.random() * 4 + 2,
          color: ['#ff007a', '#f59e0b', '#00f0ff', '#ef4444'][Math.floor(Math.random() * 4)],
          life: 40
        });
      }
    }

    function update() {
      if (!isPlaying || isGameOver) return;
      frame++;

      // Gradual base speed acceleration
      if (frame % 300 === 0 && baseGameSpeed < 8.5) {
        baseGameSpeed += 0.35;
      }

      // Rocket boost speed bonus
      gameSpeed = rocketFuel > 0 ? baseGameSpeed + 2.0 : baseGameSpeed;

      // Rocket flight physics & fuel depletion
      if (rocketFuel > 0) {
        rocketFuel--;
        // Fly along ceiling
        const targetCeilingY = 28;
        player.y += (targetCeilingY - player.y) * 0.12;
        player.vy = 0;
        player.isGrounded = false;
        player.jumpsLeft = 2;

        // Exhaust flame particles behind rover
        if (frame % 2 === 0) {
          particles.push({
            x: player.x - 4,
            y: player.y + 14 + (Math.random() - 0.5) * 6,
            vx: -Math.random() * 6 - 4,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 4 + 2,
            color: ['#00f0ff', '#f59e0b', '#ff007a', '#ffffff'][Math.floor(Math.random() * 4)],
            life: 25
          });
        }
      } else {
        // Normal ground physics
        player.vy += player.gravity;
        player.y += player.vy;

        const groundY = height - 25 - player.h;
        if (player.y >= groundY) {
          player.y = groundY;
          player.vy = 0;
          player.isGrounded = true;
          player.jumpsLeft = 2;
        }
      }

      // Stars parallax
      for (const star of stars) {
        star.x -= star.speed * (gameSpeed * 0.35);
        if (star.x < 0) star.x = width;
      }

      // Rare Gem check (~every 200 points)
      if (score >= nextGemScore && !activeGem) {
        triggerRareGem();
        nextGemScore += 200;
      }

      // Update Active Gem
      if (activeGem) {
        if (activeGem.type === 'x_fighter') {
          activeGem.x += activeGem.speed;
          if (activeGem.x > width + 100) activeGem = null;
        } else {
          activeGem.x -= activeGem.speed;
          if (activeGem.x < -120) activeGem = null;
        }
      }

      // Spawn items & obstacles
      const minGap = Math.max(70, Math.floor(135 - gameSpeed * 5));
      if (frame % minGap === 0 && Math.random() > 0.22) {
        spawnObstacle();
      }

      if (frame % 140 === 0 && Math.random() > 0.3) {
        spawnCoins();
      }

      if (frame % 460 === 0 && Math.random() > 0.25) {
        spawnPowerup();
      }

      // Update Power-ups
      for (let i = powerups.length - 1; i >= 0; i--) {
        const pup = powerups[i];
        pup.x -= gameSpeed;

        // Collision with player
        if (
          !pup.collected &&
          player.x < pup.x + pup.w &&
          player.x + player.w > pup.x &&
          player.y < pup.y + pup.h &&
          player.y + player.h > pup.y
        ) {
          pup.collected = true;
          rocketFuel = MAX_ROCKET_FUEL;
          score += 50;
          if (scoreVal) scoreVal.textContent = score;
          addPopup('🚀 DÜSENANTRIEB!', pup.x, pup.y - 10, '#00f0ff');
          showToast('🚀 DÜSENANTRIEB AKTIV! FLY ALONG THE CEILING!');
          // Burst sparks
          for (let k = 0; k < 15; k++) {
            particles.push({
              x: pup.x + pup.w / 2,
              y: pup.y + pup.h / 2,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              size: Math.random() * 3 + 2,
              color: '#00f0ff',
              life: 30
            });
          }
          powerups.splice(i, 1);
          continue;
        }

        if (pup.x < -40) {
          powerups.splice(i, 1);
        }
      }

      // Update Coins
      for (let i = coinItems.length - 1; i >= 0; i--) {
        const coin = coinItems[i];
        coin.x -= gameSpeed;

        // Collision check
        if (
          !coin.collected &&
          player.x < coin.x + coin.w &&
          player.x + player.w > coin.x &&
          player.y < coin.y + coin.h &&
          player.y + player.h > coin.y
        ) {
          coin.collected = true;
          coins++;
          score += 25;
          if (coinsVal) coinsVal.textContent = coins;
          if (scoreVal) scoreVal.textContent = score;
          addPopup('+25', coin.x, coin.y, '#fcd34d');

          // Coin pickup glitters
          for (let k = 0; k < 6; k++) {
            particles.push({
              x: coin.x + 8,
              y: coin.y + 8,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3 - 1,
              size: Math.random() * 2 + 1.5,
              color: '#fcd34d',
              life: 18
            });
          }
          coinItems.splice(i, 1);
          continue;
        }

        if (coin.x < -30) {
          coinItems.splice(i, 1);
        }
      }

      // Update Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;

        // Collision checks
        if (obs.type === 'pit') {
          // Crevasse / Pit hazard
          // If player's wheels cross the chasm while on or near the ground (not flying high above)
          const roverCenterX = player.x + player.w * 0.5;
          const groundY = height - 25 - player.h;
          if (
            roverCenterX > obs.x + 4 &&
            roverCenterX < obs.x + obs.w - 4 &&
            player.y >= groundY - 2 &&
            rocketFuel <= 0
          ) {
            // Falls into pit!
            player.y += 12;
            triggerGameOver();
          }
        } else {
          // Standard bounding box collision
          const pad = 5;
          if (
            player.x + pad < obs.x + obs.w &&
            player.x + player.w - pad > obs.x &&
            player.y + pad < obs.y + obs.h &&
            player.y + player.h - pad > obs.y
          ) {
            triggerGameOver();
          }
        }

        // Score increment when safely passed
        if (!obs.passed && obs.x + obs.w < player.x) {
          obs.passed = true;
          score += 10;
          if (scoreVal) scoreVal.textContent = score;
        }

        if (obs.x < -80) {
          obstacles.splice(i, 1);
        }
      }

      // Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // Update Popups
      for (let i = popups.length - 1; i >= 0; i--) {
        const pop = popups[i];
        pop.y -= 0.8;
        pop.life--;
        if (pop.life <= 0) popups.splice(i, 1);
      }

      // Update Toast
      if (toast.life > 0) {
        toast.life--;
      }
    }

    // =========================================================================
    // RENDER FUNCTIONS
    // =========================================================================

    function drawSun(isLight) {
      if (!isLight) return;

      const sunX = width - 85;
      const sunY = 52;
      const pulse = Math.sin(frame * 0.04) * 3;

      // Radiant outer sun aura / flare
      const auraGrad = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 58 + pulse);
      auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      auraGrad.addColorStop(0.25, 'rgba(254, 240, 138, 0.7)');
      auraGrad.addColorStop(0.65, 'rgba(251, 191, 36, 0.25)');
      auraGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 58 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Sun core
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 16, 0, Math.PI * 2);
      ctx.fill();

      // Rotating sun rays
      ctx.save();
      ctx.translate(sunX, sunY);
      ctx.rotate(frame * 0.006);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 2;
      for (let r = 0; r < 8; r++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(22, 0);
        ctx.lineTo(36 + (r % 2 === 0 ? 8 : 0), 0);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawRareGem(gem, isLight) {
      if (!gem) return;

      ctx.save();
      if (gem.type === 'alien_ufo') {
        // Alien UFO with Tractor Beam
        const ufoX = gem.x;
        const ufoY = gem.y + Math.sin(frame * 0.08) * 4;

        // Translucent green tractor beam
        const beamGrad = ctx.createLinearGradient(ufoX, ufoY + 8, ufoX, height - 25);
        beamGrad.addColorStop(0, 'rgba(74, 222, 128, 0.35)');
        beamGrad.addColorStop(1, 'rgba(74, 222, 128, 0.02)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(ufoX - 8, ufoY + 8);
        ctx.lineTo(ufoX + 8, ufoY + 8);
        ctx.lineTo(ufoX + 32, height - 25);
        ctx.lineTo(ufoX - 32, height - 25);
        ctx.closePath();
        ctx.fill();

        // Saucer Dome & Alien
        ctx.fillStyle = 'rgba(103, 232, 249, 0.85)';
        ctx.beginPath();
        ctx.arc(ufoX, ufoY - 2, 9, Math.PI, 0);
        ctx.fill();

        // Little alien head
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(ufoX, ufoY - 4, 4, 0, Math.PI * 2);
        ctx.fill();
        // Alien eye
        ctx.fillStyle = '#052e16';
        ctx.fillRect(ufoX - 2, ufoY - 5, 1.5, 2);
        ctx.fillRect(ufoX + 1, ufoY - 5, 1.5, 2);

        // Saucer Metal Hull
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.ellipse(ufoX, ufoY + 4, 22, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing rim lights
        const rimColor = frame % 10 < 5 ? '#facc15' : '#00f0ff';
        ctx.fillStyle = rimColor;
        for (let lx = -14; lx <= 14; lx += 7) {
          ctx.beginPath();
          ctx.arc(ufoX + lx, ufoY + 5, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (gem.type === 'neil_armstrong') {
        // Neil Armstrong on lunar/martian surface with American Flag
        const ax = gem.x;
        const ay = gem.y;

        // Surface mound / crater ridge
        ctx.fillStyle = isLight ? '#fcd34d' : '#1e293b';
        ctx.beginPath();
        ctx.ellipse(ax + 10, height - 25, 45, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Astronaut in White Apollo Suit
        ctx.fillStyle = '#f8fafc';
        // Torso
        ctx.fillRect(ax - 5, ay + 10, 10, 14);
        // Legs
        ctx.fillRect(ax - 5, ay + 24, 4, 10);
        ctx.fillRect(ax + 1, ay + 24, 4, 10);
        // Backpack Life Support (PLSS)
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(ax - 8, ay + 11, 3, 11);
        // Helmet
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(ax, ay + 6, 6, 0, Math.PI * 2);
        ctx.fill();
        // Gold reflective visor
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(ax + 2, ay + 6, 3.5, -Math.PI / 2, Math.PI / 2);
        ctx.fill();
        // Arm waving/saluting
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ax + 3, ay + 12);
        ctx.lineTo(ax + 9, ay + 6 + Math.sin(frame * 0.1) * 2);
        ctx.stroke();

        // American Flag (Flagpole + Stars & Stripes)
        const fx = ax + 20;
        const fy = ay - 4;
        // Silver flagpole
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx, height - 25);
        ctx.stroke();
        // Gold pole finial
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(fx, fy - 1, 2, 0, Math.PI * 2);
        ctx.fill();

        // Fluttering flag cloth
        const flagW = 22;
        const flagH = 14;
        const wave = Math.sin(frame * 0.15) * 2;

        // Red and White stripes
        for (let s = 0; s < 5; s++) {
          ctx.fillStyle = s % 2 === 0 ? '#ef4444' : '#ffffff';
          ctx.fillRect(fx + 1, fy + s * (flagH / 5) + (s * wave * 0.2), flagW, flagH / 5);
        }
        // Blue Canton with stars
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(fx + 1, fy, flagW * 0.45, flagH * 0.55);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(fx + 3, fy + 2, 1.5, 1.5);
        ctx.fillRect(fx + 6, fy + 4, 1.5, 1.5);
      } else if (gem.type === 'death_star') {
        // The Death Star (Todesstern)
        const dsX = gem.x;
        const dsY = gem.y;
        const r = gem.radius;

        // Sphere body
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(dsX, dsY, r, 0, Math.PI * 2);
        ctx.fill();

        // Equatorial trench line
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(dsX, dsY, r, -0.1, Math.PI + 0.1, true);
        ctx.stroke();

        // Superlaser concave crater dish
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(dsX - 8, dsY - 9, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Superlaser green focus charge
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(dsX - 8, dsY - 9, 2, 0, Math.PI * 2);
        ctx.fill();

        // Subtle shaded surface panels
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(dsX - 18, dsY + 4, 12, 8);
        ctx.strokeRect(dsX + 2, dsY - 18, 10, 8);
      } else if (gem.type === 'x_fighter') {
        // Incom T-65 X-Wing Starfighter
        const xx = gem.x;
        const xy = gem.y;

        // Quad red ion engine exhaust trails
        ctx.strokeStyle = '#ff007a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xx - 45, xy - 6);
        ctx.lineTo(xx - 12, xy - 6);
        ctx.moveTo(xx - 45, xy + 6);
        ctx.lineTo(xx - 12, xy + 6);
        ctx.stroke();

        // S-Foils (attack position wings)
        ctx.fillStyle = '#cbd5e1';
        // Upper wing
        ctx.beginPath();
        ctx.moveTo(xx - 12, xy - 3);
        ctx.lineTo(xx + 10, xy - 14);
        ctx.lineTo(xx - 2, xy - 14);
        ctx.closePath();
        ctx.fill();
        // Lower wing
        ctx.beginPath();
        ctx.moveTo(xx - 12, xy + 3);
        ctx.lineTo(xx + 10, xy + 14);
        ctx.lineTo(xx - 2, xy + 14);
        ctx.closePath();
        ctx.fill();

        // Wingtip laser cannons
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(xx + 10, xy - 15, 10, 2);
        ctx.strokeRect(xx + 10, xy + 13, 10, 2);

        // Fuselage & Cockpit
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(xx + 24, xy);
        ctx.lineTo(xx - 14, xy - 4);
        ctx.lineTo(xx - 14, xy + 4);
        ctx.closePath();
        ctx.fill();

        // Red markings (Red 5)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(xx + 2, xy - 2, 4, 4);

        // Cockpit canopy
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(xx + 8, xy - 2, 6, 4);
      }
      ctx.restore();
    }

    function render() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      // 1. Sky & Horizon Gradient
      if (isLight) {
        // Daytime desert/martian sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#7dd3fc'); // radiant sky blue
        skyGrad.addColorStop(0.45, '#bae6fd');
        skyGrad.addColorStop(0.85, '#fef08a'); // sunny warm horizon
        skyGrad.addColorStop(1, '#fde68a'); // golden sand glow
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Radiant Sun
        drawSun(isLight);

        // Distant warm mountain dunes
        ctx.fillStyle = 'rgba(251, 146, 60, 0.15)';
        ctx.beginPath();
        ctx.moveTo(0, height - 25);
        ctx.quadraticCurveTo(width * 0.25, height - 75, width * 0.5, height - 45);
        ctx.quadraticCurveTo(width * 0.75, height - 85, width, height - 25);
        ctx.fill();
      } else {
        // Deep space cyberpunk cosmos
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#050813');
        skyGrad.addColorStop(0.65, '#0c162d');
        skyGrad.addColorStop(1, '#111e3f');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Stars / Cyber dust
        for (const star of stars) {
          const alpha = 0.35 + Math.sin(frame * 0.05 + star.twinkle) * 0.25;
          ctx.fillStyle = `rgba(0, 240, 255, ${Math.max(0.1, alpha)})`;
          ctx.fillRect(star.x, star.y, star.size, star.size);
        }

        // Distant cyber mountain silhouettes
        ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
        ctx.beginPath();
        ctx.moveTo(0, height - 25);
        ctx.lineTo(width * 0.2, height - 60);
        ctx.lineTo(width * 0.45, height - 40);
        ctx.lineTo(width * 0.75, height - 70);
        ctx.lineTo(width, height - 25);
        ctx.fill();
      }

      // 2. Rare Gem Background Encounter
      drawRareGem(activeGem, isLight);

      // 3. Ground & Chasms / Crevasses (Gruben)
      const groundY = height - 25;

      // Find all active pits to omit ground line over them
      const pits = obstacles.filter((o) => o.type === 'pit');

      // Sort pits by X
      pits.sort((a, b) => a.x - b.x);

      // Draw ground segments avoiding pits
      let curX = 0;
      for (const pit of pits) {
        const pitLeft = Math.max(0, pit.x);
        const pitRight = Math.min(width, pit.x + pit.w);

        if (pitLeft > curX) {
          drawGroundSegment(curX, pitLeft, groundY, isLight);
        }

        // Draw the Chasm / Grube itself!
        drawPit(pitLeft, pitRight, groundY, isLight);
        curX = Math.max(curX, pitRight);
      }
      if (curX < width) {
        drawGroundSegment(curX, width, groundY, isLight);
      }

      // 4. Draw Obstacles (Spikes, Barriers, Drones)
      for (const obs of obstacles) {
        if (obs.type === 'pit') continue; // already drawn in ground layer

        if (obs.type === 'spike') {
          // Sharp ground spikes
          ctx.fillStyle = isLight ? '#dc2626' : '#ff007a';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(obs.x + obs.w / 2, obs.y);
          ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
          ctx.lineTo(obs.x, obs.y + obs.h);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (obs.type === 'barrier') {
          // Cyber Pylon Barrier
          ctx.fillStyle = isLight ? '#d97706' : '#f59e0b';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 8;
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
          // High-energy laser core
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(obs.x + 4, obs.y + 4, obs.w - 8, obs.h - 8);
          ctx.shadowBlur = 0;
        } else if (obs.type === 'drone') {
          // Hover Drone / Floating Space Mine
          const droneY = obs.y + Math.sin(frame * 0.1) * 3;
          ctx.fillStyle = isLight ? '#475569' : '#0284c7';
          ctx.beginPath();
          ctx.arc(obs.x + obs.w / 2, droneY + obs.h / 2, obs.w / 2, 0, Math.PI * 2);
          ctx.fill();

          // Blinking sensor eye
          ctx.fillStyle = frame % 16 < 8 ? '#ef4444' : '#ff007a';
          ctx.beginPath();
          ctx.arc(obs.x + obs.w / 2, droneY + obs.h / 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Draw Collectibles: Coins (Münzen)
      for (const coin of coinItems) {
        if (coin.collected) continue;
        const spinW = Math.max(2, Math.abs(Math.cos(frame * 0.12)) * (coin.w / 2));
        ctx.save();
        ctx.translate(coin.x + coin.w / 2, coin.y + coin.h / 2);

        // Gold coin outer
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#fcd34d';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(0, 0, spinW, coin.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner golden rim
        if (spinW > 3) {
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, spinW - 2, coin.h / 2 - 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 6. Draw Collectibles: Rocket Thruster Power-up
      for (const pup of powerups) {
        if (pup.collected) continue;
        const py = pup.y + Math.sin(frame * 0.1 + pup.bobOffset) * 4;

        ctx.save();
        ctx.translate(pup.x + pup.w / 2, py + pup.h / 2);

        // Glowing powerup capsule
        ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Rocket Icon
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚀', 0, 0);

        ctx.restore();
      }

      // 7. Draw Particles
      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      // 8. Draw Player: Cyber Rover
      drawRover(player, isLight, rocketFuel > 0);

      // 9. Floating Text Popups ("+25", "ROCKET!")
      for (const pop of popups) {
        const alpha = pop.life / pop.maxLife;
        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = pop.color;
        ctx.globalAlpha = alpha;
        ctx.textAlign = 'center';
        ctx.fillText(pop.text, pop.x, pop.y);
        ctx.globalAlpha = 1.0;
      }

      // 10. Rocket Boost Fuel Gauge (HUD on canvas when active)
      if (rocketFuel > 0) {
        const gaugeW = 120;
        const gaugeH = 7;
        const gx = width / 2 - gaugeW / 2;
        const gy = 14;

        // Background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillRect(gx - 2, gy - 2, gaugeW + 4, gaugeH + 4);

        // Fuel fill
        const fuelRatio = rocketFuel / MAX_ROCKET_FUEL;
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(gx, gy, gaugeW * fuelRatio, gaugeH);

        // Label
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = isLight ? '#0369a1' : '#00f0ff';
        ctx.textAlign = 'center';
        ctx.fillText(`🚀 DÜSENANTRIEB: ${Math.ceil((rocketFuel / 60) * 10) / 10}s`, width / 2, gy - 4);
      }

      // 11. Screen Toast Banner (Gems / Power-up alerts)
      if (toast.life > 0) {
        ctx.save();
        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = isLight ? '#0284c7' : '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 8;
        const toastW = 340;
        const toastH = 26;
        ctx.beginPath();
        ctx.roundRect(width / 2 - toastW / 2, height - 58, toastW, toastH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(toast.text, width / 2, height - 45);
        ctx.restore();
      }

      // 12. Mission Start & Game Over Overlays
      if (!isPlaying) {
        drawOverlay(
          isLight,
          'MISSION 404: CYBER ROVER RUNNER',
          isLight ? '#0369a1' : '#00f0ff',
          'Press SPACE or TAP TO LAUNCH',
          isLight ? '#334155' : '#f1f5f9'
        );
      } else if (isGameOver) {
        drawOverlay(
          isLight,
          'SYSTEM OVERHEAT - MISSION TERMINATED',
          isLight ? '#dc2626' : '#ff007a',
          `Score: ${score}  |  Coins: ${coins}  |  Press SPACE or TAP to Reboot`,
          isLight ? '#1e293b' : '#f1f5f9'
        );
      }
    }

    // Helper: Draw ground segment
    function drawGroundSegment(startX, endX, groundY, isLight) {
      if (startX >= endX) return;

      // Ground solid fill
      ctx.fillStyle = isLight ? '#fde68a' : '#070c18';
      ctx.fillRect(startX, groundY, endX - startX, height - groundY);

      // Ground top laser line
      ctx.strokeStyle = isLight ? '#d97706' : '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = isLight ? 2 : 8;
      ctx.beginPath();
      ctx.moveTo(startX, groundY);
      ctx.lineTo(endX, groundY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Ground perspective grid pattern
      ctx.strokeStyle = isLight ? 'rgba(180, 83, 9, 0.22)' : 'rgba(0, 240, 255, 0.16)';
      ctx.lineWidth = 1;
      const gridOffset = (frame * gameSpeed) % 24;
      for (let gx = -gridOffset; gx < width + 24; gx += 24) {
        if (gx >= startX - 24 && gx <= endX) {
          ctx.beginPath();
          ctx.moveTo(Math.max(startX, gx), groundY);
          ctx.lineTo(Math.max(startX, gx - 18), height);
          ctx.stroke();
        }
      }
    }

    // Helper: Draw Chasm / Pit (Grube)
    function drawPit(leftX, rightX, groundY, isLight) {
      // Bottomless dark abyss
      ctx.fillStyle = isLight ? '#1e293b' : '#020408';
      ctx.fillRect(leftX, groundY, rightX - leftX, height - groundY);

      // Warning hazard stripes on chasm walls
      ctx.fillStyle = isLight ? '#dc2626' : '#ff007a';
      ctx.fillRect(leftX, groundY, 3, height - groundY);
      ctx.fillRect(rightX - 3, groundY, 3, height - groundY);

      // Danger chevron markers
      ctx.fillStyle = isLight ? '#f59e0b' : '#00f0ff';
      const mid = (leftX + rightX) / 2;
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('▼ PIT ▼', mid, groundY + 14);
    }

    // Helper: Draw Rover Player
    function drawRover(p, isLight, hasRocket) {
      ctx.save();
      ctx.translate(p.x, p.y);

      // Body (Hexagonal armored pod)
      ctx.fillStyle = isLight ? '#059669' : '#10b981';
      ctx.shadowColor = isLight ? 'rgba(5, 150, 105, 0.4)' : '#00f0ff';
      ctx.shadowBlur = hasRocket ? 14 : 8;
      ctx.fillRect(0, 6, p.w - 6, p.h - 14);

      // Cockpit visor
      ctx.fillStyle = isLight ? '#0284c7' : '#00f0ff';
      ctx.fillRect(p.w - 14, 8, 8, 7);

      // Treads & Wheels
      ctx.fillStyle = isLight ? '#1e293b' : '#334155';
      ctx.fillRect(-2, p.h - 8, p.w - 2, 8);
      // Wheel hubs (rotating with speed)
      ctx.fillStyle = isLight ? '#94a3b8' : '#cbd5e1';
      const wheelAngle = frame * 0.2;
      const hub1 = 3 + Math.sin(wheelAngle) * 1.5;
      const hub2 = p.w - 15 + Math.sin(wheelAngle) * 1.5;
      ctx.fillRect(hub1, p.h - 6, 6, 4);
      ctx.fillRect(hub2, p.h - 6, 6, 4);

      // Antenna / Sensor
      ctx.strokeStyle = isLight ? '#7c3aed' : '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(8, 6);
      ctx.lineTo(4, 0);
      ctx.stroke();
      ctx.fillStyle = '#ff007a';
      ctx.beginPath();
      ctx.arc(4, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Rocket Booster Nozzle (attached to rear when active)
      if (hasRocket) {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-6, 9, 6, 9);
        // Blazing thruster flame cone
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-6, 10);
        ctx.lineTo(-14 - Math.random() * 6, 13.5);
        ctx.lineTo(-6, 17);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.moveTo(-6, 11.5);
        ctx.lineTo(-10 - Math.random() * 4, 13.5);
        ctx.lineTo(-6, 15.5);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    // Helper: Draw Full Screen Overlay (Start / GameOver)
    function drawOverlay(isLight, title, titleColor, subtitle, subColor) {
      ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(6, 9, 17, 0.85)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = titleColor;
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, height / 2 - 14);

      ctx.font = '13px monospace';
      ctx.fillStyle = subColor;
      ctx.fillText(subtitle, width / 2, height / 2 + 18);
    }

    function gameLoop() {
      update();
      render();
      requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
  });
})();
