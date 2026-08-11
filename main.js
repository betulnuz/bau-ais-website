// Header scroll state
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => nav.classList.toggle('open'));

// Active nav link
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav a').forEach(a => {
  if (a.getAttribute('href') === path) a.classList.add('active');
});

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '-40px 0px' });
document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
