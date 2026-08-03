let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.dataset.lang === lang ? 'block' : 'none';
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const t = btn.textContent.trim();
    btn.classList.toggle('active',
      (lang==='en' && t==='EN') ||
      (lang==='de' && t==='DE') ||
      (lang==='hi' && t.includes('हि')) ||
      (lang==='ml' && t.includes('മല'))
    );
  });
}

function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const open = links.style.display === 'flex';
  if (open) {
    links.style.display = 'none';
  } else {
    links.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:68px;left:0;right:0;background:rgba(250,246,238,0.98);backdrop-filter:blur(16px);padding:1.5rem 5vw;gap:1.2rem;border-bottom:1px solid rgba(160,135,95,0.3);z-index:99;';
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;
  btn.textContent = '✓ Sent — thank you';
  btn.style.background = '#3D7A6A';
  btn.style.minWidth = '180px';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.minWidth = ''; setLang(currentLang); }, 3500);
}

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.07 });

document.querySelectorAll('.service-card,.shop-card,.testimonial-card,.about-visual,.about-text,.hero-panel,.contact-panel').forEach(el => {
  el.style.cssText += 'opacity:0;transform:translateY(16px);transition:opacity 0.6s ease,transform 0.6s ease;';
  observer.observe(el);
});

setLang('en');