// CliniCard Website - Interactive Scripts

// Smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === "#" || href.length < 2) return; // ignore "#"
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    header.style.boxShadow = 'none';
  } else {
    header.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.06)';
  }
  
  lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply fade-in to feature cards and sections
document.querySelectorAll('.feature-card, .why-item, .testimonial-card, .stat-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("phoneCarousel");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll(".phone-slide"));
  const dots = Array.from(root.querySelectorAll(".dot"));
  const prevBtn = root.querySelector(".phone-nav.prev");
  const nextBtn = root.querySelector(".phone-nav.next");

  if (!slides.length) return;

  let index = slides.findIndex(s => s.classList.contains("is-active"));
  if (index < 0) index = 0;

  const setActive = (i) => {
    slides[index]?.classList.remove("is-active");
    dots[index]?.classList.remove("is-active");

    index = (i + slides.length) % slides.length;

    slides[index]?.classList.add("is-active");
    dots[index]?.classList.add("is-active");
  };

  prevBtn?.addEventListener("click", () => setActive(index - 1));
  nextBtn?.addEventListener("click", () => setActive(index + 1));

  dots.forEach((d, i) => d.addEventListener("click", () => setActive(i)));

  // Autoplay
  let timer = setInterval(() => setActive(index + 1), 4500);

  const pause = () => { clearInterval(timer); timer = null; };
  const resume = () => {
    if (timer) return;
    timer = setInterval(() => setActive(index + 1), 4500);
  };

  root.addEventListener("mouseenter", pause);
  root.addEventListener("mouseleave", resume);

  // Swipe mobile
  let startX = 0;
  root.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    pause();
  }, { passive: true });

  root.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 35) {
      setActive(index + (dx < 0 ? 1 : -1));
    }
    resume();
  }, { passive: true });
});

// Store button click tracking (for analytics)
// Store buttons behavior (soft launch friendly)
const IS_PUBLIC_LAUNCH = false; // <-- passe à true quand tu ouvres au public
const APP_STORE_URL = "https://apps.apple.com/app/id6758679816";

const IOS_EARLY_ACCESS_MAILTO =
  "mailto:clinicardapp@gmail.com" +
  "?subject=Acc%C3%A8s%20anticip%C3%A9%20CliniCard" +
  "&body=Bonjour%2C%0A%0AJe%20souhaite%20rejoindre%20l'acc%C3%A8s%20anticip%C3%A9%20CliniCard.%0A%0A-%20Fili%C3%A8re%20(PASS%2FLAS%2FDFGSM%2FAutre)%20%3A%0A-%20Acad%C3%A9mie%2Fville%20%3A%0A-%20Ce%20que%20je%20veux%20r%C3%A9viser%20%3A%0A%0AMerci%20!";

document.addEventListener("DOMContentLoaded", () => {
  const iosBtn = document.querySelector(".store-button.store-ios");
  const androidBtn = document.querySelector(".store-button.store-android");

  // Configure iOS link + label depending on soft launch / public launch
  if (iosBtn) {
    iosBtn.href = IS_PUBLIC_LAUNCH ? APP_STORE_URL : IOS_EARLY_ACCESS_MAILTO;
    const label = iosBtn.querySelector(".store-label");
    const name = iosBtn.querySelector(".store-name");
    if (label) label.textContent = IS_PUBLIC_LAUNCH ? "Disponible sur" : "Accès anticipé";
    if (name) name.textContent = IS_PUBLIC_LAUNCH ? "App Store" : "iOS (sur invitation)";
  }

  // Android stays "coming soon"
  if (androidBtn) {
    androidBtn.href = "#";
  }

  // Click behavior:
  // - iOS: allow navigation (mailto or App Store)
  // - Android: show message
  document.querySelectorAll(".store-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const isAndroid = button.classList.contains("store-android");
      if (!isAndroid) return; // iOS => let it work

      e.preventDefault();
      const note = document.querySelector(".download-note");
      if (!note) return;

      const originalHTML = note.innerHTML;
      note.innerHTML = "🎯 Android arrive bientôt. Laisse ton email / contacte-nous pour être prévenu.";
      note.style.background = "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)";
      note.style.color = "white";

      setTimeout(() => {
        note.innerHTML = originalHTML;
        note.style.background = "";
        note.style.color = "";
      }, 3500);
    });
  });
});
// Mobile menu toggle (for future implementation)
const initMobileMenu = () => {
  // Placeholder for mobile menu functionality
  // Will be added if hamburger menu is implemented
};

// Dynamic year in footer
const updateFooterYear = () => {
  const yearElement = document.querySelector('.footer-bottom p');
  if (yearElement) {
    yearElement.textContent = `© ${new Date().getFullYear()} CliniCard. Tous droits réservés.`;
  }
};

updateFooterYear();

// Parallax effect for hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && scrolled < 800) {
    heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// Performance: Lazy load images
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

console.log('🎉 CliniCard Website Loaded - Ready to help medical students succeed!');
