/* ============================================================
   Food Nest — Shared JavaScript
   Handles: Loading overlay, Navbar scroll/mobile, Offer banner,
            Room status on homepage, Contact form
   ============================================================ */

/* ---------- Loading Overlay ---------- */
window.addEventListener('load', () => {
  const overlay = document.getElementById('loading-overlay');
  if (!overlay) return;
  setTimeout(() => {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 700);
  }, 800);
});

/* ---------- Navbar: Scroll Shadow ---------- */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ---------- Navbar: Mobile Hamburger ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close menu clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

/* ---------- Offer Banner ---------- */
function loadOfferBanner() {
  const el = document.getElementById('offer-text');
  if (!el) return;
  const DEFAULT = '🎉 15% OFF on online booking | Use code: FOODNEST15';
  const data = JSON.parse(localStorage.getItem('foodNestData') || '{}');
  el.textContent = data.offer ? '🎉 ' + data.offer : DEFAULT;
}
loadOfferBanner();

/* ---------- Homepage Room Status ---------- */
(function updateRoomStatusBadges() {
  const modEl   = document.getElementById('mod-status');
  const luxEl   = document.getElementById('lux-status');
  const ultraEl = document.getElementById('ultra-status');
  if (!modEl && !luxEl && !ultraEl) return;

  const DEFAULT_ROOMS = [
    { room: '101', status: 'available' },
    { room: '102', status: 'occupied' },
    { room: '103', status: 'available' },
    { room: '104', status: 'occupied' },
    { room: '105', status: 'available' }
  ];

  const data = JSON.parse(localStorage.getItem('foodNestData') || '{}');
  const rooms = data.rooms || DEFAULT_ROOMS;
  const availRooms = rooms.filter(r => r.status === 'available');
  const occRooms   = rooms.filter(r => r.status === 'occupied');

  function setStatus(el, available) {
    if (!el) return;
    if (available) {
      el.textContent = '● Rooms Available';
      el.className = 'room-status status-available';
    } else {
      el.textContent = '● Fully Occupied';
      el.className = 'room-status status-occupied';
    }
  }

  // Distribute: moderate → first 2 rooms, luxury → next 2, ultra → last 1
  const modAvail   = availRooms.some(r => r.room === '101' || r.room === '102');
  const luxAvail   = availRooms.some(r => r.room === '103' || r.room === '104');
  const ultraAvail = availRooms.some(r => r.room === '105');

  setStatus(modEl,   modAvail);
  setStatus(luxEl,   luxAvail);
  setStatus(ultraEl, ultraAvail);
})();

/* ---------- Homepage Offer Card: Dynamic ---------- */
(function updateOfferCard() {
  const el = document.getElementById('offer-main-text');
  if (!el) return;
  const data = JSON.parse(localStorage.getItem('foodNestData') || '{}');
  if (data.offer) el.textContent = data.offer;
})();

/* ---------- Contact Form ---------- */
(function initContactForm() {
  const btn = document.getElementById('contact-submit');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const msg = document.getElementById('contact-msg').value.trim();
    if (!name || !email || !msg) {
      btn.textContent = '⚠️ Fill all fields!';
      btn.style.background = 'rgba(229,57,53,0.2)';
      btn.style.color = '#ef5350';
      btn.style.border = '1px solid rgba(229,57,53,0.4)';
      setTimeout(() => {
        btn.textContent = 'Send Message 🚀';
        btn.style = '';
      }, 1800);
      return;
    }
    btn.textContent = '✅ Message Sent!';
    btn.disabled = true;
    setTimeout(() => {
      document.getElementById('contact-name').value = '';
      document.getElementById('contact-email').value = '';
      document.getElementById('contact-msg').value = '';
      btn.textContent = 'Send Message 🚀';
      btn.disabled = false;
    }, 2500);
  });
})();

/* ---------- Smooth Reveal on Scroll (Intersection Observer) ---------- */
(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll('.dish-card, .room-card, .offer-card, .category-card, .section-header');
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();
