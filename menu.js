/**
 * menu.js — I Guardiani di Etherea
 * Inietta il menu di navigazione e gestisce header/scroll.
 * Per aggiungere voci: modifica l'array NAV_ITEMS.
 */

(function () {
  'use strict';

  /* ── CONFIGURAZIONE MENU ─────────────────────────────────────
     Aggiungi qui nuove pagine in futuro:
     { label: 'Testo', href: 'pagina.html', icon: 'fa-solid fa-icon' }
  ─────────────────────────────────────────────────────────── */
  const NAV_ITEMS = [
    { label: 'Home',         href: 'index.html',      icon: 'fa-solid fa-house' },
    { label: 'Storia',       href: 'storia.html',     icon: 'fa-solid fa-scroll' },
    { label: 'Guardiani',    href: 'guardiani.html',  icon: 'fa-solid fa-shield-halved' },
    { label: 'Regolamento',  href: 'regolamento.html',icon: 'fa-solid fa-book-open' },
  ];

  /* ── COSTRUZIONE HTML ──────────────────────────────────────── */
  function buildMenu() {
    const navItems = NAV_ITEMS.map(item => `
      <li>
        <a href="${item.href}">
          <i class="${item.icon}"></i>${item.label}
        </a>
      </li>`).join('');

    return `
    <!-- HEADER -->
    <header id="site-header">
      <a href="index.html" class="header-logo" aria-label="I Guardiani di Etherea - Home">
        <div class="header-logo-wrapper">
          <img src="img/logo_b.png" alt="I Guardiani di Etherea" class="logo-full">
          <img src="img/logo_i.png" alt="Etherea" class="logo-icon">
        </div>
      </a>
      <button class="menu-btn" id="menuBtn" aria-label="Apri menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>

    <!-- DROPDOWN NAV -->
    <nav id="site-nav" aria-hidden="true">
      <ul class="nav-links">
        ${navItems}
        <li class="nav-spacer" role="separator"></li>
        <li>
          <a href="maze-gen.html"
             target="_blank"
             class="nav-btn-primary"
             style="text-decoration:none;">
            <i class="fa-solid fa-dungeon"></i>Generatore Labirinto
          </a>
        </li>
        <li>
          <a href="regolamento.pdf"
             download
             class="nav-btn-secondary"
             style="text-decoration:none;">
            <i class="fa-solid fa-file-pdf"></i>Scarica Regolamento
          </a>
        </li>
      </ul>
    </nav>`;
  }

  /* ── INSERIMENTO NEL DOM ───────────────────────────────────── */
  function injectMenu() {
    const container = document.getElementById('nav-container');
    if (!container) {
      console.warn('menu.js: elemento #nav-container non trovato nella pagina.');
      return;
    }
    container.innerHTML = buildMenu();
  }

  /* ── HIGHLIGHT PAGINA CORRENTE ─────────────────────────────── */
  function highlightCurrent() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.style.color = 'var(--red)';
        link.style.paddingLeft = '2.5rem';
        const icon = link.querySelector('i');
        if (icon) icon.style.color = 'var(--gold)';
      }
    });
  }

  /* ── HAMBURGER TOGGLE ──────────────────────────────────────── */
  function initToggle() {
    const btn = document.getElementById('menuBtn');
    const nav = document.getElementById('site-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      nav.setAttribute('aria-hidden', String(!isOpen));
    });

    // Chiudi cliccando fuori
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
      }
    });

    // Chiudi su Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ── SCROLL HEADER ─────────────────────────────────────────── */
  function initScroll() {
    const header = document.getElementById('site-header');
    const nav    = document.getElementById('site-nav');
    if (!header) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 60;
          header.classList.toggle('scrolled', scrolled);
          if (nav) nav.dataset.scrolled = String(scrolled);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ── FADE-IN ON SCROLL ─────────────────────────────────────── */
  function initFadeIn() {
    const els = document.querySelectorAll('.fade-in-on-scroll');
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => io.observe(el));
  }

  /* ── INIT ──────────────────────────────────────────────────── */
  function init() {
    injectMenu();
    highlightCurrent();
    initToggle();
    initScroll();
    initFadeIn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
