/* ==========================================================================
   SHINY LOVE - INTERACTIVE SCRIPT
   Canvas particles, Web Audio API sound, Scene flow management & Easter Egg
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. STATE & REFERENCES
  // ------------------------------------------------------------------------
  let currentScene = 1;
  let isTransitioning = false;
  const visitedCards = new Set();
  let audioEnabled = false;
  let audioCtx = null;

  const bgCanvas = document.getElementById('bg-canvas');
  const ctx = bgCanvas.getContext('2d');

  // DOM Elements
  const audioToggle = document.getElementById('audio-toggle');
  const iconSoundOn = audioToggle.querySelector('.icon-sound-on');
  const iconSoundOff = audioToggle.querySelector('.icon-sound-off');
  const progressDots = document.querySelectorAll('.progress-dot');

  // Buttons
  const btnScene1 = document.getElementById('btn-scene-1');
  const btnScene3 = document.getElementById('btn-scene-3');
  const btnScene4 = document.getElementById('btn-scene-4');

  // Interactive Elements
  const hookHeart = document.getElementById('hook-heart-wrapper');
  const giftBox = document.getElementById('gift-box');
  const memoryCards = document.querySelectorAll('.memory-card');
  const climaxHeart = document.getElementById('climax-heart-wrapper');
  const climaxIntro = document.getElementById('climax-intro');
  const climaxReveal = document.getElementById('climax-reveal');
  const easterEggModal = document.getElementById('easter-egg-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');

  // ------------------------------------------------------------------------
  // 2. CANVAS & PARTICLE ENGINE
  // ------------------------------------------------------------------------
  let width = 0;
  let height = 0;
  const stars = [];
  const ambientParticles = [];
  const burstParticles = [];

  function resizeCanvas() {
    width = bgCanvas.width = window.innerWidth;
    height = bgCanvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Create initial stars
  const STAR_COUNT = Math.min(Math.floor((width * height) / 4000), 120);
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.005
    });
  }

  // Ambient floating particles
  const AMBIENT_COUNT = 30;
  for (let i = 0; i < AMBIENT_COUNT; i++) {
    ambientParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      vy: Math.random() * -0.5 - 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      isHeart: Math.random() > 0.6
    });
  }

  // Create interactive burst particles
  function createBurst(x, y, count = 35, isClimax = false) {
    const total = isClimax ? 140 : count;
    for (let i = 0; i < total; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isClimax ? 7 : 4.5) + 1;
      burstParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isClimax ? 1.5 : 0.5),
        size: Math.random() * (isClimax ? 14 : 9) + 4,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.01,
        color: i % 3 === 0 ? '#ff2a70' : (i % 3 === 1 ? '#ff758c' : '#ffffff'),
        isHeart: Math.random() > 0.4,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.1
      });
    }
  }

  // Draw heart shape on canvas
  function drawHeart(ctx, x, y, size, color, alpha, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
    ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Canvas render loop
  let time = 0;
  function renderCanvas() {
    time += 0.01;
    ctx.clearRect(0, 0, width, height);

    // Dynamic Aurora Background Gradient
    const gX1 = width * 0.5 + Math.sin(time * 0.5) * (width * 0.3);
    const gY1 = height * 0.3 + Math.cos(time * 0.7) * (height * 0.2);
    const gX2 = width * 0.5 + Math.cos(time * 0.4) * (width * 0.3);
    const gY2 = height * 0.7 + Math.sin(time * 0.6) * (height * 0.2);

    const auroraGrad = ctx.createRadialGradient(gX1, gY1, 50, gX2, gY2, width * 0.8);
    auroraGrad.addColorStop(0, 'rgba(123, 44, 191, 0.25)');
    auroraGrad.addColorStop(0.5, 'rgba(216, 27, 96, 0.18)');
    auroraGrad.addColorStop(1, 'rgba(15, 12, 27, 0.95)');

    ctx.fillStyle = auroraGrad;
    ctx.fillRect(0, 0, width, height);

    // Render Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.alpha += s.speed;
      if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render Ambient Floating Particles
    for (let i = 0; i < ambientParticles.length; i++) {
      const p = ambientParticles[i];
      p.y += p.vy;
      p.x += p.vx + Math.sin(time + i) * 0.3;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      if (p.isHeart) {
        drawHeart(ctx, p.x, p.y, p.radius * 3, '#ff758c', p.alpha);
      } else {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#ff2a70';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Render Burst Particles
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const bp = burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vy += 0.05; // gentle gravity
      bp.alpha -= bp.decay;
      bp.rotation += bp.vRot;

      if (bp.alpha <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }

      if (bp.isHeart) {
        drawHeart(ctx, bp.x, bp.y, bp.size, bp.color, bp.alpha, bp.rotation);
      } else {
        ctx.globalAlpha = bp.alpha;
        ctx.fillStyle = bp.color;
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(renderCanvas);
  }

  requestAnimationFrame(renderCanvas);

  // ------------------------------------------------------------------------
  // 3. WEB AUDIO API SYNTHESIZER (No external sound files required)
  // ------------------------------------------------------------------------
  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq = 440, type = 'sine', duration = 0.5, gainVal = 0.15) {
    if (!audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  function playArpeggio(freqs = [523.25, 659.25, 783.99, 1046.50], delay = 120) {
    if (!audioEnabled) return;
    freqs.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 'sine', 0.8, 0.12);
      }, idx * delay);
    });
  }

  audioToggle.addEventListener('click', () => {
    initAudio();
    audioEnabled = !audioEnabled;
    if (audioEnabled) {
      iconSoundOn.classList.remove('hidden');
      iconSoundOff.classList.add('hidden');
      playTone(523.25, 'sine', 0.4, 0.1);
    } else {
      iconSoundOn.classList.add('hidden');
      iconSoundOff.classList.remove('hidden');
    }
  });

  // ------------------------------------------------------------------------
  // 4. SCENE FLOW & NAVIGATION
  // ------------------------------------------------------------------------
  function updateProgressDots(targetStep) {
    progressDots.forEach((dot) => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      if (step === targetStep) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToScene(targetStep) {
    if (isTransitioning || targetStep === currentScene) return;
    isTransitioning = true;

    const currentElem = document.getElementById(`scene-${currentScene}`);
    const nextElem = document.getElementById(`scene-${targetStep}`);

    currentElem.classList.add('exiting');
    currentElem.classList.remove('active');

    playTone(440 + targetStep * 60, 'sine', 0.5, 0.08);

    setTimeout(() => {
      currentElem.classList.remove('exiting');
      nextElem.classList.add('active');

      currentScene = targetStep;
      updateProgressDots(currentScene);
      isTransitioning = false;

      // Scene specific trigger logic
      if (currentScene === 3) {
        triggerScene3Messages();
      }
    }, 600);
  }

  // ------------------------------------------------------------------------
  // 5. SCENE 1 INTERACTION
  // ------------------------------------------------------------------------
  hookHeart.addEventListener('click', (e) => {
    initAudio();
    const rect = hookHeart.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    createBurst(x, y, 40);
    playTone(587.33, 'sine', 0.4, 0.15); // D5
  });

  hookHeart.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      hookHeart.click();
    }
  });

  btnScene1.addEventListener('click', () => {
    initAudio();
    goToScene(2);
  });

  // ------------------------------------------------------------------------
  // 6. SCENE 2 INTERACTION (GIFT BOX)
  // ------------------------------------------------------------------------
  giftBox.addEventListener('click', (e) => {
    initAudio();
    if (giftBox.classList.contains('opened')) return;

    giftBox.classList.add('opened');

    const rect = giftBox.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Burst hearts & light
    createBurst(cx, cy, 60);
    playArpeggio([523.25, 659.25, 783.99, 1046.50], 100);

    // Transition to scene 3 automatically after gift animation finishes
    setTimeout(() => {
      goToScene(3);
    }, 1800);
  });

  giftBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      giftBox.click();
    }
  });

  // ------------------------------------------------------------------------
  // 7. SCENE 3 SEQUENTIAL REVEAL
  // ------------------------------------------------------------------------
  function triggerScene3Messages() {
    const lines = document.querySelectorAll('.msg-line');
    lines.forEach((line) => {
      const delay = parseInt(line.getAttribute('data-delay') || '0', 10);
      setTimeout(() => {
        line.classList.add('visible');
        playTone(400 + Math.random() * 200, 'sine', 0.3, 0.05);
      }, delay);
    });

    // Reveal continue button after final line
    setTimeout(() => {
      btnScene3.classList.remove('hidden');
      btnScene3.focus();
    }, 5600);
  }

  btnScene3.addEventListener('click', () => {
    goToScene(4);
  });

  // ------------------------------------------------------------------------
  // 8. SCENE 4 INTERACTIVE CARDS
  // ------------------------------------------------------------------------
  memoryCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      initAudio();
      const cardId = card.getAttribute('data-card-id');
      visitedCards.add(cardId);

      card.classList.add('visited');
      const check = card.querySelector('.card-check');
      if (check) check.classList.remove('hidden');

      const rect = card.getBoundingClientRect();
      createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
      playTone(600 + visitedCards.size * 100, 'sine', 0.4, 0.12);

      // Check if all 4 cards have been touched
      if (visitedCards.size === 4) {
        setTimeout(() => {
          btnScene4.classList.remove('hidden');
          btnScene4.focus();
          playArpeggio([523.25, 659.25, 783.99, 1046.50], 90);
        }, 500);
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  btnScene4.addEventListener('click', () => {
    goToScene(5);
  });

  // ------------------------------------------------------------------------
  // 9. SCENE 5 CLIMAX & REVEAL
  // ------------------------------------------------------------------------
  let climaxTriggered = false;

  function triggerClimax(e) {
    if (climaxTriggered) return;
    climaxTriggered = true;
    initAudio();

    const rect = climaxHeart.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Mass burst particles
    createBurst(cx, cy, 140, true);
    playArpeggio([392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51], 80);

    // Animate heart out & reveal finale card
    climaxHeart.style.transform = 'scale(1.3)';
    climaxHeart.style.opacity = '0.5';

    setTimeout(() => {
      climaxIntro.classList.add('hidden');
      climaxHeart.classList.add('hidden');
      climaxReveal.classList.remove('hidden');
    }, 900);
  }

  climaxHeart.addEventListener('click', triggerClimax);
  climaxHeart.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerClimax(e);
    }
  });

  // ------------------------------------------------------------------------
  // 10. SECRET EASTER EGG (Long press or 5-tap on climax heart)
  // ------------------------------------------------------------------------
  let pressTimer = null;
  let tapCount = 0;

  climaxHeart.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => {
      showEasterEgg();
    }, 2000);
  });

  climaxHeart.addEventListener('touchend', () => {
    if (pressTimer) clearTimeout(pressTimer);
  });

  climaxHeart.addEventListener('mousedown', () => {
    tapCount++;
    if (tapCount >= 5) {
      showEasterEgg();
      tapCount = 0;
    }
    pressTimer = setTimeout(() => {
      showEasterEgg();
    }, 2000);
  });

  climaxHeart.addEventListener('mouseup', () => {
    if (pressTimer) clearTimeout(pressTimer);
  });

  function showEasterEgg() {
    easterEggModal.classList.remove('hidden');
    playArpeggio([659.25, 783.99, 1046.50, 1318.51], 70);
  }

  btnCloseModal.addEventListener('click', () => {
    easterEggModal.classList.add('hidden');
  });

  easterEggModal.addEventListener('click', (e) => {
    if (e.target === easterEggModal) {
      easterEggModal.classList.add('hidden');
    }
  });

});
