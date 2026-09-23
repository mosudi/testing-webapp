/**
 * APEX PORTFOLIO & ENGINEERING SHOWCASE
 * Main Interactive Application Script
 */

// ============================================================================
// 1. PROJECT DATA REPOSITORY
// ============================================================================
const PROJECTS_DATA = [
  {
    id: 'nexus-cloud',
    title: 'Nexus Cloud Ops',
    category: 'cloud',
    badge: 'Cloud & DevOps',
    image: './assets/images/project-cloud.jpg',
    shortDesc: 'Production-grade multi-region cloud observability and real-time telemetry dashboard with latency anomaly detection.',
    fullDesc: 'Nexus Cloud Ops delivers enterprise-level cluster visibility, health tracing, and automated incident triage. Engineered with a high-throughput event streaming pipeline capable of processing over 3.1M metrics/sec with sub-50ms latency visualization.',
    tech: ['Kubernetes', 'Go', 'Prometheus', 'WebSockets', 'Tailwind', 'Docker'],
    architecture: 'Microservices architecture coordinated via gRPC and Redis Pub/Sub, deployed across multi-zone Kubernetes clusters.',
    metrics: '99.99% Telemetry Uptime • 112ms Max Latency • 50+ Microservices',
    liveUrl: '#',
    repoUrl: 'https://github.com/'
  },
  {
    id: 'synapse-ai',
    title: 'Synapse AI Studio',
    category: 'fullstack',
    badge: 'AI & Full-Stack',
    image: './assets/images/project-ai.jpg',
    shortDesc: 'Collaborative code intelligence workspace combining real-time streaming LLM assistance with AST refactoring.',
    fullDesc: 'Synapse AI Studio provides software engineering teams with contextual code synthesis, vector-based semantic repository search, and instant unit test generation. Features an interactive terminal sandbox and multi-model routing.',
    tech: ['TypeScript', 'Python', 'FastAPI', 'Gemini API', 'Vector DB', 'WebAssembly'],
    architecture: 'Edge-rendered frontend with bidirectional WebSocket streaming to an asynchronous Python AI inference pipeline.',
    metrics: 'Sub-20ms Token Time • 40+ Language Parsers • 10k Active Queries',
    liveUrl: '#',
    repoUrl: 'https://github.com/'
  },
  {
    id: 'pulsepay-fintech',
    title: 'PulsePay Global',
    category: 'fintech',
    badge: 'Fintech & Web3',
    image: './assets/images/project-fintech.jpg',
    shortDesc: 'Next-generation borderless cross-currency digital wallet and transaction settlement infrastructure.',
    fullDesc: 'PulsePay Global solves cross-border settlement frictions through smart routing algorithms, real-time FX quotation engines, and military-grade biometric verification complying with PCI-DSS Level 1 standards.',
    tech: ['Node.js', 'PostgreSQL', 'Redis', 'Cryptography', 'Next.js', 'Docker'],
    architecture: 'Event-sourced ledger pattern with distributed consensus and double-entry bookkeeping validation.',
    metrics: '< 1s FX Settlement • Zero Ledger Discrepancies • 180+ Countries',
    liveUrl: '#',
    repoUrl: 'https://github.com/'
  }
];

// ============================================================================
// 2. THEME MANAGER (DARK / LIGHT WITH SYSTEM PERSISTENCE)
// ============================================================================
class ThemeManager {
  constructor() {
    this.themeToggleBtn = document.getElementById('theme-toggle');
    this.html = document.documentElement;
    this.storageKey = 'apex_theme_preference';
    
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem(this.storageKey);
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => this.toggle());
    }

    // Listen for system OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);
    this.updateToggleIcon(theme);
  }

  toggle() {
    const currentTheme = this.html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info');
  }

  updateToggleIcon(theme) {
    if (!this.themeToggleBtn) return;
    this.themeToggleBtn.innerHTML = theme === 'dark'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    this.themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

// ============================================================================
// 3. DYNAMIC ROLE TYPING EFFECT
// ============================================================================
class TypeWriter {
  constructor(elementId, words, period = 2000) {
    this.element = document.getElementById(elementId);
    this.words = words;
    this.period = period;
    this.txt = '';
    this.wordIndex = 0;
    this.isDeleting = false;
    if (this.element) {
      this.tick();
    }
  }

  tick() {
    const i = this.wordIndex % this.words.length;
    const fullTxt = this.words[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    if (this.element) {
      this.element.textContent = this.txt;
    }

    let delta = 150 - Math.random() * 80;

    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      delta = 400;
    }

    setTimeout(() => this.tick(), delta);
  }
}

// ============================================================================
// 4. PROJECTS FILTER & MODAL CONTROLLER
// ============================================================================
class ProjectShowcase {
  constructor() {
    this.grid = document.getElementById('projects-grid');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.modal = document.getElementById('project-modal');
    this.modalCloseBtn = document.getElementById('modal-close-btn');

    this.init();
  }

  init() {
    this.renderProjects(PROJECTS_DATA);
    this.setupFilters();
    this.setupModal();
  }

  renderProjects(projects) {
    if (!this.grid) return;
    this.grid.innerHTML = '';

    projects.forEach((proj) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.setAttribute('data-category', proj.category);

      const techBadges = proj.tech.slice(0, 4).map(t => `<span class="tech-pill">${t}</span>`).join('');

      card.innerHTML = `
        <div class="project-image-wrapper">
          <img src="${proj.image}" alt="${proj.title}" class="project-img" loading="lazy">
          <div class="project-badges">
            <span class="badge badge-brand">${proj.badge}</span>
          </div>
        </div>
        <div class="project-content">
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-desc">${proj.shortDesc}</p>
          <div class="project-tech">
            ${techBadges}
          </div>
          <div class="project-links">
            <button class="btn btn-secondary btn-sm open-details-btn" data-id="${proj.id}">
              <span>View Architecture</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <a href="${proj.repoUrl}" target="_blank" rel="noopener noreferrer" class="action-link" title="Source Code">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
          </div>
        </div>
      `;

      card.querySelector('.open-details-btn').addEventListener('click', () => {
        this.openModal(proj);
      });

      this.grid.appendChild(card);
    });
  }

  setupFilters() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        if (filter === 'all') {
          this.renderProjects(PROJECTS_DATA);
        } else {
          const filtered = PROJECTS_DATA.filter(p => p.category === filter);
          this.renderProjects(filtered);
        }
      });
    });
  }

  setupModal() {
    if (!this.modal) return;

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }

    // Close when clicking outside of dialog content
    this.modal.addEventListener('click', (e) => {
      const dialogRect = this.modal.getBoundingClientRect();
      const isInDialog = (
        e.clientX >= dialogRect.left &&
        e.clientX <= dialogRect.right &&
        e.clientY >= dialogRect.top &&
        e.clientY <= dialogRect.bottom
      );
      if (!isInDialog) {
        this.closeModal();
      }
    });

    // ESC handling is native with <dialog>, but add smooth close
    this.modal.addEventListener('cancel', (e) => {
      e.preventDefault();
      this.closeModal();
    });
  }

  openModal(proj) {
    if (!this.modal) return;
    
    document.getElementById('modal-img').src = proj.image;
    document.getElementById('modal-img').alt = proj.title;
    document.getElementById('modal-badge').textContent = proj.badge;
    document.getElementById('modal-title').textContent = proj.title;
    document.getElementById('modal-desc').textContent = proj.fullDesc;
    document.getElementById('modal-arch').textContent = proj.architecture;
    document.getElementById('modal-metrics').textContent = proj.metrics;
    
    const techBox = document.getElementById('modal-tech');
    techBox.innerHTML = proj.tech.map(t => `<span class="tech-pill">${t}</span>`).join('');

    this.modal.showModal();
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.close();
    document.body.style.overflow = '';
  }
}

// ============================================================================
// 5. TOAST NOTIFICATION SYSTEM
// ============================================================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === 'warning') {
    iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  } else {
    iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-text">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// ============================================================================
// 6. CHROME DEPLOYMENT & ENVIRONMENT DIAGNOSTICS HUB
// ============================================================================
class ChromeDeploymentHub {
  constructor() {
    this.swStatusEl = document.getElementById('diag-sw-status');
    this.pwaStatusEl = document.getElementById('diag-pwa-status');
    this.networkStatusEl = document.getElementById('diag-network-status');
    this.viewportStatusEl = document.getElementById('diag-viewport-status');
    this.protocolStatusEl = document.getElementById('diag-protocol-status');
    this.installBtn = document.getElementById('pwa-install-trigger');
    this.simulateOfflineBtn = document.getElementById('btn-simulate-offline');

    this.deferredPrompt = null;
    this.init();
  }

  init() {
    this.checkProtocol();
    this.checkNetwork();
    this.checkServiceWorker();
    this.setupViewportTracking();
    this.setupPwaInstall();
    this.setupOfflineSimulation();
  }

  checkProtocol() {
    if (!this.protocolStatusEl) return;
    const isHttps = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    this.protocolStatusEl.textContent = location.protocol.replace(':', '').toUpperCase();
    this.protocolStatusEl.className = `diag-value ${isHttps ? 'val-success' : 'val-warning'}`;
  }

  checkNetwork() {
    if (!this.networkStatusEl) return;
    const updateNetwork = () => {
      const isOnline = navigator.onLine;
      this.networkStatusEl.textContent = isOnline ? 'ONLINE' : 'OFFLINE';
      this.networkStatusEl.className = `diag-value ${isOnline ? 'val-success' : 'val-warning'}`;
      showToast(`Network state: ${isOnline ? 'Connected' : 'Disconnected'}`, isOnline ? 'success' : 'warning');
    };

    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
    this.networkStatusEl.textContent = navigator.onLine ? 'ONLINE' : 'OFFLINE';
    this.networkStatusEl.className = `diag-value ${navigator.onLine ? 'val-success' : 'val-warning'}`;
  }

  checkServiceWorker() {
    if (!this.swStatusEl) return;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        this.swStatusEl.textContent = 'ACTIVE';
        this.swStatusEl.className = 'diag-value val-success';
        console.log('Apex Service Worker registered:', reg.scope);
      }).catch((err) => {
        this.swStatusEl.textContent = 'STANDBY';
        this.swStatusEl.className = 'diag-value val-warning';
        console.warn('Service Worker registration note:', err.message);
      });
    } else {
      this.swStatusEl.textContent = 'UNSUPPORTED';
      this.swStatusEl.className = 'diag-value val-warning';
    }
  }

  setupViewportTracking() {
    if (!this.viewportStatusEl) return;
    const updateViewport = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      this.viewportStatusEl.textContent = `${w}×${h} (${dpr}x DPR)`;
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
  }

  setupPwaInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      if (this.pwaStatusEl) {
        this.pwaStatusEl.textContent = 'READY TO INSTALL';
        this.pwaStatusEl.className = 'diag-value val-success';
      }
      if (this.installBtn) {
        this.installBtn.style.display = 'inline-flex';
      }
      showToast('Chrome App Install Available!', 'info');
    });

    if (this.installBtn) {
      this.installBtn.addEventListener('click', async () => {
        if (!this.deferredPrompt) {
          showToast('App is already installed or open in Chrome standalone mode.', 'info');
          return;
        }
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast('Apex Portfolio installed to Chrome!', 'success');
        }
        this.deferredPrompt = null;
      });
    }

    window.addEventListener('appinstalled', () => {
      if (this.pwaStatusEl) {
        this.pwaStatusEl.textContent = 'INSTALLED';
        this.pwaStatusEl.className = 'diag-value val-success';
      }
      showToast('Apex Portfolio successfully installed!', 'success');
    });
  }

  setupOfflineSimulation() {
    if (!this.simulateOfflineBtn) return;
    let isSimulating = false;

    this.simulateOfflineBtn.addEventListener('click', () => {
      isSimulating = !isSimulating;
      if (isSimulating) {
        this.simulateOfflineBtn.textContent = 'Disable Offline Simulation';
        this.simulateOfflineBtn.classList.replace('btn-secondary', 'btn-primary');
        if (this.networkStatusEl) {
          this.networkStatusEl.textContent = 'SIMULATED OFFLINE';
          this.networkStatusEl.className = 'diag-value val-warning';
        }
        showToast('Offline Mode Simulated! Service Worker cache will serve assets.', 'warning');
      } else {
        this.simulateOfflineBtn.textContent = 'Simulate Offline Mode';
        this.simulateOfflineBtn.classList.replace('btn-primary', 'btn-secondary');
        this.checkNetwork();
        showToast('Online status restored.', 'success');
      }
    });
  }
}

// ============================================================================
// 7. CONTACT FORM & CLIPBOARD INTERACTIONS
// ============================================================================
function setupContactInteractions() {
  const form = document.getElementById('contact-form');
  const copyEmailBtn = document.getElementById('btn-copy-email');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <span>Transmitting Message...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        showToast('Message transmitted successfully! I will get back to you shortly.', 'success');
      }, 1200);
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'festus.engineering@example.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard: ' + email, 'success');
      }).catch(() => {
        showToast('Contact: ' + email, 'info');
      });
    });
  }
}

// ============================================================================
// 8. MOBILE MENU CONTROLLER
// ============================================================================
function setupMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// ============================================================================
// 9. INITIALIZE ON DOM CONTENT LOADED
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new TypeWriter('typing-role', [
    'Full-Stack Systems Architect',
    'Cloud Infrastructure Engineer',
    'High-Performance Web Developer',
    'DevOps & Microservices Specialist'
  ], 2200);
  new ProjectShowcase();
  new ChromeDeploymentHub();
  setupContactInteractions();
  setupMobileMenu();

  console.log('%c🚀 Apex Portfolio & Chrome Deployment Testbed Loaded Successfully', 'color: #6366f1; font-weight: bold; font-size: 14px;');
});
