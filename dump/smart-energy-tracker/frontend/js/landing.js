/**
 * Landing Page Controller
 * Handles additional landing page specific interactions
 */

// Page load sequence
window.addEventListener('DOMContentLoaded', () => {
  // Animate visualization bars
  animateVisualizationBars();

  // Update active nav on scroll
  updateActiveNav();

  console.log('✨ Landing page loaded');
});

// Animate data visualization bars
function animateVisualizationBars() {
  const bars = document.querySelectorAll('.viz-bar');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          scaleY: [0, 1],
          opacity: [0, 1],
          duration: 1500,
          delay: index * 100,
          easing: 'easeOutElastic(1, .6)',
          complete: () => {
            // Continuous subtle animation
            anime({
              targets: entry.target,
              scaleY: [1, 0.95, 1],
              duration: 2000,
              loop: true,
              easing: 'easeInOutSine'
            });
          }
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}

// Update active navigation link based on scroll position
function updateActiveNav() {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Add mouse trail effect (optional GTA-style enhancement)
function createMouseTrail() {
  let isMouseMoving = false;

  document.addEventListener('mousemove', (e) => {
    if (!isMouseMoving) {
      isMouseMoving = true;

      const trail = document.createElement('div');
      trail.className = 'mouse-trail';
      trail.style.left = e.pageX + 'px';
      trail.style.top = e.pageY + 'px';
      document.body.appendChild(trail);

      anime({
        targets: trail,
        scale: [0, 1.5],
        opacity: [0.6, 0],
        duration: 800,
        easing: 'easeOutExpo',
        complete: () => trail.remove()
      });

      setTimeout(() => {
        isMouseMoving = false;
      }, 50);
    }
  });
}

// Optional: Enable mouse trail
createMouseTrail();
