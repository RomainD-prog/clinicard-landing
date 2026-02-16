// CliniCard Website - Interactive Scripts

// Smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
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
document.querySelectorAll('.store-button').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const store = button.classList.contains('store-ios') ? 'App Store' : 'Google Play';
    console.log(`Clicked: ${store} - Coming soon!`);
    
    // Show temporary message
    const note = document.querySelector('.download-note p');
    const originalText = note.textContent;
    note.textContent = `🎯 ${store} - Lancement très bientôt ! Restez connectés.`;
    note.style.background = 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)';
    note.style.color = 'white';
    
    setTimeout(() => {
      note.textContent = originalText;
      note.style.background = '';
      note.style.color = '';
    }, 3000);
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
