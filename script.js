/**
 * UPPALA HEMANSH 1ST BIRTHDAY ALBUM
 * Interactive Engine: Page Navigation, Canvas Background, Web Audio Synthesizer,
 * Floating Balloons, Confetti Cannon, Lightbox, and Wishes System.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. PAGE NAVIGATION (COVER <-> ALBUM)
  // =========================================================================
  const coverPage = document.getElementById('cover-page');
  const albumPage = document.getElementById('album-page');
  const btnGotoAlbum = document.getElementById('btn-goto-album');
  const btnBackCover = document.getElementById('btn-back-cover');
  const btnFooterBack = document.getElementById('btn-footer-back');

  function showPage(pageName, triggerCelebration = false) {
    if (pageName === 'album') {
      coverPage.classList.remove('active-view');
      coverPage.classList.add('hidden-view');
      
      setTimeout(() => {
        coverPage.style.display = 'none';
        albumPage.style.display = 'block';
        setTimeout(() => {
          albumPage.classList.remove('hidden-view');
          albumPage.classList.add('active-view');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 30);
      }, 300);

      window.location.hash = 'album';
      if (triggerCelebration) {
        triggerConfetti(60);
        soundEngine.playSparkle();
      }
    } else {
      albumPage.classList.remove('active-view');
      albumPage.classList.add('hidden-view');

      setTimeout(() => {
        albumPage.style.display = 'none';
        coverPage.style.display = 'flex';
        setTimeout(() => {
          coverPage.classList.remove('hidden-view');
          coverPage.classList.add('active-view');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 30);
      }, 300);

      window.location.hash = 'cover';
    }
  }

  btnGotoAlbum?.addEventListener('click', () => {
    soundEngine.initAudio();
    showPage('album', true);
  });

  btnBackCover?.addEventListener('click', () => {
    showPage('cover');
  });

  btnFooterBack?.addEventListener('click', () => {
    showPage('cover');
  });

  // Handle hash on initial load
  if (window.location.hash === '#album') {
    coverPage.style.display = 'none';
    coverPage.classList.remove('active-view');
    coverPage.classList.add('hidden-view');
    albumPage.style.display = 'block';
    albumPage.classList.remove('hidden-view');
    albumPage.classList.add('active-view');
  }


  // =========================================================================
  // 2. WEB AUDIO API SYNTHESIZER (MUSIC BOX & SOUND EFFECTS)
  // =========================================================================
  class SoundEngine {
    constructor() {
      this.audioCtx = null;
      this.isPlaying = false;
      this.noteIndex = 0;
      this.musicTimer = null;
      
      // Happy Birthday Melody in F Major / C Major (Note frequencies in Hz)
      this.melody = [
        { note: 'G4', freq: 392.00, dur: 0.35, pause: 0.05 },
        { note: 'G4', freq: 392.00, dur: 0.25, pause: 0.05 },
        { note: 'A4', freq: 440.00, dur: 0.60, pause: 0.10 },
        { note: 'G4', freq: 392.00, dur: 0.60, pause: 0.10 },
        { note: 'C5', freq: 523.25, dur: 0.60, pause: 0.10 },
        { note: 'B4', freq: 493.88, dur: 1.10, pause: 0.30 },

        { note: 'G4', freq: 392.00, dur: 0.35, pause: 0.05 },
        { note: 'G4', freq: 392.00, dur: 0.25, pause: 0.05 },
        { note: 'A4', freq: 440.00, dur: 0.60, pause: 0.10 },
        { note: 'G4', freq: 392.00, dur: 0.60, pause: 0.10 },
        { note: 'D5', freq: 587.33, dur: 0.60, pause: 0.10 },
        { note: 'C5', freq: 523.25, dur: 1.10, pause: 0.30 },

        { note: 'G4', freq: 392.00, dur: 0.35, pause: 0.05 },
        { note: 'G4', freq: 392.00, dur: 0.25, pause: 0.05 },
        { note: 'G5', freq: 783.99, dur: 0.60, pause: 0.10 },
        { note: 'E5', freq: 659.25, dur: 0.60, pause: 0.10 },
        { note: 'C5', freq: 523.25, dur: 0.50, pause: 0.10 },
        { note: 'B4', freq: 493.88, dur: 0.50, pause: 0.10 },
        { note: 'A4', freq: 440.00, dur: 0.90, pause: 0.25 },

        { note: 'F5', freq: 698.46, dur: 0.35, pause: 0.05 },
        { note: 'F5', freq: 698.46, dur: 0.25, pause: 0.05 },
        { note: 'E5', freq: 659.25, dur: 0.60, pause: 0.10 },
        { note: 'C5', freq: 523.25, dur: 0.60, pause: 0.10 },
        { note: 'D5', freq: 587.33, dur: 0.60, pause: 0.10 },
        { note: 'C5', freq: 523.25, dur: 1.30, pause: 0.60 },
      ];
    }

    initAudio() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    playMusicBoxNote(freq, duration) {
      if (!this.audioCtx || this.audioCtx.state === 'suspended') return;

      const now = this.audioCtx.currentTime;
      
      // Primary chime oscillator (sine)
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.01, now); // Sweet bell harmonic

      // Music box envelope
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    }

    startMelody() {
      this.initAudio();
      this.isPlaying = true;
      this.noteIndex = 0;
      this.playNextStep();
    }

    playNextStep() {
      if (!this.isPlaying) return;

      const item = this.melody[this.noteIndex];
      this.playMusicBoxNote(item.freq, item.dur);

      const totalTimeMs = (item.dur + item.pause) * 1000;
      this.noteIndex = (this.noteIndex + 1) % this.melody.length;

      this.musicTimer = setTimeout(() => {
        this.playNextStep();
      }, totalTimeMs);
    }

    stopMelody() {
      this.isPlaying = false;
      if (this.musicTimer) {
        clearTimeout(this.musicTimer);
        this.musicTimer = null;
      }
    }

    playSparkle() {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((f, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);
        gain.gain.setValueAtTime(0.08, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    }

    playPop() {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  const soundEngine = new SoundEngine();

  // Music toggle button wiring
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  const musicLabel = btnMusicToggle?.querySelector('.music-label');

  btnMusicToggle?.addEventListener('click', () => {
    soundEngine.initAudio();
    if (soundEngine.isPlaying) {
      soundEngine.stopMelody();
      btnMusicToggle.classList.add('muted-wave');
      if (musicLabel) musicLabel.textContent = 'Music: OFF';
    } else {
      soundEngine.startMelody();
      btnMusicToggle.classList.remove('muted-wave');
      if (musicLabel) musicLabel.textContent = 'Music: ON';
    }
  });

  // Enable audio on first user touch / click anywhere on page
  const unlockAudio = () => {
    soundEngine.initAudio();
    if (!soundEngine.isPlaying) {
      soundEngine.startMelody();
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click', unlockAudio, { once: true });
  document.addEventListener('touchstart', unlockAudio, { once: true });


  // =========================================================================
  // 3. ANIMATED DYNAMIC BACKGROUND CANVAS
  // =========================================================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouseParticles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const colors = [
    'rgba(255, 215, 0, ',    // Gold
    'rgba(251, 113, 133, ',  // Pink
    'rgba(192, 132, 252, ',  // Purple
    'rgba(56, 189, 248, ',   // Cyan
    'rgba(255, 255, 255, '   // White sparkle
  ];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = -Math.random() * 0.8 - 0.2;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.6 + 0.2;
      this.alphaSpeed = (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1);
      this.shape = Math.random() > 0.7 ? 'star' : 'circle';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha += this.alphaSpeed;

      if (this.alpha <= 0.1 || this.alpha >= 0.85) {
        this.alphaSpeed = -this.alphaSpeed;
      }

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
        this.y = height + 10;
      }
    }

    draw() {
      ctx.fillStyle = this.colorBase + this.alpha + ')';
      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw 4-point sparkle star
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.lineTo(this.size * 2, 0);
          ctx.lineTo(this.size * 0.5, this.size * 0.5);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // Create initial background particles
  for (let i = 0; i < 65; i++) {
    particles.push(new Particle());
  }

  // Interactive mouse sparkle trail
  window.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 2; i++) {
      mouseParticles.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 1
      });
    }
    if (mouseParticles.length > 50) mouseParticles.shift();
  });

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    // Render ambient floating particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Render interactive cursor trail
    for (let i = mouseParticles.length - 1; i >= 0; i--) {
      const mp = mouseParticles[i];
      mp.x += mp.speedX;
      mp.y += mp.speedY;
      mp.life -= 0.03;
      mp.alpha = Math.max(0, mp.life);

      if (mp.life <= 0) {
        mouseParticles.splice(i, 1);
      } else {
        ctx.fillStyle = mp.color + mp.alpha + ')';
        ctx.beginPath();
        ctx.arc(mp.x, mp.y, mp.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();


  // =========================================================================
  // 4. INTERACTIVE FLOATING BALLOONS & POPPING SYSTEM
  // =========================================================================
  const balloonContainer = document.getElementById('balloon-container');
  const balloonGradients = [
    'radial-gradient(circle at 30% 30%, #ffd700, #b45309)',
    'radial-gradient(circle at 30% 30%, #fb7185, #be123c)',
    'radial-gradient(circle at 30% 30%, #38bdf8, #1d4ed8)',
    'radial-gradient(circle at 30% 30%, #c084fc, #7e22ce)',
    'radial-gradient(circle at 30% 30%, #34d399, #047857)',
    'radial-gradient(circle at 30% 30%, #f472b6, #db2777)'
  ];

  function spawnBalloon() {
    if (!balloonContainer) return;
    if (balloonContainer.children.length >= 10) return; // Prevent excess DOM

    const balloon = document.createElement('div');
    balloon.className = 'floating-balloon';
    
    const randomLeft = Math.random() * 90 + 5; // 5% to 95%
    const randomDuration = Math.random() * 6 + 9; // 9s to 15s
    const randomDelay = Math.random() * 2;
    const randomScale = Math.random() * 0.4 + 0.8;
    const randomGradient = balloonGradients[Math.floor(Math.random() * balloonGradients.length)];

    balloon.style.left = `${randomLeft}vw`;
    balloon.style.background = randomGradient;
    balloon.style.animationDuration = `${randomDuration}s`;
    balloon.style.animationDelay = `${randomDelay}s`;
    balloon.style.transform = `scale(${randomScale})`;

    // Balloon pop on click
    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEngine.playPop();
      burstBalloonParticles(e.clientX, e.clientY);
      balloon.remove();
    });

    balloonContainer.appendChild(balloon);

    // Auto remove after animation completes
    setTimeout(() => {
      if (balloon.parentNode) balloon.remove();
    }, (randomDuration + randomDelay + 1) * 1000);
  }

  // Spawn periodic balloons
  setInterval(spawnBalloon, 2200);
  for (let i = 0; i < 4; i++) {
    setTimeout(spawnBalloon, i * 600);
  }

  // Trigger manual balloons button
  const btnTriggerBalloons = document.getElementById('btn-trigger-balloons');
  btnTriggerBalloons?.addEventListener('click', () => {
    for (let i = 0; i < 6; i++) {
      setTimeout(spawnBalloon, i * 200);
    }
    soundEngine.playSparkle();
  });


  // =========================================================================
  // 5. CONFETTI CANNON & PARTICLE BURST
  // =========================================================================
  const confettiPalette = ['#ffd700', '#f59e0b', '#fb7185', '#e11d48', '#38bdf8', '#a855f7', '#10b981', '#ffffff'];

  function triggerConfetti(count = 70) {
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      
      const startX = Math.random() * window.innerWidth;
      const startY = -20;
      const color = confettiPalette[Math.floor(Math.random() * confettiPalette.length)];
      const duration = Math.random() * 2.5 + 2.0; // 2s to 4.5s
      const delay = Math.random() * 0.6;
      const width = Math.random() * 8 + 6;
      const height = Math.random() * 12 + 8;

      confetti.style.left = `${startX}px`;
      confetti.style.top = `${startY}px`;
      confetti.style.backgroundColor = color;
      confetti.style.width = `${width}px`;
      confetti.style.height = `${height}px`;
      confetti.style.animationDuration = `${duration}s`;
      confetti.style.animationDelay = `${delay}s`;

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, (duration + delay + 0.5) * 1000);
    }
  }

  function burstBalloonParticles(x, y) {
    for (let i = 0; i < 20; i++) {
      const piece = document.createElement('div');
      piece.style.position = 'fixed';
      piece.style.left = `${x}px`;
      piece.style.top = `${y}px`;
      piece.style.width = '8px';
      piece.style.height = '8px';
      piece.style.borderRadius = '50%';
      piece.style.backgroundColor = confettiPalette[Math.floor(Math.random() * confettiPalette.length)];
      piece.style.pointerEvents = 'none';
      piece.style.zIndex = '9999';

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 120 + 40;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity;

      piece.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
      document.body.appendChild(piece);

      requestAnimationFrame(() => {
        piece.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
        piece.style.opacity = '0';
      });

      setTimeout(() => piece.remove(), 700);
    }
  }

  // Blast Confetti Top Nav Button
  const btnConfettiBlast = document.getElementById('btn-confetti-blast');
  btnConfettiBlast?.addEventListener('click', () => {
    triggerConfetti(90);
    soundEngine.playSparkle();
  });


  // =========================================================================
  // 6. PHOTO LIGHTBOX MODAL (FULLSCREEN HD ZOOM)
  // =========================================================================
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  function openLightbox(src, caption) {
    if (!lightboxModal) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    soundEngine.playSparkle();
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Zoom buttons
  document.querySelectorAll('.btn-zoom').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgPath = btn.getAttribute('data-img');
      const caption = btn.getAttribute('data-caption');
      openLightbox(imgPath, caption);
    });
  });

  // Direct card / image click
  document.querySelectorAll('.photo-frame').forEach(frame => {
    frame.addEventListener('click', () => {
      const zoomBtn = frame.querySelector('.btn-zoom');
      if (zoomBtn) {
        const imgPath = zoomBtn.getAttribute('data-img');
        const caption = zoomBtn.getAttribute('data-caption');
        openLightbox(imgPath, caption);
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });


  // =========================================================================
  // 7. 3D CARD TILT EFFECT (DESKTOP)
  // =========================================================================
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(cardWrapper => {
    const frame = cardWrapper.querySelector('.photo-frame');
    if (!frame) return;

    cardWrapper.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return; // Disable on small mobile
      const rect = cardWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    cardWrapper.addEventListener('mouseleave', () => {
      frame.style.transform = '';
    });
  });


  // =========================================================================
  // 8. INTERACTIVE BIRTHDAY WISHES FORM & LIVE WALL
  // =========================================================================
  const wishForm = document.getElementById('wish-form');
  const wishesWall = document.getElementById('wishes-wall');

  // Load stored wishes from LocalStorage if available
  const storedWishes = JSON.parse(localStorage.getItem('hemansh_birthday_wishes') || '[]');
  storedWishes.forEach(item => {
    appendWishCard(item.name, item.relation, item.message, item.time, false);
  });

  function appendWishCard(name, relation, message, timeStr, animate = true) {
    if (!wishesWall) return;

    const card = document.createElement('div');
    card.className = 'wish-card';
    if (!animate) card.style.animation = 'none';

    card.innerHTML = `
      <div class="wish-header">
        <span class="wish-sender"><i class="fa-solid fa-heart text-pink"></i> ${escapeHTML(name)}</span>
        <span class="wish-badge">${escapeHTML(relation)}</span>
      </div>
      <p class="wish-body">"${escapeHTML(message)}"</p>
      <span class="wish-time">${escapeHTML(timeStr)}</span>
    `;

    wishesWall.prepend(card);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  wishForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('sender-name');
    const relationInput = document.getElementById('sender-relation');
    const messageInput = document.getElementById('wish-message');

    const name = nameInput.value.trim();
    const relation = relationInput.value;
    const message = messageInput.value.trim();

    if (!name || !message) return;

    const now = new Date();
    const timeStr = `${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ${now.getFullYear()}`;

    // Add to UI
    appendWishCard(name, relation, message, timeStr, true);

    // Save to LocalStorage
    storedWishes.push({ name, relation, message, time: timeStr });
    localStorage.setItem('hemansh_birthday_wishes', JSON.stringify(storedWishes));

    // Reset Form
    nameInput.value = '';
    messageInput.value = '';

    // Trigger celebration effects
    triggerConfetti(80);
    soundEngine.playSparkle();

    // Scroll to top of wall
    wishesWall.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
