let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  try { localStorage.setItem('shaliniLang', lang); } catch(e) {}
  document.querySelectorAll('[data-lang]').forEach(el => {
    const active = el.dataset.lang === lang;
    el.style.display = active ? (el.classList.contains('lang-inline') ? 'inline' : 'block') : 'none';
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
  document.querySelectorAll('.i18n-placeholder').forEach(el => {
    const ph = el.getAttribute('data-ph-' + lang) || el.getAttribute('data-ph-en');
    if (ph !== null) el.setAttribute('placeholder', ph);
  });
  document.querySelectorAll('.i18n-option').forEach(opt => {
    const txt = opt.getAttribute('data-' + lang) || opt.getAttribute('data-en');
    if (txt !== null) opt.textContent = txt;
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

// Contact form: submits to Formspree via fetch (AJAX), no page reload.
// Success/error text is only shown after Formspree actually confirms the result.
const formMessages = {
  en: {
    sending: 'Sending…',
    success: 'Thank you — your message has been sent. I will get back to you within 24 hours.',
    error: 'Something went wrong and your message was not sent. Please try again, or email me directly at shobha@shaliniliving.de.'
  },
  de: {
    sending: 'Wird gesendet…',
    success: 'Vielen Dank — Ihre Nachricht wurde gesendet. Ich melde mich innerhalb von 24 Stunden bei Ihnen.',
    error: 'Es ist ein Fehler aufgetreten — Ihre Nachricht wurde nicht gesendet. Bitte versuchen Sie es erneut oder schreiben Sie mir direkt an shobha@shaliniliving.de.'
  },
  hi: {
    sending: 'भेजा जा रहा है…',
    success: 'धन्यवाद — आपका संदेश भेज दिया गया है। मैं 24 घंटे के भीतर आपसे संपर्क करूंगी।',
    error: 'कुछ गड़बड़ी हुई और आपका संदेश नहीं भेजा जा सका। कृपया पुनः प्रयास करें या मुझे सीधे shobha@shaliniliving.de पर ईमेल करें।'
  },
  ml: {
    sending: 'അയക്കുന്നു…',
    success: 'നന്ദി — നിങ്ങളുടെ സന്ദേശം അയച്ചു കഴിഞ്ഞു. 24 മണിക്കൂറിനുള്ളിൽ ഞാൻ നിങ്ങളെ ബന്ധപ്പെടും.',
    error: 'ഒരു തകരാറ് സംഭവിച്ചു, നിങ്ങളുടെ സന്ദേശം അയച്ചില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ shobha@shaliniliving.de എന്ന വിലാസത്തിൽ നേരിട്ട് ബന്ധപ്പെടുക.'
  }
};

function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  const msgs = formMessages[currentLang] || formMessages.en;

  if (!btn.dataset.origHtml) btn.dataset.origHtml = btn.innerHTML;

  btn.disabled = true;
  btn.textContent = msgs.sending;
  if (status) {
    status.textContent = '';
    status.style.color = '';
  }

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      form.reset();
      if (status) {
        status.textContent = msgs.success;
        status.style.color = '#3D7A6A';
      }
    } else {
      return response.json().catch(() => null).then(data => {
        const detail = (data && Array.isArray(data.errors))
          ? data.errors.map(x => x.message).filter(Boolean).join(', ')
          : '';
        if (status) {
          status.textContent = detail ? (msgs.error + ' (' + detail + ')') : msgs.error;
          status.style.color = '#B85538';
        }
      });
    }
  })
  .catch(() => {
    if (status) {
      status.textContent = msgs.error;
      status.style.color = '#B85538';
    }
  })
  .finally(() => {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.origHtml;
    setLang(currentLang);
  });
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

let savedLang = 'en';
try { savedLang = localStorage.getItem('shaliniLang') || 'en'; } catch(e) {}
setLang(savedLang);
