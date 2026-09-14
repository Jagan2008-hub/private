/* ==========================================================================
   SHINY LOVE - SCRIPT
   Interactive memory engine, Canvas particles, Web Audio synthesizer,
   Password gate, Lightbox modal & Easter egg mechanics.
   Created for Shiny by Jagadeeshwar.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. MEMORIES DATA MAP (16 Personal Photos)
  // ------------------------------------------------------------------------
  const MEMORIES = [
    {
      id: 1,
      file: 'assets/photos/photo-01.jpg',
      title: 'Comfort & Closeness',
      quote: '“Some moments don\'t need words. I still remember how natural it felt to have you this close.”',
      detail: 'Holding hands on the bench & lying on my shoulder at home.',
      tag: 'Major Memory • Photo 01'
    },
    {
      id: 2,
      file: 'assets/photos/photo-02.jpg',
      title: 'Video Call Smile',
      quote: '“Even when apart, seeing you smile on a call could make any day brighter.”',
      detail: 'Cute pose during a video call.',
      tag: 'Video Call • Photo 02'
    },
    {
      id: 3,
      file: 'assets/photos/photo-03.jpg',
      title: 'Tiny Expression',
      quote: '“I don\'t know why little expressions like this stayed with me... but they did.”',
      detail: 'A tiny video-call face that became a core memory.',
      tag: 'Tiny Moment • Photo 03'
    },
    {
      id: 4,
      file: 'assets/photos/photo-04.jpg',
      title: 'Your Personality',
      quote: '“Your silly expressions and the effortless way you are.”',
      detail: 'Cute video-call moment.',
      tag: 'Personality • Photo 04'
    },
    {
      id: 5,
      file: 'assets/photos/photo-05.jpg',
      title: 'Going Out Together',
      quote: '“A simple happy day of being outside together.”',
      detail: 'Selfie together while going out.',
      tag: 'Outing • Photo 05'
    },
    {
      id: 6,
      file: 'assets/photos/photo-06.jpg',
      title: 'Deep Memory',
      quote: '“Then there were moments where looking into your eyes was the only thing that mattered.”',
      detail: 'Looking into each other\'s eyes on the bed.',
      tag: 'Deep Memory • Photo 06'
    },
    {
      id: 7,
      file: 'assets/photos/photo-07.jpg',
      title: 'Your Last Kiss',
      quote: '“Your last kiss on my cheek. I didn\'t know then how much I would miss it.”',
      detail: 'One of the last moments I got to keep from our last meeting.',
      tag: 'Core Memory • Photo 07'
    },
    {
      id: 8,
      file: 'assets/photos/photo-08.jpg',
      title: 'Connected Far Away',
      quote: '“Distance, but still feeling connected.”',
      detail: 'Cute video call moment across space.',
      tag: 'Distance • Photo 08'
    },
    {
      id: 9,
      file: 'assets/photos/photo-09.jpg',
      title: 'Beach Day',
      quote: '“Happy ocean breeze and your smile by the water.”',
      detail: 'Daytime beach selfie together.',
      tag: 'Beach Day • Photo 09'
    },
    {
      id: 10,
      file: 'assets/photos/photo-10.jpg',
      title: 'Carnival Lights',
      quote: '“An older memory showing that the little moments always mattered.”',
      detail: 'Nighttime beach fair selfie.',
      tag: 'Memory • Photo 10'
    },
    {
      id: 11,
      file: 'assets/photos/photo-11.jpg',
      title: 'Auto Side Mirror',
      quote: '“An ordinary auto ride turned into a memory I kept.”',
      detail: 'Cute selfie in an auto side mirror.',
      tag: 'Unexpected • Photo 11'
    },
    {
      id: 12,
      file: 'assets/photos/photo-12.jpg',
      title: 'Simple Smile',
      quote: '“One of those simple pictures that makes me smile every single time.”',
      detail: 'A cute selfie that lights up the day.',
      tag: 'Simple Smile • Photo 12'
    },
    {
      id: 13,
      file: 'assets/photos/photo-13.jpg',
      title: 'Our Secret Memory',
      quote: '“Some memories don\'t need an explanation. Some are just ours. ❤️”',
      detail: 'A private and subtle memory of us.',
      tag: 'Secret • Photo 13'
    },
    {
      id: 14,
      file: 'assets/photos/photo-14.jpg',
      title: 'Holding Hands in Auto',
      quote: '“Connection and comfort during an ordinary journey.”',
      detail: 'Both holding hands tightly during an auto ride.',
      tag: 'Intimate Connection • Photo 14'
    },
    {
      id: 15,
      file: 'assets/photos/photo-15.jpg',
      title: 'Warm Hug Selfie',
      quote: '“Warmth, closeness and pure affection.”',
      detail: 'Holding you by your shoulder and taking a selfie.',
      tag: 'Warmth • Photo 15'
    },
    {
      id: 16,
      file: 'assets/photos/photo-16.jpg',
      title: 'Special Memory',
      quote: '“A cute little moment kept safe right here.”',
      detail: 'Final cute video-call selfie memory.',
      tag: 'Memory • Photo 16'
    }
  ];

  // ------------------------------------------------------------------------
  // 2. STATE VARIABLES & SCROLL RESTORATION
  // ------------------------------------------------------------------------
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  let isAuthenticated = false;
  let currentScene = 0; // 0 = Gate, 1 = Beginning ... 12 = Reward
  let isTransitioning = false;
  let audioEnabled = false;
  let audioCtx = null;
  let ambientOsc = null;

  // Quiz State
  let quizCurrentQ = 0;
  let quizScore = 0;
  let quizAnswers = [];
  let quizEmotionalAnswer = '';
  let quizFinalMessage = '';
  let quizLocked = false;

  // DOM Elements
  const bgCanvas = document.getElementById('bg-canvas');
  const ctx = bgCanvas.getContext('2d');
  const audioToggle = document.getElementById('audio-toggle');
  const iconSoundOn = audioToggle.querySelector('.icon-sound-on');
  const iconSoundOff = audioToggle.querySelector('.icon-sound-off');
  const sceneProgressNav = document.getElementById('scene-progress-nav');
  const progressDots = document.querySelectorAll('.progress-dot');

  // Gate Elements
  const gateForm = document.getElementById('gate-form');
  const gatePassInput = document.getElementById('gate-pass');
  const gateError = document.getElementById('gate-error');

  // Buttons
  const btnScene1 = document.getElementById('btn-scene-1');
  const btnScene2 = document.getElementById('btn-scene-2');
  const btnScene3 = document.getElementById('btn-scene-3');
  const btnScene4 = document.getElementById('btn-scene-4');
  const btnScene5 = document.getElementById('btn-scene-5');
  const btnScene6 = document.getElementById('btn-scene-6');
  const btnScene7 = document.getElementById('btn-scene-7');
  const btnScene8 = document.getElementById('btn-scene-8');
  const btnScene9 = document.getElementById('btn-scene-9');

  // Interactive Elements
  const hookHeart = document.getElementById('hook-heart-wrapper');
  const climaxHeart = document.getElementById('climax-heart-wrapper');
  const climaxReveal = document.getElementById('climax-reveal');
  const easterEggModal = document.getElementById('easter-egg-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');

  // Lightbox Modal
  const photoLightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const btnCloseLightbox = document.getElementById('btn-close-lightbox');

  // Universal Scroll Reset Function
  function resetSceneScroll() {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    } catch (e) {
      window.scrollTo(0, 0);
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const appContainer = document.querySelector('.app-container');
    if (appContainer) appContainer.scrollTop = 0;
  }

  // Initial scroll reset
  resetSceneScroll();

  // ------------------------------------------------------------------------
  // 3. CANVAS & PARTICLE ENGINE
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

  const STAR_COUNT = Math.min(Math.floor((width * height) / 4500), 120);
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.005
    });
  }

  const AMBIENT_COUNT = 30;
  for (let i = 0; i < AMBIENT_COUNT; i++) {
    ambientParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      vy: Math.random() * -0.4 - 0.15,
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
      isHeart: Math.random() > 0.55
    });
  }

  function createBurst(x, y, count = 35, isClimax = false) {
    const total = isClimax ? 120 : count;
    for (let i = 0; i < total; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isClimax ? 7 : 4.5) + 1;
      burstParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isClimax ? 1.5 : 0.4),
        size: Math.random() * (isClimax ? 12 : 8) + 4,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.008,
        color: i % 3 === 0 ? '#ff3b7b' : (i % 3 === 1 ? '#ff758c' : '#ffffff'),
        isHeart: Math.random() > 0.35,
        rotation: Math.random() * Math.PI * 2
      });
    }
  }

  function drawHeart(cx, cy, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(cx, cy + topCurveHeight);
    ctx.bezierCurveTo(cx, cy, cx - size / 2, cy, cx - size / 2, cy + topCurveHeight);
    ctx.bezierCurveTo(cx - size / 2, cy + (size + topCurveHeight) / 2, cx, cy + size, cx, cy + size * 1.1);
    ctx.bezierCurveTo(cx, cy + size, cx + size / 2, cy + (size + topCurveHeight) / 2, cx + size / 2, cy + topCurveHeight);
    ctx.bezierCurveTo(cx + size / 2, cy, cx, cy, cx, cy + topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    // Render twinkling background stars
    stars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render ambient rising hearts & glowing specs
    ambientParticles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;

      if (p.y < -20) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }

      if (p.isHeart) {
        drawHeart(p.x, p.y, p.radius * 3.5, '#ff758c', p.alpha * 0.4);
      } else {
        ctx.fillStyle = `rgba(224, 170, 255, ${p.alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Render interactive bursts
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const bp = burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.alpha -= bp.decay;

      if (bp.alpha <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }

      if (bp.isHeart) {
        drawHeart(bp.x, bp.y, bp.size, bp.color, bp.alpha);
      } else {
        ctx.fillStyle = bp.color;
        ctx.globalAlpha = bp.alpha;
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();

  // ------------------------------------------------------------------------
  // 4. WEB AUDIO SYNTHESIZER (AMBIENT ROMANTIC PAD)
  // ------------------------------------------------------------------------
  function initAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    } catch (e) {
      console.log('Web Audio API not supported', e);
    }
  }

  function playTone(freq, type = 'sine', duration = 0.4, gainVal = 0.15) {
    if (!audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(gainVal, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playArpeggio(notes, delayMs = 90) {
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 'sine', 0.6, 0.18);
      }, idx * delayMs);
    });
  }

  function toggleAmbientMusic() {
    initAudio();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!audioEnabled) {
      audioEnabled = true;
      iconSoundOn.classList.remove('hidden');
      iconSoundOff.classList.add('hidden');
      playTone(440, 'sine', 0.8, 0.2);
    } else {
      audioEnabled = false;
      iconSoundOn.classList.add('hidden');
      iconSoundOff.classList.remove('hidden');
    }
  }

  audioToggle.addEventListener('click', toggleAmbientMusic);

  // ------------------------------------------------------------------------
  // 5. SCENE ENGINE & TIMELINE NAVIGATION
  // ------------------------------------------------------------------------
  const scenes = [
    document.getElementById('scene-gate'),
    document.getElementById('scene-1'),
    document.getElementById('scene-2'),
    document.getElementById('scene-3'),
    document.getElementById('scene-4'),
    document.getElementById('scene-5'),
    document.getElementById('scene-6'),
    document.getElementById('scene-7'),
    document.getElementById('scene-8'),
    document.getElementById('scene-9'),
    document.getElementById('scene-10'),
    document.getElementById('scene-11'),
    document.getElementById('scene-12'),
    document.getElementById('scene-13'),
    document.getElementById('scene-14')
  ];

  function updateProgressDots(index) {
    if (!sceneProgressNav) return;
    if (!isAuthenticated || index === 0) {
      sceneProgressNav.classList.add('hidden');
    } else {
      sceneProgressNav.classList.remove('hidden');
    }

    progressDots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function triggerTypewriter(sceneElem) {
    if (!sceneElem) return;
    const lines = sceneElem.querySelectorAll('[data-delay]');
    lines.forEach(line => {
      const delay = parseInt(line.getAttribute('data-delay') || '0', 10);
      line.style.opacity = '0';
      line.style.transform = 'translateY(10px)';
      line.style.transition = 'all 0.6s ease';

      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }, delay);
    });

    const fadeBtn = sceneElem.querySelector('.fade-in-btn');
    if (fadeBtn) {
      setTimeout(() => {
        fadeBtn.classList.remove('hidden');
        fadeBtn.style.opacity = '0';
        fadeBtn.style.transition = 'opacity 0.8s ease';
        requestAnimationFrame(() => fadeBtn.style.opacity = '1');
      }, 4200);
    }
  }

  function goToScene(index) {
    if (index < 0 || index >= scenes.length || isTransitioning) return;

    // Strict Authentication Guard: Block any scene other than Gate if not authenticated
    if (!isAuthenticated && index !== 0) {
      console.warn('[Gate] Authentication required. Access to scene', index, 'denied.');
      if (currentScene !== 0) {
        scenes.forEach((s, idx) => {
          if (idx === 0) s.classList.add('active');
          else s.classList.remove('active');
        });
        currentScene = 0;
        updateProgressDots(0);
        resetSceneScroll();
      }
      return;
    }

    // Authenticated users should not navigate back into the password gate
    if (isAuthenticated && index === 0) {
      return;
    }

    isTransitioning = true;
    resetSceneScroll();

    playTone(320 + index * 40, 'sine', 0.25, 0.08);

    const oldScene = scenes[currentScene];
    const newScene = scenes[index];

    if (oldScene && oldScene !== newScene) {
      oldScene.classList.remove('active');
    }

    resetSceneScroll();

    setTimeout(() => {
      currentScene = index;

      if (isAuthenticated) {
        sessionStorage.setItem('shiny_current_scene', String(index));
      }

      scenes.forEach((s, idx) => {
        if (idx === index) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });

      updateProgressDots(currentScene);
      triggerTypewriter(newScene);

      // Force viewport to top of new scene instantly
      resetSceneScroll();
      requestAnimationFrame(resetSceneScroll);

      setTimeout(() => {
        isTransitioning = false;
        resetSceneScroll();
      }, 100);
    }, 350);
  }

  // Progress dot click handling
  progressDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isAuthenticated || isTransitioning) return;
      const step = parseInt(dot.getAttribute('data-step') || '0', 10);
      // Only allow navigating between unlocked story scenes 1..10
      if (step >= 1 && step <= 10) {
        goToScene(step);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 6. PASSWORD GATE MECHANICS (Key: 9226)
  // ------------------------------------------------------------------------
  function checkPassword() {
    initAudio();
    const val = gatePassInput.value.trim();
    if (val === '9226') {
      gateError.classList.add('hidden');
      isAuthenticated = true;
      sessionStorage.setItem('shiny_auth_9226', 'unlocked');

      playArpeggio([523.25, 659.25, 783.99], 100);

      const rect = gateForm.getBoundingClientRect();
      createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);

      setTimeout(() => {
        goToScene(1);
      }, 400);
    } else {
      gateError.classList.remove('hidden');
      playTone(180, 'sawtooth', 0.3, 0.15);
      gatePassInput.classList.add('shake');
      setTimeout(() => gatePassInput.classList.remove('shake'), 500);
    }
  }

  gateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    checkPassword();
  });

  // Session Authentication Check on Page Load
  const savedAuth = sessionStorage.getItem('shiny_auth_9226');
  if (savedAuth === 'unlocked') {
    isAuthenticated = true;
    const savedScene = parseInt(sessionStorage.getItem('shiny_current_scene') || '1', 10);
    const targetScene = (savedScene >= 1 && savedScene < scenes.length) ? savedScene : 1;
    goToScene(targetScene);
  } else {
    isAuthenticated = false;
    currentScene = 0;
    scenes.forEach((s, idx) => {
      if (idx === 0) s.classList.add('active');
      else s.classList.remove('active');
    });
    updateProgressDots(0);
    resetSceneScroll();
  }

  // ------------------------------------------------------------------------
  // 7. INTERACTIVE SCENE BUTTONS
  // ------------------------------------------------------------------------
  hookHeart.addEventListener('click', (e) => {
    e.preventDefault();
    initAudio();
    const rect = hookHeart.getBoundingClientRect();
    createBurst(e.clientX || (rect.left + rect.width / 2), e.clientY || (rect.top + rect.height / 2), 35);
    playTone(587.33, 'sine', 0.4, 0.15);
  });

  btnScene1.addEventListener('click', (e) => { e.preventDefault(); if (!isTransitioning) { initAudio(); goToScene(2); } });
  btnScene2.addEventListener('click', (e) => { e.preventDefault(); if (!isTransitioning) { initAudio(); goToScene(3); } });
  btnScene3.addEventListener('click', (e) => { e.preventDefault(); if (!isTransitioning) { initAudio(); goToScene(4); } });
  btnScene4.addEventListener('click', (e) => { e.preventDefault(); if (!isTransitioning) { initAudio(); goToScene(5); } });
  btnScene5.addEventListener('click', (e) => { e.preventDefault(); if (!isTransitioning) { initAudio(); goToScene(6); } });
  btnScene6.addEventListener('click', (e) => { e.preventDefault(); if (!isTransitioning) { initAudio(); goToScene(7); } });
  btnScene7.addEventListener('click', (e) => { e.preventDefault(); if (!isTransitioning) { initAudio(); goToScene(8); } });
  btnScene8.addEventListener('click', (e) => { e.preventDefault(); if (!isTransitioning) { initAudio(); goToScene(9); } });
  btnScene9.addEventListener('click', (e) => { e.preventDefault(); if (!isTransitioning) { initAudio(); goToScene(10); } });

  // Quiz entry button (inside climax reveal card)
  const btnStartQuiz = document.getElementById('btn-start-quiz');
  if (btnStartQuiz) {
    btnStartQuiz.addEventListener('click', (e) => {
      e.preventDefault();
      if (isTransitioning) return;
      initAudio();
      startQuiz();
      goToScene(11);
    });
  }

  // Reward button
  const btnOpenReward = document.getElementById('btn-open-reward');
  if (btnOpenReward) {
    btnOpenReward.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      openReward();
    });
  }

  // ------------------------------------------------------------------------
  // 8. LIGHTBOX MODAL MECHANICS
  // ------------------------------------------------------------------------
  function openLightbox(photoId) {
    const memory = MEMORIES.find(m => m.id === parseInt(photoId, 10));
    if (!memory) return;

    initAudio();
    playTone(620, 'sine', 0.3, 0.08);

    lightboxImg.src = memory.file;
    lightboxTag.textContent = memory.tag;
    lightboxTitle.textContent = memory.title;
    lightboxCaption.textContent = memory.quote;

    document.body.style.overflow = 'hidden';
    photoLightbox.classList.remove('hidden');
  }

  function closeLightbox() {
    document.body.style.overflow = '';
    photoLightbox.classList.add('hidden');
  }

  document.querySelectorAll('[data-photo-id]').forEach((elem) => {
    elem.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = elem.getAttribute('data-photo-id');
      openLightbox(id);
    });

    elem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = elem.getAttribute('data-photo-id');
        openLightbox(id);
      }
    });
  });

  btnCloseLightbox.addEventListener('click', closeLightbox);
  photoLightbox.addEventListener('click', (e) => {
    if (e.target === photoLightbox) closeLightbox();
  });

  // ------------------------------------------------------------------------
  // 9. FINAL SCENE CLIMAX & SECRET EASTER EGG
  // ------------------------------------------------------------------------
  let pressTimer = null;
  let tapCount = 0;
  let climaxRevealed = false;

  function handleClimaxInteraction(e) {
    initAudio();
    const rect = climaxHeart.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    createBurst(cx, cy, 70);
    playTone(523.25, 'sine', 0.4, 0.12);

    if (!climaxRevealed) {
      climaxRevealed = true;
      document.getElementById('final-text-sequence').classList.add('hidden');
      climaxHeart.classList.add('hidden');
      climaxReveal.classList.remove('hidden');
      playArpeggio([523.25, 659.25, 783.99, 1046.50, 1318.51], 80);
    }
  }

  function triggerEasterEgg() {
    initAudio();
    easterEggModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const rect = climaxHeart.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 120, true);
    playArpeggio([659.25, 783.99, 1046.50, 1318.51], 70);
  }

  climaxHeart.addEventListener('click', (e) => {
    tapCount++;
    handleClimaxInteraction(e);
    if (tapCount >= 5) {
      triggerEasterEgg();
      tapCount = 0;
    }
  });

  climaxHeart.addEventListener('touchstart', () => {
    pressTimer = setTimeout(() => {
      triggerEasterEgg();
    }, 1800);
  });

  climaxHeart.addEventListener('touchend', () => {
    if (pressTimer) clearTimeout(pressTimer);
  });

  climaxHeart.addEventListener('mousedown', () => {
    pressTimer = setTimeout(() => {
      triggerEasterEgg();
    }, 1800);
  });

  climaxHeart.addEventListener('mouseup', () => {
    if (pressTimer) clearTimeout(pressTimer);
  });

  btnCloseModal.addEventListener('click', () => {
    document.body.style.overflow = '';
    easterEggModal.classList.add('hidden');
  });

  easterEggModal.addEventListener('click', (e) => {
    if (e.target === easterEggModal) {
      document.body.style.overflow = '';
      easterEggModal.classList.add('hidden');
    }
  });

  // ------------------------------------------------------------------------
  // 10. 8-QUES  // ------------------------------------------------------------------------
  // 10. 8-QUESTION LOVE GAME ENGINE
  // ------------------------------------------------------------------------
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      subhead: "Okay… let's start with something you should definitely remember.",
      question: "Where did we go for the first time together?",
      options: [
        { letter: 'A', text: 'Ibaco' },
        { letter: 'B', text: 'VR Mall' },
        { letter: 'C', text: 'Marina Beach' },
        { letter: 'D', text: 'Phoenix Mall' }
      ],
      correctIndex: 0,
      feedbackCorrect: {
        lead: "Yep. Of course you remember. ❤️",
        sub: "9 February 2025.",
        detail: "That's where our little timeline begins."
      },
      feedbackWrong: {
        lead: "Not quite. 😌 Looks like I have to remind you.",
        sub: "It was Ibaco — 9 February 2025.",
        detail: "That's where our little timeline begins."
      }
    },
    {
      id: 2,
      subhead: "Okay… this one is even more specific.",
      question: "When did I get my first hug from you?",
      options: [
        { letter: 'A', text: '5 February 2025' },
        { letter: 'B', text: '7 February 2025' },
        { letter: 'C', text: '9 February 2025' },
        { letter: 'D', text: '11 March 2025' }
      ],
      correctIndex: 1,
      feedbackCorrect: {
        lead: "Yep. I knew you'd remember that.",
        sub: "07 • 02 • 2025",
        detail: "That one mattered."
      },
      feedbackWrong: {
        lead: "Close, but not quite. 😌",
        sub: "It was 7 February 2025.",
        detail: "That one mattered."
      }
    },
    {
      id: 3,
      subhead: "Now let's see if you remember this day…",
      question: "What happened on 11 March 2025?",
      options: [
        { letter: 'A', text: 'Our first video call' },
        { letter: 'B', text: 'Our first hug' },
        { letter: 'C', text: 'Our first movie date + first kiss' },
        { letter: 'D', text: 'Our first time going to Ibaco' }
      ],
      correctIndex: 2,
      feedbackCorrect: {
        lead: "Now THAT one should be impossible to forget. ❤️",
        sub: "11 March 2025",
        detail: "Our first movie date + first kiss."
      },
      feedbackWrong: {
        lead: "Not quite. 😌",
        sub: "It was 11 March 2025.",
        detail: "Our first movie date + first kiss."
      }
    },
    {
      id: 4,
      subhead: "Okay… now I'm curious.",
      question: "Where do you think my favourite place to kiss you is? 👀",
      options: [
        { letter: 'A', text: 'Forehead' },
        { letter: 'B', text: 'Cheek' },
        { letter: 'C', text: 'Lips' },
        { letter: 'D', text: 'Hand' }
      ],
      correctIndex: 2,
      feedbackCorrect: {
        lead: "You already knew that one, didn't you? 😌❤️",
        sub: "",
        detail: ""
      },
      feedbackWrong: {
        lead: "Hmm, not quite. 😌",
        sub: "It's your lips. ❤️",
        detail: "You already knew that one, didn't you?"
      }
    },
    {
      id: 5,
      subhead: "Let's see if you know this one…",
      question: "What is my favourite place to go for a movie with you?",
      options: [
        { letter: 'A', text: 'Sangam' },
        { letter: 'B', text: 'PVR' },
        { letter: 'C', text: 'INOX' },
        { letter: 'D', text: 'Sathyam' }
      ],
      correctIndex: 0,
      feedbackCorrect: {
        lead: "Sangam. ❤️ Every movie there felt like our little escape.",
        sub: "",
        detail: ""
      },
      feedbackWrong: {
        lead: "Not that one. 😌",
        sub: "It's Sangam. ❤️",
        detail: "Every movie there felt like our little escape."
      }
    },
    {
      id: 6,
      subhead: "Okay, put these memories in your head for a second…",
      question: "Which happened FIRST?",
      options: [
        { letter: 'A', text: 'First kiss' },
        { letter: 'B', text: 'First movie date' },
        { letter: 'C', text: 'First hug' },
        { letter: 'D', text: 'First date' }
      ],
      correctIndex: 2,
      feedbackCorrect: {
        lead: "Exactly.",
        sub: "First hug — 7 February 2025.",
        detail: "Some dates really do stay in your head."
      },
      feedbackWrong: {
        lead: "Not quite.",
        sub: "It was our first hug — 7 February 2025.",
        detail: "Some dates really do stay in your head."
      }
    },
    {
      id: 7,
      type: 'emotional',
      subhead: "This one isn't really a test.",
      question: "Which memory do you think I would want to experience again?",
      options: [
        { letter: 'A', text: 'One of our random video calls' },
        { letter: 'B', text: 'The first hug' },
        { letter: 'C', text: 'The first kiss' },
        { letter: 'D', text: 'One of our completely ordinary days together' }
      ],
      correctIndex: -1,
      emotionalResponses: {
        0: [
          "You know what's funny?",
          "Those random calls where nothing special happened…",
          "somehow became some of the most special memories."
        ],
        1: [
          "That hug.",
          "I don't think I'll ever forget how that felt.",
          "Some firsts stay with you forever."
        ],
        2: [
          "Yeah.",
          "I think about that one a lot too.",
          "Some moments just… don't leave you."
        ],
        3: [
          "You know what's funny?",
          "There's no easy answer to this one.",
          "Because somehow the little ordinary moments became memories too."
        ]
      }
    },
    {
      id: 8,
      type: 'opentext',
      subhead: "You've made it this far. One last question.",
      question: "If I were sitting beside you right now, what would you tell me?",
      placeholder: "Say whatever you'd normally say to me…",
      submitLabel: "Leave this for him ❤️"
    }
  ];

  function startQuiz() {
    quizCurrentQ = 0;
    quizScore = 0;
    quizAnswers = [];
    quizEmotionalAnswer = '';
    quizFinalMessage = '';
    quizLocked = false;
    renderQuestion(0);
  }

  function renderQuestion(index) {
    const q = QUIZ_QUESTIONS[index];
    const card = document.getElementById('quiz-card');
    const progressText = document.getElementById('quiz-progress-text');
    const progressFill = document.getElementById('quiz-progress-fill');

    const qNum = String(index + 1).padStart(2, '0');
    progressText.textContent = qNum + ' / 08';
    progressFill.style.width = (((index + 1) / 8) * 100) + '%';

    card.style.animation = 'none';
    void card.offsetHeight;
    card.style.animation = 'quizCardFade 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

    quizLocked = false;

    if (q.type === 'opentext') {
      card.innerHTML = '<p class="quiz-q-subhead">Okay…</p>' +
        '<p class="quiz-q-subhead" style="margin-top:4px">' + q.subhead + '</p>' +
        '<h3 class="quiz-q-title" style="margin-top:16px">\u201C' + q.question + '\u201D</h3>' +
        '<div class="quiz-textarea-wrapper">' +
          '<textarea id="quiz-final-textarea" class="quiz-textarea" placeholder="' + q.placeholder + '" maxlength="1000" rows="4"></textarea>' +
          '<button id="btn-quiz-submit-text" class="btn-primary glow-button"><span>' + q.submitLabel + '</span></button>' +
        '</div>';

      var submitBtn = document.getElementById('btn-quiz-submit-text');
      var textarea = document.getElementById('quiz-final-textarea');

      submitBtn.addEventListener('click', function() {
        var msg = textarea.value.trim();
        if (!msg) {
          textarea.style.borderColor = 'var(--accent-pink)';
          textarea.setAttribute('placeholder', 'Please say something… anything ❤️');
          return;
        }
        quizFinalMessage = msg;
        quizAnswers.push({ question: q.question, answer: msg });
        playTone(523.25, 'sine', 0.4, 0.12);
        showResults();
      });
    } else {
      var optionsHTML = '';
      for (var i = 0; i < q.options.length; i++) {
        var opt = q.options[i];
        optionsHTML += '<button class="quiz-option-btn" data-option-index="' + i + '" aria-label="Option ' + opt.letter + ': ' + opt.text + '">' +
          '<span class="quiz-opt-letter">' + opt.letter + '</span>' +
          '<span>' + opt.text + '</span>' +
        '</button>';
      }

      card.innerHTML = '<p class="quiz-q-subhead">' + q.subhead + '</p>' +
        '<h3 class="quiz-q-title">\u201C' + q.question + '\u201D</h3>' +
        '<div class="quiz-options-list">' + optionsHTML + '</div>' +
        '<div id="quiz-feedback-area"></div>';

      var optBtns = card.querySelectorAll('.quiz-option-btn');
      for (var j = 0; j < optBtns.length; j++) {
        (function(btn) {
          btn.addEventListener('click', function() {
            if (quizLocked) return;
            quizLocked = true;
            var chosenIdx = parseInt(btn.getAttribute('data-option-index'), 10);
            handleOptionSelect(q, chosenIdx, card);
          });
        })(optBtns[j]);
      }
    }
  }

  function handleOptionSelect(q, chosenIdx, card) {
    var buttons = card.querySelectorAll('.quiz-option-btn');
    var feedbackArea = document.getElementById('quiz-feedback-area');
    var chosenOption = q.options[chosenIdx];

    quizAnswers.push({
      question: q.question,
      chosen: chosenOption.text,
      chosenIndex: chosenIdx,
      correct: q.correctIndex === -1 ? null : (chosenIdx === q.correctIndex)
    });

    if (q.type === 'emotional') {
      quizEmotionalAnswer = chosenOption.text;
      quizScore++;

      buttons[chosenIdx].classList.add('selected-correct');
      for (var i = 0; i < buttons.length; i++) {
        if (i !== chosenIdx) buttons[i].style.opacity = '0.4';
        buttons[i].style.pointerEvents = 'none';
      }

      var lines = q.emotionalResponses[chosenIdx] || q.emotionalResponses[3];
      var feedbackHTML = '<div class="quiz-feedback-box">';
      for (var k = 0; k < lines.length; k++) {
        feedbackHTML += '<p class="feedback-lead" style="opacity:0; animation: feedbackSlide 0.4s ease-out ' + (k * 0.6) + 's forwards;">' + lines[k] + '</p>';
      }
      feedbackHTML += '</div>';
      feedbackArea.innerHTML = feedbackHTML;

      playTone(523.25, 'sine', 0.3, 0.1);

      setTimeout(function() {
        nextQuestion();
      }, 2400 + lines.length * 600);

    } else {
      var isCorrect = chosenIdx === q.correctIndex;

      if (isCorrect) {
        quizScore++;
        buttons[chosenIdx].classList.add('selected-correct');
        playTone(659.25, 'sine', 0.3, 0.12);
      } else {
        buttons[chosenIdx].classList.add('selected-choice');
        buttons[q.correctIndex].classList.add('selected-correct');
        playTone(220, 'sine', 0.25, 0.08);
      }

      for (var m = 0; m < buttons.length; m++) {
        if (m !== chosenIdx && m !== q.correctIndex) buttons[m].style.opacity = '0.35';
        buttons[m].style.pointerEvents = 'none';
      }

      var fb = isCorrect ? q.feedbackCorrect : q.feedbackWrong;
      feedbackArea.innerHTML = '<div class="quiz-feedback-box">' +
        '<p class="feedback-lead">' + fb.lead + '</p>' +
        (fb.sub ? '<p class="feedback-sub">' + fb.sub + '</p>' : '') +
        (fb.detail ? '<p class="feedback-sub" style="color:var(--text-dim);font-size:0.88rem">' + fb.detail + '</p>' : '') +
        '</div>';

      setTimeout(function() {
        nextQuestion();
      }, 2200);
    }
  }

  function nextQuestion() {
    quizCurrentQ++;
    if (quizCurrentQ < QUIZ_QUESTIONS.length) {
      renderQuestion(quizCurrentQ);
    }
  }

  function showResults() {
    goToScene(12);

    // Calculate Factual Score (out of 6: Q1..Q6)
    var factualCorrect = 0;
    for (var i = 0; i < 6; i++) {
      if (quizAnswers[i] && quizAnswers[i].correct === true) factualCorrect++;
    }

    var memoryPct = Math.max(68, Math.round((factualCorrect / 6) * 100));
    var connectionPct = 96;
    var nostalgiaPct = 100;
    var couragePct = quizFinalMessage.length >= 10 ? 98 : (quizFinalMessage.length > 0 ? 88 : 75);
    var overallPct = Math.round(memoryPct * 0.4 + connectionPct * 0.2 + nostalgiaPct * 0.2 + couragePct * 0.2);

    var scorePoints = document.getElementById('score-points');
    var scoreHeading = document.getElementById('score-heading');
    var scoreMessage = document.getElementById('score-message');
    var displayHerMessage = document.getElementById('display-her-message');

    var valMem = document.getElementById('score-memory-val');
    var valConn = document.getElementById('score-connection-val');
    var valNost = document.getElementById('score-nostalgia-val');
    var valCour = document.getElementById('score-courage-val');

    var fillMem = document.getElementById('score-memory-fill');
    var fillConn = document.getElementById('score-connection-fill');
    var fillNost = document.getElementById('score-nostalgia-fill');
    var fillCour = document.getElementById('score-courage-fill');

    displayHerMessage.textContent = '“' + quizFinalMessage + '”';

    scoreHeading.textContent = '“Apparently… you remember us pretty well.”';
    scoreMessage.textContent = '“You remembered the little dates. You remembered how our story started. And apparently some things never really leave your head. 😌”';

    // Build category bars animated sequentially
    setTimeout(function() {
      valMem.textContent = memoryPct + '%';
      fillMem.style.width = memoryPct + '%';
      playTone(440, 'sine', 0.2, 0.08);
    }, 400);

    setTimeout(function() {
      valConn.textContent = connectionPct + '%';
      fillConn.style.width = connectionPct + '%';
      playTone(523.25, 'sine', 0.2, 0.08);
    }, 900);

    setTimeout(function() {
      valNost.textContent = nostalgiaPct + '%';
      fillNost.style.width = nostalgiaPct + '%';
      playTone(659.25, 'sine', 0.2, 0.08);
    }, 1400);

    setTimeout(function() {
      valCour.textContent = couragePct + '%';
      fillCour.style.width = couragePct + '%';
      playTone(783.99, 'sine', 0.2, 0.08);
    }, 1900);

    setTimeout(function() {
      scorePoints.textContent = overallPct + '%';
      playArpeggio([523.25, 659.25, 783.99, 1046.50], 100);
    }, 2400);

    var result = {
      completedAt: new Date().toISOString(),
      score: quizScore,
      memoryScore: memoryPct,
      connectionScore: connectionPct,
      nostalgiaScore: nostalgiaPct,
      courageScore: couragePct,
      overallScore: overallPct,
      selectedAnswers: quizAnswers,
      emotionalAnswers: quizEmotionalAnswer,
      favouriteMemory: quizAnswers[6] ? quizAnswers[6].chosen : '',
      finalMessage: quizFinalMessage
    };

    try {
      localStorage.setItem('shiny_quiz_result', JSON.stringify(result));
    } catch (e) {
      console.log('Could not save to localStorage', e);
    }

    submitShinyResult(result);
  }

  function openReward() {
    var scoreCard = document.getElementById('quiz-score-card');
    var rewardSection = document.getElementById('revealed-reward-section');

    scoreCard.classList.add('hidden');
    rewardSection.classList.remove('hidden');

    playArpeggio([659.25, 783.99, 1046.50, 1318.51], 80);

    var rect = rewardSection.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, rect.top + 60, 80, true);

    resetSceneScroll();

    // After quiet reading pause, gently reveal the "One more thing" teaser
    setTimeout(function() {
      var teaser = document.getElementById('continue-teaser-card');
      if (teaser) {
        teaser.classList.remove('hidden');
      }
    }, 2800);
  }

  /**
   * submitShinyResult(result)
   * Future backend / form service integration hook.
   * Stores complete result object locally.
   *
   * @param {Object} result - Quiz result containing scores, answers, messages, timestamp
   */
  function submitShinyResult(result) {
    console.log('[Shiny Love Memory Report] Saved locally:', result);
  }

  // ------------------------------------------------------------------------
  // 12. CHAPTER: ONE MORE THING (MINI MEMORY CONVERSATION - SCENE 13)
  // ------------------------------------------------------------------------
  let currentMoment = 0;
  let shinyProgress = {
    unlockedMemories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    completedMoments: [],
    additionalMemory: "",
    finalMessage: "",
    quizCompleted: true
  };

  try {
    const savedProgress = localStorage.getItem('shiny_extended_progress');
    if (savedProgress) {
      shinyProgress = Object.assign(shinyProgress, JSON.parse(savedProgress));
    }
  } catch (e) {}

  function saveProgress() {
    try {
      localStorage.setItem('shiny_extended_progress', JSON.stringify(shinyProgress));
    } catch (e) {}
  }

  const btnStayLonger = document.getElementById('btn-stay-longer');
  if (btnStayLonger) {
    btnStayLonger.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      startMomentsConversation();
      goToScene(13);
    });
  }

  function startMomentsConversation() {
    currentMoment = 0;
    renderMoment(0);
  }

  function markMomentCompleted(mIndex) {
    if (!shinyProgress.completedMoments.includes(mIndex)) {
      shinyProgress.completedMoments.push(mIndex);
    }
    saveProgress();
  }

  function renderMoment(index) {
    currentMoment = index;
    markMomentCompleted(index);
    const container = document.getElementById('moment-card-container');
    const stepText = document.getElementById('moment-step-counter');
    const stepFill = document.getElementById('moment-progress-fill');

    const num = String(index + 1).padStart(2, '0');
    if (stepText) stepText.textContent = num + ' / 08';
    if (stepFill) stepFill.style.width = (((index + 1) / 8) * 100) + '%';

    resetSceneScroll();

    if (index === 0) {
      // MOMENT 1: Pick one
      container.innerHTML = `
        <div class="glass-card moment-card">
          <span class="moment-lead-tag">✦ MOMENT 01 ✦</span>
          <h3 class="moment-title">“Pick one.”</h3>
          <p class="moment-subtext">There's no right answer. Just what feels closest to you right now.</p>
          <div class="moment-options-list">
            <button class="moment-opt-btn" data-choice="0">A random video call</button>
            <button class="moment-opt-btn" data-choice="1">Going somewhere together</button>
            <button class="moment-opt-btn" data-choice="2">Sitting next to each other doing nothing</button>
            <button class="moment-opt-btn" data-choice="3">A completely unexpected moment</button>
          </div>
          <div id="moment-reaction-box" class="hidden"></div>
        </div>
      `;

      const btns = container.querySelectorAll('.moment-opt-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => { b.disabled = true; b.style.opacity = '0.4'; });
          btn.style.opacity = '1';
          btn.classList.add('active-choice');
          const choice = btn.getAttribute('data-choice');
          const reactions = [
            "Honestly… those calls somehow became some of the closest moments.",
            "Yeah. Anywhere we went felt different just because it was with you.",
            "Honestly… I think I'd choose the ordinary moments. Those somehow became my favourite ones.",
            "Yeah… the moments we didn't plan were the ones that stayed."
          ];
          const rBox = document.getElementById('moment-reaction-box');
          rBox.className = 'moment-reaction-box';
          rBox.innerHTML = `
            <p class="reaction-text">“${reactions[choice] || reactions[2]}”</p>
            <p class="reaction-sub">Those somehow became my favourite ones.</p>
            <button id="btn-next-moment-1" class="btn-primary glow-button" style="margin-top:10px;">
              <span>Continue →</span>
            </button>
          `;
          document.getElementById('btn-next-moment-1').addEventListener('click', () => {
            renderMoment(1);
          });
        });
      });

    } else if (index === 1) {
      // MOMENT 2: Memory Card
      container.innerHTML = `
        <div class="glass-card moment-card">
          <span class="moment-lead-tag">✦ MOMENT 02 ✦</span>
          <h3 class="moment-title">“There’s a memory hiding here.”</h3>
          <p class="moment-subtext">Something quiet from one of our days.</p>
          <div id="card-reveal-area">
            <button id="btn-open-hidden-card" class="btn-primary glow-button" style="margin:20px 0;">
              <span>Open it ✉️</span>
            </button>
          </div>
        </div>
      `;

      document.getElementById('btn-open-hidden-card').addEventListener('click', () => {
        const revealArea = document.getElementById('card-reveal-area');
        revealArea.innerHTML = `
          <div class="moment-photo-wrapper frame-handwritten" style="margin-top:14px;">
            <img src="assets/photos/photo-14.jpg" alt="Holding hands in auto" class="journey-img">
          </div>
          <p class="reaction-text" style="margin-top:12px;">“I still remember this.”</p>
          <p class="reaction-sub">“One of those little moments I didn't want to forget.”</p>
          <button id="btn-next-moment-2" class="btn-primary glow-button" style="margin-top:16px;">
            <span>Continue →</span>
          </button>
        `;
        playArpeggio([523.25, 659.25, 783.99], 90);
        document.getElementById('btn-next-moment-2').addEventListener('click', () => {
          renderMoment(2);
        });
      });

    } else if (index === 2) {
      // MOMENT 3: If we could...
      container.innerHTML = `
        <div class="glass-card moment-card">
          <span class="moment-lead-tag">✦ MOMENT 03 ✦</span>
          <p class="moment-subtext">Okay, imagine this…</p>
          <h3 class="moment-title">“If we could disappear somewhere for one day…”</h3>
          <div class="moment-options-list">
            <button class="moment-opt-btn" data-choice="0">Beach</button>
            <button class="moment-opt-btn" data-choice="1">Long drive</button>
            <button class="moment-opt-btn" data-choice="2">Movie + food</button>
            <button class="moment-opt-btn" data-choice="3">Somewhere neither of us has been</button>
          </div>
          <div id="moment-reaction-box" class="hidden"></div>
        </div>
      `;

      const btns = container.querySelectorAll('.moment-opt-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => { b.disabled = true; b.style.opacity = '0.4'; });
          btn.style.opacity = '1';
          btn.classList.add('active-choice');
          const rBox = document.getElementById('moment-reaction-box');
          rBox.className = 'moment-reaction-box';
          rBox.innerHTML = `
            <p class="reaction-text">“Hmm… I'd probably go with that too.”</p>
            <p class="reaction-sub">“But honestly, I think I'd be happy anywhere if you were there.”</p>
            <button id="btn-next-moment-3" class="btn-primary glow-button" style="margin-top:12px;">
              <span>Next moment →</span>
            </button>
          `;
          document.getElementById('btn-next-moment-3').addEventListener('click', () => {
            renderMoment(3);
          });
        });
      });

    } else if (index === 3) {
      // MOMENT 4: Choose a memory
      container.innerHTML = `
        <div class="glass-card moment-card">
          <span class="moment-lead-tag">✦ MOMENT 04 ✦</span>
          <h3 class="moment-title">“Choose a memory.”</h3>
          <p class="moment-subtext">Pick whichever one catches your eye first:</p>
          <div class="mystery-cards-stack">
            <button class="mystery-card-btn" data-photo="2" data-line="“Yeah… this one.”">
              <span>The cute one</span> <span>↗</span>
            </button>
            <button class="mystery-card-btn" data-photo="4" data-line="“I knew you'd pick this.”">
              <span>The chaotic one</span> <span>↗</span>
            </button>
            <button class="mystery-card-btn" data-photo="1" data-line="“This one still gets me.”">
              <span>The soft one</span> <span>↗</span>
            </button>
            <button class="mystery-card-btn" data-photo="6" data-line="“Some moments just don't fade.”">
              <span>The one I still think about</span> <span>↗</span>
            </button>
            <button class="mystery-card-btn" data-photo="12" data-line="“Makes me smile every single time.”">
              <span>The one that makes me smile</span> <span>↗</span>
            </button>
          </div>
          <div id="mystery-reveal-box" class="hidden"></div>
        </div>
      `;

      const mBtns = container.querySelectorAll('.mystery-card-btn');
      mBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          mBtns.forEach(b => b.style.display = 'none');
          const pId = String(btn.getAttribute('data-photo')).padStart(2, '0');
          const line = btn.getAttribute('data-line');
          const rBox = document.getElementById('mystery-reveal-box');
          rBox.className = 'mystery-reveal-box';
          rBox.innerHTML = `
            <div class="moment-photo-wrapper frame-cinematic">
              <img src="assets/photos/photo-${pId}.jpg" alt="Memory choice" class="journey-img">
            </div>
            <p class="reaction-text">${line}</p>
            <button id="btn-next-moment-4" class="btn-primary glow-button" style="margin-top:14px;">
              <span>Continue →</span>
            </button>
          `;
          playTone(659.25, 'sine', 0.3, 0.1);
          document.getElementById('btn-next-moment-4').addEventListener('click', () => {
            renderMoment(4);
          });
        });
      });

    } else if (index === 4) {
      // MOMENT 5: Tell me something
      container.innerHTML = `
        <div class="glass-card moment-card">
          <span class="moment-lead-tag">✦ MOMENT 05 ✦</span>
          <p class="moment-subtext">Your turn.</p>
          <h3 class="moment-title">“Tell me one tiny thing you remember about us that I didn't put on this website.”</h3>
          <div class="quiz-textarea-wrapper">
            <textarea id="moment-memory-textarea" class="quiz-textarea" placeholder="It can be something completely random…" maxlength="1000" rows="4"></textarea>
            <button id="btn-submit-additional-memory" class="btn-primary glow-button">
              <span>I'll remember this ❤️</span>
            </button>
          </div>
          <div id="moment-5-feedback" class="hidden"></div>
        </div>
      `;

      const sBtn = document.getElementById('btn-submit-additional-memory');
      const ta = document.getElementById('moment-memory-textarea');
      if (ta && shinyProgress.additionalMemory) {
        ta.value = shinyProgress.additionalMemory;
      }
      sBtn.addEventListener('click', () => {
        const textVal = ta.value.trim();
        if (!textVal) {
          ta.style.borderColor = 'var(--accent-pink)';
          ta.setAttribute('placeholder', 'Tell me even the tiniest random thing ❤️');
          return;
        }
        shinyProgress.additionalMemory = textVal;
        saveProgress();
        try {
          const raw = localStorage.getItem('shiny_quiz_result');
          if (raw) {
            const parsed = JSON.parse(raw);
            parsed.additionalMemory = textVal;
            localStorage.setItem('shiny_quiz_result', JSON.stringify(parsed));
          }
        } catch (e) {}

        const fb = document.getElementById('moment-5-feedback');
        fb.className = 'moment-reaction-box';
        fb.innerHTML = `
          <p class="reaction-text">“Thank you for telling me that.”</p>
          <p class="reaction-sub">“I'm keeping this one right here.”</p>
          <button id="btn-next-moment-5" class="btn-primary glow-button" style="margin-top:12px;">
            <span>Next moment →</span>
          </button>
        `;
        playTone(523.25, 'sine', 0.35, 0.12);
        sBtn.style.display = 'none';
        ta.disabled = true;
        document.getElementById('btn-next-moment-5').addEventListener('click', () => {
          renderMoment(5);
        });
      });

    } else if (index === 5) {
      // MOMENT 6: Little choice
      container.innerHTML = `
        <div class="glass-card moment-card">
          <span class="moment-lead-tag">✦ MOMENT 06 ✦</span>
          <p class="moment-subtext">One last choice.</p>
          <h3 class="moment-title">“What do you think I miss the most?”</h3>
          <div class="moment-options-list">
            <button class="moment-opt-btn">Your smile</button>
            <button class="moment-opt-btn">Our conversations</button>
            <button class="moment-opt-btn">The random little moments</button>
            <button class="moment-opt-btn">Being beside you</button>
          </div>
          <div id="moment-reaction-box" class="hidden"></div>
        </div>
      `;

      const btns = container.querySelectorAll('.moment-opt-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => { b.disabled = true; b.style.opacity = '0.4'; });
          btn.style.opacity = '1';
          btn.classList.add('active-choice');
          const rBox = document.getElementById('moment-reaction-box');
          rBox.className = 'moment-reaction-box';
          rBox.innerHTML = `
            <p class="reaction-text">“Maybe.”</p>
            <p class="reaction-sub">“But I think it's actually all the little things together.”</p>
            <button id="btn-next-moment-6" class="btn-primary glow-button" style="margin-top:12px;">
              <span>Next moment →</span>
            </button>
          `;
          document.getElementById('btn-next-moment-6').addEventListener('click', () => {
            renderMoment(6);
          });
        });
      });

    } else if (index === 6) {
      // MOMENT 7: Another hidden photo
      container.innerHTML = `
        <div class="glass-card moment-card">
          <span class="moment-lead-tag">✦ MOMENT 07 ✦</span>
          <span class="featured-badge" style="margin-bottom:12px;">🔐 ANOTHER MEMORY</span>
          <h3 class="moment-title">“You found another one.”</h3>
          <div id="moment-7-reveal-area">
            <button id="btn-unlock-m7" class="btn-primary glow-button" style="margin:20px 0;">
              <span>Unlock it ✦</span>
            </button>
          </div>
        </div>
      `;

      document.getElementById('btn-unlock-m7').addEventListener('click', () => {
        const area = document.getElementById('moment-7-reveal-area');
        area.innerHTML = `
          <div class="moment-photo-wrapper frame-polaroid" style="margin-top:14px;">
            <img src="assets/photos/photo-15.jpg" alt="Warm shoulder hug memory" class="journey-img">
          </div>
          <p class="reaction-text" style="margin-top:14px;">“I didn't want this one to disappear into my camera roll.”</p>
          <button id="btn-next-moment-7" class="btn-primary glow-button" style="margin-top:16px;">
            <span>Continue →</span>
          </button>
        `;
        playArpeggio([523.25, 659.25, 783.99, 1046.50], 90);
        document.getElementById('btn-next-moment-7').addEventListener('click', () => {
          renderMoment(7);
        });
      });

    } else if (index === 7) {
      // MOMENT 8: A message from me
      container.innerHTML = `
        <div class="glass-card moment-card">
          <span class="moment-lead-tag">✦ MOMENT 08 ✦</span>
          <div class="final-words-lines" style="margin-top:10px;">
            <p class="fw-line" style="opacity:0; animation: feedbackSlide 0.5s ease-out 0.2s forwards;">“I don't know when all these little things started becoming memories I cared about this much.”</p>
            <p class="fw-line highlight-fw" style="opacity:0; animation: feedbackSlide 0.5s ease-out 1.4s forwards;">“But somewhere along the way…”</p>
            <p class="fw-line highlight-fw" style="opacity:0; animation: feedbackSlide 0.5s ease-out 2.6s forwards;">“they did.”</p>
            <p class="fw-line" style="opacity:0; animation: feedbackSlide 0.5s ease-out 3.8s forwards;">“And I guess that's why I made all this.”</p>
          </div>
          <div class="glow-divider" style="margin:20px auto;"></div>
          <div style="opacity:0; animation: feedbackSlide 0.6s ease-out 4.8s forwards;">
            <p class="reaction-text" style="margin-bottom:12px;">“I still have more to tell you.”</p>
            <button id="btn-keep-going-future" class="btn-primary glow-button">
              <span>Keep going ❤️</span>
            </button>
          </div>
        </div>
      `;

      setTimeout(() => {
        const kgBtn = document.getElementById('btn-keep-going-future');
        if (kgBtn) {
          kgBtn.addEventListener('click', () => {
            initAudio();
            goToScene(14);
          });
        }
      }, 500);
    }
  }

  // ------------------------------------------------------------------------
  // 13. CHAPTER: OUR LITTLE FUTURE (SCENE 14) & REPLAY HUB
  // ------------------------------------------------------------------------
  // Future card tap note reveals
  document.querySelectorAll('.future-card').forEach(card => {
    card.addEventListener('click', () => {
      const note = card.querySelector('.future-hidden-note');
      if (note) {
        note.classList.toggle('hidden');
        playTone(523.25, 'sine', 0.2, 0.06);
      }
    });
  });

  // Replay memory button ("One more? 👀")
  const btnReplayMemory = document.getElementById('btn-replay-memory');
  if (btnReplayMemory) {
    btnReplayMemory.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      const randomIds = [1, 5, 6, 7, 9, 11, 14, 15];
      const pick = randomIds[Math.floor(Math.random() * randomIds.length)];
      openLightbox(pick);
    });
  }

  // Final farewell confirmation button ("I'm here ❤️")
  const btnFinalFarewell = document.getElementById('btn-final-farewell');
  if (btnFinalFarewell) {
    btnFinalFarewell.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      const fb = document.getElementById('farewell-final-box');
      if (fb) {
        fb.classList.remove('hidden');
        btnFinalFarewell.style.display = 'none';
        playArpeggio([523.25, 659.25, 783.99, 1046.50, 1318.51], 90);
        resetSceneScroll();
      }
    });
  }

  // Restart journey button ("Start our story again ↺")
  const btnRestartJourney = document.getElementById('btn-restart-journey');
  if (btnRestartJourney) {
    btnRestartJourney.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      goToScene(1);
    });
  }

  // ------------------------------------------------------------------------
  // 14. GLOBAL KEYBOARD ACCESSIBILITY & NAVIGATION GUARDS
  // ------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      document.body.style.overflow = '';
      if (easterEggModal) easterEggModal.classList.add('hidden');
      return;
    }

    // STRICT CHECK: Keyboard arrow navigation is strictly locked until password 9226 is validated
    if (!isAuthenticated) return;

    // Arrow keys allow navigating between scenes 1 and 14
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (currentScene >= 1 && currentScene < 14) {
        e.preventDefault();
        goToScene(currentScene + 1);
      }
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (currentScene > 1 && currentScene <= 14) {
        e.preventDefault();
        goToScene(currentScene - 1);
      }
    }
  });

});
