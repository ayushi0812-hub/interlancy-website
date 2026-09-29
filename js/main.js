/**
 * Interlancy Education — Main JavaScript
 * Minimal, purposeful interactions for a calm, professional website.
 * Mobile-first. Accessible. Performant.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
   * 1. MOBILE NAVIGATION
   * ========================================= */
  const header = document.getElementById('header');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('active');

      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('nav-open');

      // Accessibility
      hamburger.setAttribute('aria-expanded', !isOpen);
      mobileMenu.setAttribute('aria-hidden', isOpen);
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        hamburger.focus();
      }
    });
  }

  /* =========================================
   * 2. STICKY HEADER
   * ========================================= */
  if (header) {
    let lastScrollY = 0;

    const onScroll = () => {
      const scrollY = window.scrollY;
      header.classList.toggle('scrolled', scrollY > 80);
      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* =========================================
   * 3. SCROLL REVEAL ANIMATION
   * ========================================= */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    // Respect reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Show everything immediately
      revealElements.forEach(el => el.classList.add('revealed'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Stagger reveal for adjacent elements
            const delay = entry.target.dataset.revealDelay || 0;
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, delay);
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach((el, index) => {
        // Add stagger delay for cards in grids
        const parent = el.parentElement;
        if (parent && (
          parent.classList.contains('principles__grid') ||
          parent.classList.contains('services__grid') ||
          parent.classList.contains('work-preview__grid')
        )) {
          const siblings = Array.from(parent.querySelectorAll('.reveal'));
          const siblingIndex = siblings.indexOf(el);
          el.dataset.revealDelay = siblingIndex * 100;
        }
        revealObserver.observe(el);
      });
    }
  }

  /* =========================================
   * 4. SMOOTH SCROLL FOR ANCHOR LINKS
   * ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* =========================================
   * 5. ACTIVE NAV LINK
   * ========================================= */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

});
