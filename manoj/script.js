document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // 1. DYNAMIC SCROLL BACKGROUND OBSERVER & NAV SPY
  // ===================================================================
  const sections = document.querySelectorAll('section[data-theme]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navLinksContainer = document.getElementById('navLinks');
  const navIndicator = document.getElementById('navIndicator');
  const siteHeader = document.getElementById('siteHeader');

  // Slide indicator to active link
  function updateNavIndicator(activeLink) {
    if (!navIndicator || !navLinksContainer || !activeLink) return;
    // Don't update indicator if container is hidden 
    if (window.innerWidth <= 768) {
      navIndicator.style.opacity = '0';
      return;
    }

    const containerRect = navLinksContainer.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    const left = linkRect.left - containerRect.left;
    const width = linkRect.width;

    navIndicator.style.left = `${left}px`;
    navIndicator.style.width = `${width}px`;
    navIndicator.style.opacity = '1';
  }

  // Initialize indicator on page load
  const initialActiveLink = document.querySelector('.nav-link.active') || navLinks[0];
  if (initialActiveLink) {
    // Wait for fonts & layout to settle
    setTimeout(() => {
      updateNavIndicator(initialActiveLink);
    }, 100);
  }

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.nav-link.active');
    if (currentActive) updateNavIndicator(currentActive);
  }, { passive: true });

  // Intersection Observer for scroll background & nav spy
  const observerOptions = {
    root: null,
    rootMargin: '-15% 0px -45% 0px', // Triggers gracefully as section enters middle viewport
    threshold: 0.05
  };

  let isManualNavClick = false;

  const sectionObserver = new IntersectionObserver((entries) => {
    if (isManualNavClick) return; // Prevent scroll spy jump during programmatic smooth scroll

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const theme = entry.target.getAttribute('data-theme');
        const sectionId = entry.target.id;

        // 1. Update body theme attribute for visible ambient background transition
        if (theme) {
          document.body.setAttribute('data-active-theme', theme);
        }

        // 2. Update active nav link and smoothly slide the pill indicator
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${sectionId}`) {
            link.classList.add('active');
            updateNavIndicator(link);
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // Smooth sliding nav link click animation
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      isManualNavClick = true;

      // Animate active state and slide indicator immediately
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      updateNavIndicator(link);

      // Update background theme immediately for that target section
      const targetId = link.getAttribute('href').replace('#', '');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        const targetTheme = targetSection.getAttribute('data-theme');
        if (targetTheme) {
          document.body.setAttribute('data-active-theme', targetTheme);
        }
      }

      // Re-enable observer after smooth scroll settles
      setTimeout(() => {
        isManualNavClick = false;
      }, 750);
    });
  });

  // Header elevation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // ===================================================================
  // 2. MOBILE NAVIGATION MENU TOGGLE
  // ===================================================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking any navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }



  // ===================================================================
  // 4. ONE-CLICK EMAIL & PHONE COPY HANDLERS
  // ===================================================================
  // Email Copy
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const userEmailText = document.getElementById('userEmailText');

  if (copyEmailBtn && copyBtnText && userEmailText) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = userEmailText.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        copyBtnText.textContent = 'Copied! ✓';
        copyEmailBtn.classList.add('btn-primary');
        copyEmailBtn.classList.remove('btn-secondary');

        setTimeout(() => {
          copyBtnText.textContent = 'Copy';
          copyEmailBtn.classList.remove('btn-primary');
          copyEmailBtn.classList.add('btn-secondary');
        }, 2200);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copyBtnText.textContent = 'Copied! ✓';
        setTimeout(() => {
          copyBtnText.textContent = 'Copy';
        }, 2200);
      }
    });
  }

  // Phone Copy
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  const copyPhoneBtnText = document.getElementById('copyPhoneBtnText');
  const userPhoneText = document.getElementById('userPhoneText');

  if (copyPhoneBtn && copyPhoneBtnText && userPhoneText) {
    copyPhoneBtn.addEventListener('click', async () => {
      const phone = userPhoneText.textContent.trim();
      try {
        await navigator.clipboard.writeText(phone);
        copyPhoneBtnText.textContent = 'Copied! ✓';
        copyPhoneBtn.classList.add('btn-primary');
        copyPhoneBtn.classList.remove('btn-secondary');

        setTimeout(() => {
          copyPhoneBtnText.textContent = 'Copy';
          copyPhoneBtn.classList.remove('btn-primary');
          copyPhoneBtn.classList.add('btn-secondary');
        }, 2200);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = phone;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copyPhoneBtnText.textContent = 'Copied! ✓';
        setTimeout(() => {
          copyPhoneBtnText.textContent = 'Copy';
        }, 2200);
      }
    });
  }

  // ===================================================================
  // 5. SCROLL-TRIGGERED CARD REVEAL ANIMATIONS
  // ===================================================================
  const revealCards = document.querySelectorAll(
    '.about-card, .skill-category-card, .timeline-card, .project-card, .edu-card, .certifications-card, .contact-card'
  );

  if ('IntersectionObserver' in window && revealCards.length > 0) {
    revealCards.forEach((card) => {
      card.classList.add('reveal-on-scroll');
    });

    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    revealCards.forEach((card) => {
      cardObserver.observe(card);
    });
  }

  // ===================================================================
  // 5. WAVY WATER DROP ENGINE & CIRCUIT SPOTLIGHT (UNDER CONTENT)
  // ===================================================================
  const wavyDrop = document.getElementById('wavyWaterDrop');

  if (wavyDrop) {
    let mouseX = -500;
    let mouseY = -500;
    let dropX = -500;
    let dropY = -500;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dropX = mouseX;
        dropY = mouseY;
        wavyDrop.style.opacity = '1';
      }

      // Update background circuit spotlight to match mouse under the wavy drop
      document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      wavyDrop.style.opacity = '0';
      document.documentElement.style.setProperty('--mouse-x', '-500px');
      document.documentElement.style.setProperty('--mouse-y', '-500px');
    });

    function renderWavyDrop() {
      if (isVisible) {
        // Fluid liquid spring interpolation
        dropX += (mouseX - dropX) * 0.22;
        dropY += (mouseY - dropY) * 0.22;
        wavyDrop.style.transform = `translate3d(${dropX.toFixed(1)}px, ${dropY.toFixed(1)}px, 0)`;
      }

      requestAnimationFrame(renderWavyDrop);
    }

    requestAnimationFrame(renderWavyDrop);
  }

  // ===================================================================
  // 6. AI QUANTUM RETICLE & SYNAPSE CURSOR ENGINE
  // ===================================================================
  function initQuantumCursor() {
    // Only activate for fine-pointer desktop devices (prevent mobile touch interference)
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
      return;
    }

    const cursorRoot = document.getElementById('quantumCursorRoot');
    const cursorRing = document.getElementById('cursorRing');
    const cursorDot = document.getElementById('cursorDot');
    const canvas = document.getElementById('cursorSynapseCanvas');
    const toggleBtn = document.getElementById('cursorToggleBtn');
    const toastHud = document.getElementById('cursorToastHud');

    if (!cursorRoot || !cursorRing || !cursorDot || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Razor-sharp Canvas setup for Retina/4K displays
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let canvasW = window.innerWidth;
    let canvasH = window.innerHeight;

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasW = window.innerWidth;
      canvasH = window.innerHeight;
      canvas.width = Math.floor(canvasW * dpr);
      canvas.height = Math.floor(canvasH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Cursor state management & preference persistence
    let isEnabled = localStorage.getItem('manoj_quantum_cursor_active') !== 'false';
    let mouseX = -200;
    let mouseY = -200;
    let prevMouseX = -200;
    let prevMouseY = -200;
    let ringX = -200;
    let ringY = -200;
    let isVisible = false;
    let currentState = 'default'; // 'default' | 'hover' | 'text' | 'click'
    let toastTimeout = null;

    // Toast notification HUD
    function showCursorToast(messageHtml) {
      if (!toastHud) return;
      toastHud.innerHTML = '';
      const toast = document.createElement('div');
      toast.className = 'cursor-toast';
      toast.innerHTML = messageHtml;
      toastHud.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      }, 2200);
    }

    // Toggle quantum cursor active state
    function setCursorActive(active, showFeedback = true) {
      isEnabled = active;
      localStorage.setItem('manoj_quantum_cursor_active', isEnabled ? 'true' : 'false');

      if (isEnabled) {
        document.body.classList.add('has-quantum-cursor');
        cursorRoot.style.display = 'block';
        if (toggleBtn) {
          toggleBtn.classList.add('active');
          toggleBtn.classList.remove('disabled');
          toggleBtn.setAttribute('aria-pressed', 'true');
        }
        if (showFeedback) {
          showCursorToast('<span class="toast-pill-tag">ON</span> ⚡ Quantum Cursor Active');
        }
      } else {
        document.body.classList.remove('has-quantum-cursor');
        cursorRoot.style.display = 'none';
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
        particles.length = 0;
        ctx.clearRect(0, 0, canvasW, canvasH);
        if (toggleBtn) {
          toggleBtn.classList.remove('active');
          toggleBtn.classList.add('disabled');
          toggleBtn.setAttribute('aria-pressed', 'false');
        }
        if (showFeedback) {
          showCursorToast('<span class="toast-pill-tag off">OFF</span> System Cursor Restored <span style="opacity:0.65">(Press [C] to re-enable)</span>');
        }
      }
    }

    // Initialize state
    setCursorActive(isEnabled, false);

    // Toggle button click listener
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setCursorActive(!isEnabled, true);
      });
    }

    // Global keyboard shortcut [C] or [c]
    window.addEventListener('keydown', (e) => {
      const tag = e.target.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || e.target.isContentEditable) {
        return;
      }
      if (e.key === 'c' || e.key === 'C') {
        setCursorActive(!isEnabled, true);
      }
    });

    // Neural Synapse Sparks Collection
    const particles = [];
    const MAX_PARTICLES = 55;

    // Dynamically retrieve theme RGB color from active section
    function getCurrentCursorRgb() {
      const computed = getComputedStyle(document.body).getPropertyValue('--cursor-rgb').trim();
      return computed || '37, 99, 235';
    }

    class SynapseSpark {
      constructor(x, y, vx, vy, rgb, size = null, decay = null) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.rgb = rgb;
        this.size = size || (Math.random() * 2.2 + 1.2);
        this.alpha = 0.85;
        this.decay = decay || (Math.random() * 0.024 + 0.016);
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94;
        this.vy *= 0.94;
        this.alpha -= this.decay;
      }

      draw(c) {
        if (this.alpha <= 0) return;
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = `rgba(${this.rgb}, ${this.alpha})`;
        c.shadowColor = `rgba(${this.rgb}, ${this.alpha * 0.75})`;
        c.shadowBlur = 6;
        c.fill();
        c.restore();
      }
    }

    function spawnTrail(x, y, speed) {
      if (!isEnabled) return;
      const rgb = getCurrentCursorRgb();
      const count = Math.min(Math.floor(speed * 0.1) + 1, 3);
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) {
          particles.shift();
        }
        const angle = Math.random() * Math.PI * 2;
        const drift = Math.random() * 0.85;
        const vx = Math.cos(angle) * drift + (x - prevMouseX) * 0.035;
        const vy = Math.sin(angle) * drift + (y - prevMouseY) * 0.035;
        particles.push(new SynapseSpark(x, y, vx, vy, rgb));
      }
    }

    function spawnShockwaveBurst(x, y) {
      if (!isEnabled) return;
      const rgb = getCurrentCursorRgb();
      const burstCount = 12;
      for (let i = 0; i < burstCount; i++) {
        const angle = (Math.PI * 2 * i) / burstCount + (Math.random() * 0.2 - 0.1);
        const speed = Math.random() * 3.2 + 2.2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        particles.push(new SynapseSpark(x, y, vx, vy, rgb, Math.random() * 2.4 + 1.4, 0.032));
      }

      // Expanding DOM ripple ring
      const wave = document.createElement('div');
      wave.className = 'cursor-shockwave';
      wave.style.setProperty('--x', `${x}px`);
      wave.style.setProperty('--y', `${y}px`);
      cursorRoot.appendChild(wave);
      setTimeout(() => {
        if (wave.parentNode) wave.parentNode.removeChild(wave);
      }, 600);
    }

    // Pointer event listeners
    window.addEventListener('mousemove', (e) => {
      if (!isEnabled) return;

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }

      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const dist = Math.hypot(dx, dy);

      if (dist > 3) {
        spawnTrail(mouseX, mouseY, dist);
      }

      prevMouseX = mouseX;
      prevMouseY = mouseY;
    }, { passive: true });

    document.addEventListener('mouseenter', () => {
      if (!isEnabled) return;
      isVisible = true;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      particles.length = 0;
      ctx.clearRect(0, 0, canvasW, canvasH);
    });

    window.addEventListener('mousedown', (e) => {
      if (!isEnabled) return;
      cursorRoot.classList.add('cursor-state--click');
      spawnShockwaveBurst(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      if (!isEnabled) return;
      cursorRoot.classList.remove('cursor-state--click');
    });

    // Intelligent target detection via event delegation
    const INTERACTIVE_TARGETS = [
      'a',
      'button',
      '[role="button"]',
      'input',
      'textarea',
      'select',
      '.project-card',
      '.skill-category-card',
      '.about-card',
      '.timeline-card',
      '.edu-card',
      '.certifications-card',
      '.contact-card',
      '.social-link',
      '.nav-brand',
      '.brand-badge',
      '.filter-btn',
      '.hero-status-pill',
      '.copy-email-btn',
      '.copy-phone-btn',
      '.cursor-toggle-btn'
    ].join(', ');

    const TEXT_TARGETS = 'p, h1, h2, h3, h4, h5, h6, blockquote, code, .brand-text';

    document.addEventListener('mouseover', (e) => {
      if (!isEnabled) return;
      const target = e.target;
      if (!target) return;

      if (target.closest(INTERACTIVE_TARGETS)) {
        if (currentState !== 'hover') {
          currentState = 'hover';
          cursorRoot.classList.remove('cursor-state--text');
          cursorRoot.classList.add('cursor-state--hover');
        }
      } else if (target.closest(TEXT_TARGETS)) {
        if (currentState !== 'text') {
          currentState = 'text';
          cursorRoot.classList.remove('cursor-state--hover');
          cursorRoot.classList.add('cursor-state--text');
        }
      } else {
        if (currentState !== 'default') {
          currentState = 'default';
          cursorRoot.classList.remove('cursor-state--hover', 'cursor-state--text');
        }
      }
    });

    // Animation & Physics Render Loop
    function render() {
      if (isEnabled && isVisible) {
        // 1. Instantaneous core dot placement
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

        // 2. Smooth physical trailing for outer quantum reticle
        const lerpFactor = currentState === 'hover' ? 0.22 : 0.16;
        ringX += (mouseX - ringX) * lerpFactor;
        ringY += (mouseY - ringY) * lerpFactor;
        cursorRing.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;

        // 3. Render Canvas Synapse Sparks & Neural Lines
        ctx.clearRect(0, 0, canvasW, canvasH);

        const pLen = particles.length;
        // Connect nearby sparks with evanescent neural filaments
        for (let i = 0; i < pLen; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < pLen; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 42) {
              const alpha = Math.min(p1.alpha, p2.alpha) * (1 - dist / 42) * 0.42;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${p1.rgb}, ${alpha})`;
              ctx.lineWidth = 0.9;
              ctx.stroke();
            }
          }
        }

        // Update & draw particle sparks
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.update();
          if (p.alpha <= 0) {
            particles.splice(i, 1);
          } else {
            p.draw(ctx);
          }
        }
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  // Initialize Quantum Cursor Engine
  initQuantumCursor();

  // Mark document loaded for entrance triggers
  document.body.classList.add('page-loaded');

});
