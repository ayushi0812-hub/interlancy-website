/**
 * Interlancy Website - Main JavaScript
 * B2B Education Consulting & School Transformation
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // 1. Mobile Navigation Toggle
  // ========================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // ========================================
  // 2. Sticky Header on Scroll
  // ========================================
  const header = document.querySelector('.header');

  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load
  }

  // ========================================
  // 3. Smooth Scroll for Anchor Links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // 4. Stats Counter Animation
  // ========================================
  const statNumbers = document.querySelectorAll('[data-target]');

  if (statNumbers.length > 0) {
    let statsAnimated = false;

    const animateCounters = () => {
      if (statsAnimated) return;
      statsAnimated = true;

      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // ~60fps
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            stat.textContent = Math.ceil(current).toLocaleString();
            requestAnimationFrame(updateCounter);
          } else {
            stat.textContent = target.toLocaleString();
            // Add suffix if present
            const suffix = stat.getAttribute('data-suffix');
            if (suffix) {
              stat.textContent += suffix;
            }
          }
        };

        updateCounter();
      });
    };

    const statsSection = statNumbers[0]?.closest('section') || statNumbers[0]?.parentElement;

    if (statsSection) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      statsObserver.observe(statsSection);
    }
  }

  // ========================================
  // 5. Scroll Reveal Animation
  // ========================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ========================================
  // 6. FAQ Accordion
  // ========================================
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');

    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ========================================
  // 7. Contact Form Handling
  // ========================================
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form fields
      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const phone = contactForm.querySelector('[name="phone"]');
      const message = contactForm.querySelector('[name="message"]');

      // Validation
      let isValid = true;
      const errors = [];

      if (name && !name.value.trim()) {
        errors.push('Please enter your name.');
        isValid = false;
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
          errors.push('Please enter your email address.');
          isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
          errors.push('Please enter a valid email address.');
          isValid = false;
        }
      }

      if (message && !message.value.trim()) {
        errors.push('Please enter your message.');
        isValid = false;
      }

      // Show errors or success
      // Remove existing messages
      const existingMsg = contactForm.querySelector('.form-message');
      if (existingMsg) existingMsg.remove();

      const msgDiv = document.createElement('div');
      msgDiv.classList.add('form-message');

      if (!isValid) {
        msgDiv.classList.add('form-message--error');
        msgDiv.innerHTML = `<p>${errors.join('<br>')}</p>`;
      } else {
        msgDiv.classList.add('form-message--success');
        msgDiv.innerHTML = `
          <p><strong>Thank you for reaching out!</strong></p>
          <p>We've received your message and will get back to you within 24 hours.</p>
        `;
        contactForm.reset();
      }

      contactForm.appendChild(msgDiv);

      // Auto-remove success message after 5 seconds
      if (isValid) {
        setTimeout(() => {
          msgDiv.remove();
        }, 5000);
      }
    });
  }

  // ========================================
  // 8. Active Nav Link Highlighting
  // ========================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
