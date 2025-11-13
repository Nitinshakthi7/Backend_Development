/**
 * GTA-Style Animation Controller
 * Handles scroll-triggered animations, parallax effects, and neon interactions
 */

class GTAAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupParallax();
    this.setupCounters();
    this.setupNeonEffects();
    this.setupNavbarScroll();
    console.log('🎮 GTA Animations Initialized');
  }

  // Scroll-triggered animations
  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = entry.target.dataset.index;
          const delay = index ? parseInt(index) * 150 : 0;

          anime({
            targets: entry.target,
            translateY: [100, 0],
            opacity: [0, 1],
            duration: 1200,
            delay: delay,
            easing: 'easeOutExpo'
          });

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    });

    // Observe all cards
    document.querySelectorAll('.gta-card').forEach(card => {
      observer.observe(card);
    });

    // Observe insight items
    document.querySelectorAll('.insight-item').forEach(item => {
      observer.observe(item);
    });

    // Observe stat boxes
    document.querySelectorAll('.stat-box').forEach(box => {
      observer.observe(box);
    });
  }

  // Parallax scrolling effect
  setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.speed);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Animated counters
  setupCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          const element = entry.target;

          anime({
            targets: element,
            innerHTML: [0, target],
            round: 1,
            duration: 2500,
            easing: 'easeOutExpo',
            update: function(anim) {
              element.textContent = Math.floor(anim.animations[0].currentValue);
            }
          });

          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // Neon glow effects on hover
  setupNeonEffects() {
    const neonButtons = document.querySelectorAll('.neon-btn, .neon-btn-large');
    
    neonButtons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        anime({
          targets: btn,
          boxShadow: [
            '0 0 10px rgba(0, 240, 255, 0.5)',
            '0 0 30px rgba(0, 240, 255, 0.8), 0 0 50px rgba(0, 240, 255, 0.6)'
          ],
          duration: 300,
          easing: 'easeOutQuad'
        });
      });

      btn.addEventListener('mouseleave', () => {
        anime({
          targets: btn,
          boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
          duration: 300,
          easing: 'easeOutQuad'
        });
      });
    });

    // Card hover effects
    const cards = document.querySelectorAll('.gta-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card.querySelector('.neon-icon'),
          scale: [1, 1.2],
          rotate: [0, 10],
          duration: 400,
          easing: 'easeOutElastic(1, .6)'
        });
      });

      card.addEventListener('mouseleave', () => {
        anime({
          targets: card.querySelector('.neon-icon'),
          scale: [1.2, 1],
          rotate: [10, 0],
          duration: 400,
          easing: 'easeOutElastic(1, .6)'
        });
      });
    });
  }

  // Navbar scroll effect
  setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }

  // Smooth scroll for anchor links
  static enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new GTAAnimations();
  GTAAnimations.enableSmoothScroll();
});
