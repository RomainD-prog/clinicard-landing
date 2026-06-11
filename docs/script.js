// CliniCard — Landing Page Scripts

// Smooth scroll with offset for sticky header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const headerOffset = 80;
    const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  });
});

// Header shadow on scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 10) {
    header.style.boxShadow = '0 2px 16px rgba(12, 45, 90, 0.08)';
  } else {
    header.style.boxShadow = 'none';
  }
}, { passive: true });

// Scroll reveal for cards
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.feature-card, .why-item, .testimonial-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
  revealObserver.observe(el);
});

// Phone carousel
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('phoneCarousel');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.phone-slide'));
  const dots   = Array.from(root.querySelectorAll('.dot'));
  const prevBtn = root.querySelector('.phone-nav.prev');
  const nextBtn = root.querySelector('.phone-nav.next');

  if (!slides.length) return;

  let index = slides.findIndex(s => s.classList.contains('is-active'));
  if (index < 0) index = 0;

  const setActive = (i) => {
    slides[index]?.classList.remove('is-active');
    dots[index]?.classList.remove('is-active');
    index = (i + slides.length) % slides.length;
    slides[index]?.classList.add('is-active');
    dots[index]?.classList.add('is-active');
  };

  prevBtn?.addEventListener('click', () => setActive(index - 1));
  nextBtn?.addEventListener('click', () => setActive(index + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => setActive(i)));

  let timer = setInterval(() => setActive(index + 1), 4500);
  const pause  = () => { clearInterval(timer); timer = null; };
  const resume = () => { if (!timer) timer = setInterval(() => setActive(index + 1), 4500); };

  root.addEventListener('mouseenter', pause);
  root.addEventListener('mouseleave', resume);

  // Swipe support
  let startX = 0;
  root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; pause(); }, { passive: true });
  root.addEventListener('touchend',   (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 35) setActive(index + (dx < 0 ? 1 : -1));
    resume();
  }, { passive: true });
});

// Store button logic (soft launch vs public)
const IS_PUBLIC_LAUNCH = true;
const APP_STORE_URL    = 'https://apps.apple.com/app/id6758679816';
const IOS_EARLY_MAILTO =
  'mailto:clinicardapp@gmail.com' +
  '?subject=Acc%C3%A8s%20anticip%C3%A9%20CliniCard' +
  '&body=Bonjour%2C%0A%0AJe%20souhaite%20rejoindre%20l\'acc%C3%A8s%20anticip%C3%A9%20CliniCard.%0A%0A-%20Fili%C3%A8re%20(PASS%2FLAS%2FDFGSM%2FAutre)%20%3A%0A-%20Acad%C3%A9mie%2Fville%20%3A%0A-%20Ce%20que%20je%20veux%20r%C3%A9viser%20%3A%0A%0AMerci%20!';

document.addEventListener('DOMContentLoaded', () => {
  const iosBtn = document.querySelector('.store-button.store-ios');
  if (iosBtn) {
    iosBtn.href = IS_PUBLIC_LAUNCH ? APP_STORE_URL : IOS_EARLY_MAILTO;
    const label = iosBtn.querySelector('.store-label');
    const name  = iosBtn.querySelector('.store-name');
    if (label) label.textContent = IS_PUBLIC_LAUNCH ? 'Disponible sur' : 'Accès anticipé';
    if (name)  name.textContent  = IS_PUBLIC_LAUNCH ? 'App Store' : 'iOS (sur invitation)';
  }

  // Android: show message on click
  const androidBtn = document.querySelector('.store-button.store-android');
  androidBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const note = document.querySelector('.download-note');
    if (!note) return;
    const original = note.innerHTML;
    note.innerHTML = '<p style="color: var(--azure); font-weight: 700;">Android arrive bientôt. Contactez-nous pour être prévenu : <a href="mailto:clinicardapp@gmail.com">clinicardapp@gmail.com</a></p>';
    setTimeout(() => { note.innerHTML = original; }, 3500);
  });
});

// ── In-app browser handling (TikTok, Instagram, Snapchat…) ──
// Quand on arrive depuis un lien posté dans TikTok/Insta/etc., la page s'ouvre
// dans une webview interne, pas dans Safari. Dans ces webviews, les liens
// "apps.apple.com" n'ouvrent souvent PAS l'App Store. On tente alors le schéma
// natif itms-apps:// (qui sort vers l'App Store) et on affiche une bannière
// expliquant comment ouvrir la page dans le navigateur.
(function () {
  const ua = navigator.userAgent || navigator.vendor || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isInApp = /TikTok|musical_ly|Bytedance|Instagram|FBAN|FBAV|FB_IAB|Snapchat|Line\/|Pinterest|LinkedIn/i.test(ua);

  if (!isInApp) return;

  const APP_ID = 'id6758679816';
  const APP_STORE_SCHEME = 'itms-apps://apps.apple.com/app/' + APP_ID;

  document.addEventListener('DOMContentLoaded', () => {
    // 1) Au clic sur un bouton App Store, tenter le schéma natif (iOS)
    document.querySelectorAll('a[href*="apps.apple.com"]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (isIOS) {
          e.preventDefault();
          // Le schéma itms-apps:// sort de la plupart des webviews vers l'App Store
          window.location.href = APP_STORE_SCHEME;
        }
        showInAppBanner();
      });
    });

    // 2) Bannière permanente expliquant comment ouvrir dans le navigateur
    showInAppBanner();
  });

  function showInAppBanner() {
    if (document.getElementById('inAppBanner')) return;
    if (sessionStorage.getItem('inapp-banner-dismissed')) return;

    const isAndroid = /android/i.test(ua);
    const tip = isIOS
      ? 'touche le menu <strong>•••</strong> en haut à droite, puis <strong>« Ouvrir dans le navigateur »</strong>'
      : (isAndroid
          ? 'touche le menu <strong>⋮</strong> en haut à droite, puis <strong>« Ouvrir dans Chrome »</strong>'
          : 'ouvre cette page dans ton navigateur (Safari / Chrome)');

    const banner = document.createElement('div');
    banner.id = 'inAppBanner';
    banner.className = 'inapp-banner';
    banner.innerHTML =
      '<div class="inapp-banner-inner">' +
        '<span class="inapp-banner-text">📲 Pour installer CliniCard, ' + tip + '.</span>' +
        '<button type="button" class="inapp-banner-close" aria-label="Fermer">&times;</button>' +
      '</div>';
    document.body.appendChild(banner);
    document.body.classList.add('has-inapp-banner');

    banner.querySelector('.inapp-banner-close').addEventListener('click', () => {
      banner.remove();
      document.body.classList.remove('has-inapp-banner');
      sessionStorage.setItem('inapp-banner-dismissed', '1');
    });
  }
}());

// Announce bar dismiss
const announceBar = document.getElementById('announceBar');
const announceClose = document.getElementById('announceClose');
announceClose?.addEventListener('click', () => {
  announceBar?.classList.add('is-hidden');
  sessionStorage.setItem('announce-dismissed', '1');
});
if (sessionStorage.getItem('announce-dismissed')) {
  announceBar?.classList.add('is-hidden');
}

// Hamburger menu
const hamburger = document.querySelector('.nav-hamburger');
const navMobile = document.querySelector('.nav-mobile');
if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    navMobile.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    navMobile.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      navMobile.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      navMobile.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

// Dynamic footer year
const yearEl = document.querySelector('.footer-bottom p');
if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()} CliniCard. Tous droits réservés.`;

console.log('CliniCard loaded.');

// ── Showcase Band Carousel ──
(function () {
  const band = document.querySelector('.showcase-band');
  if (!band) return;

  const feats   = Array.from(band.querySelectorAll('.sb-feat'));
  const screens = Array.from(band.querySelectorAll('.sb-screen'));
  const glow    = band.querySelector('#sbPhoneGlow');
  const glowClasses = ['', 'glow-green', 'glow-purple'];
  let current = 0;
  let timer = null;

  function activate(idx) {
    feats[current].classList.remove('is-active');
    screens[current].classList.remove('is-active');

    current = (idx + feats.length) % feats.length;

    feats[current].classList.add('is-active');
    screens[current].classList.add('is-active');

    // Restart bar animation
    const bar = feats[current].querySelector('.sb-feat-bar');
    if (bar) {
      bar.style.animation = 'none';
      bar.offsetHeight;
      bar.style.animation = '';
    }

    // Swap glow colour
    if (glow) {
      glow.className = 'sb-phone-glow' + (glowClasses[current] ? ' ' + glowClasses[current] : '');
    }
  }

  function startTimer() {
    timer = setInterval(() => activate(current + 1), 6000);
  }
  function stopTimer() { clearInterval(timer); timer = null; }

  feats.forEach((feat, i) => {
    feat.addEventListener('click', () => { stopTimer(); activate(i); startTimer(); });
  });

  band.addEventListener('mouseenter', stopTimer);
  band.addEventListener('mouseleave', startTimer);

  startTimer();
}());

// ── Flashcard hero toggle ──
(function () {
  const btn = document.getElementById('hfcToggle');
  const panel = document.getElementById('hfcAnswer');
  const label = btn?.querySelector('.hfc-btn-label');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    panel.setAttribute('aria-hidden', String(open));
    panel.classList.toggle('is-open', !open);
    if (label) label.textContent = open ? 'Voir la réponse' : 'Masquer la réponse';
  });
}());

// ── Sticky mobile download dock ──
// Visible une fois le hero dépassé, masqué quand une section avec son propre
// CTA de téléchargement est à l'écran (download, CTA finale, footer).
(function () {
  const dock = document.getElementById('mobileDock');
  const hero = document.querySelector('.hero');
  if (!dock || !hero || !('IntersectionObserver' in window)) return;

  let pastHero = false;
  const visibleZones = new Set();

  const update = () => {
    dock.classList.toggle('is-visible', pastHero && visibleZones.size === 0);
  };

  new IntersectionObserver(([entry]) => {
    pastHero = !entry.isIntersecting;
    update();
  }, { threshold: 0 }).observe(hero);

  const zoneObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) visibleZones.add(en.target);
      else visibleZones.delete(en.target);
    });
    update();
  }, { threshold: 0.15 });
  document.querySelectorAll('#telechargement, .cta-section, .footer').forEach(z => zoneObserver.observe(z));
}());

// ── GA : suivi des clics CTA (App Store / app web) ──
(function () {
  document.addEventListener('click', (e) => {
    if (typeof gtag !== 'function') return;
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.href || '';
    const section = link.closest('[id], section, header, footer');
    const label = section?.id || section?.className?.split(' ')[0] || 'page';
    if (href.includes('apps.apple.com') || href.startsWith('itms-apps')) {
      gtag('event', 'cta_app_store_click', { event_category: 'conversion', event_label: label });
    } else if (href.includes('app.clinicard.fr')) {
      gtag('event', 'cta_web_app_click', { event_category: 'conversion', event_label: label });
    }
  }, { capture: true });
}());

// ── FAQ Accordion & Tabs ──
(function () {
  // Tabs
  const tabs = document.querySelectorAll('.faq-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const panelId = tab.getAttribute('aria-controls');
      document.querySelectorAll('.faq-panel').forEach(p => {
        if (p.id === panelId) {
          p.classList.add('is-active');
          p.removeAttribute('hidden');
        } else {
          p.classList.remove('is-active');
          p.setAttribute('hidden', '');
          // Close all items in hidden panel
          p.querySelectorAll('.faq-trigger[aria-expanded="true"]').forEach(t => {
            t.setAttribute('aria-expanded', 'false');
            t.closest('.faq-item').querySelector('.faq-answer').classList.remove('is-open');
          });
        }
      });
    });
  });

  // Accordion triggers
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const answer = trigger.closest('.faq-item').querySelector('.faq-answer');

      // Close siblings
      trigger.closest('.faq-accordion').querySelectorAll('.faq-trigger').forEach(t => {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          t.closest('.faq-item').querySelector('.faq-answer').classList.remove('is-open');
        }
      });

      trigger.setAttribute('aria-expanded', String(!expanded));
      answer.classList.toggle('is-open', !expanded);
    });
  });
}());
