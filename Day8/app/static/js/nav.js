document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  // Toggle menu
  const toggleMenu = () => {
    const isActive = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
  };

  // Close menu
  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', toggleMenu);

  navLinks.forEach(link =>
    link.addEventListener('click', closeMenu)
  );
});
