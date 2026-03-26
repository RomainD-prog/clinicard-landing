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
