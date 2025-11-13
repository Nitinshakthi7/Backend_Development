// Anime.js Scroll Animation Controller
// This handles all scroll-triggered animations

// Check if element is in viewport
function isInViewport(element, offset = 100) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.bottom >= 0
  );
}

// Animation configurations
const animationConfig = {
  fadeInUp: {
    translateY: [60, 0],
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutExpo'
  },
  slideDown: {
    translateY: [-100, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutQuad'
  },
  scaleIn: {
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutExpo'
  },
  slideInLeft: {
    translateX: [-100, 0],
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutExpo'
  },
  slideInRight: {
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutExpo'
  },
  rotateIn: {
    rotate: [180, 0],
    opacity: [0, 1],
    duration: 1200,
    easing: 'easeOutExpo'
  }
};

// Animate element function
function animateElement(element, animationType, delay = 0) {
  const config = animationConfig[animationType];
  
  if (!config) {
    console.warn(`Animation type "${animationType}" not found`);
    return;
  }

  anime({
    targets: element,
    ...config,
    delay: delay
  });

  element.classList.add('animated');
}

// Initialize scroll animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // Initial check
  animatedElements.forEach(element => {
    if (isInViewport(element)) {
      const animationType = element.getAttribute('data-animation') || 'fadeInUp';
      const delay = parseInt(element.getAttribute('data-delay')) || 0;
      animateElement(element, animationType, delay);
    }
  });

  // Scroll listener with throttle
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
      animatedElements.forEach(element => {
        if (!element.classList.contains('animated') && isInViewport(element)) {
          const animationType = element.getAttribute('data-animation') || 'fadeInUp';
          const delay = parseInt(element.getAttribute('data-delay')) || 0;
          animateElement(element, animationType, delay);
        }
      });
    });
  });
}

// Counter animation using anime.js
function animateCounter(element, targetValue, duration = 2000) {
  const obj = { value: 0 };
  
  anime({
    targets: obj,
    value: targetValue,
    duration: duration,
    easing: 'easeOutExpo',
    round: 100, // Round to 2 decimals
    update: function() {
      element.textContent = obj.value.toFixed(2);
    }
  });
}

// Stagger animation for multiple elements
function staggerAnimate(selector, animationType = 'fadeInUp', staggerDelay = 100) {
  const elements = document.querySelectorAll(selector);
  const config = animationConfig[animationType];
  
  anime({
    targets: elements,
    ...config,
    delay: anime.stagger(staggerDelay)
  });
}

// Parallax scroll effect
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-element');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = element.getAttribute('data-speed') || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// Initialize particles animation
function initParticles() {
  const particles = document.querySelectorAll('.particle');
  
  particles.forEach((particle, index) => {
    anime({
      targets: particle,
      translateY: [
        { value: window.innerHeight, duration: 0 },
        { value: -100, duration: (10 + index * 2) * 1000 }
      ],
      translateX: [
        { value: 0 },
        { value: anime.random(-100, 100) }
      ],
      opacity: [
        { value: 0, duration: 1000 },
        { value: 0.8, duration: 2000 },
        { value: 0, duration: 1000 }
      ],
      scale: [
        { value: 0 },
        { value: 1 }
      ],
      easing: 'linear',
      loop: true,
      delay: index * 2000
    });
  });
}

// Hover animation for cards
function initCardHoverAnimations() {
  const cards = document.querySelectorAll('.glass-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      anime({
        targets: card,
        scale: 1.05,
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
    
    card.addEventListener('mouseleave', () => {
      anime({
        targets: card,
        scale: 1,
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
  });
}

// Page load animation sequence
function pageLoadAnimation() {
  // Animate navbar
  anime({
    targets: '.navbar',
    translateY: [-100, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutExpo'
  });

  // Animate main sections with stagger
  anime({
    targets: '.dashboard-main > section',
    translateY: [50, 0],
    opacity: [0, 1],
    duration: 1000,
    delay: anime.stagger(150, {start: 300}),
    easing: 'easeOutExpo'
  });
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
  // Check if anime.js is loaded
  if (typeof anime === 'undefined') {
    console.error('Anime.js not loaded!');
    return;
  }

  // Initialize scroll animations
  initScrollAnimations();

  // Initialize particles if container exists
  if (document.querySelector('.particles-container')) {
    initParticles();
  }

  // Initialize card hover animations
  initCardHoverAnimations();

  // Page load animation
  pageLoadAnimation();

  // Initialize parallax (optional)
  // initParallax();

  console.log('✨ Anime.js animations initialized');
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    animateElement,
    animateCounter,
    staggerAnimate,
    initScrollAnimations
  };
}
