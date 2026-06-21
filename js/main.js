/* ============================================================
   Frío Total — main.js v2
   Navbar · Parallax · Scroll reveal · Multi-step form · WA
   ============================================================ */

'use strict';

const WA = '50496679577';
const QUOTE_EMAIL = 'andricksantos1@gmail.com'; // correo que recibe las cotizaciones

/* ── Navbar ─────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Mobile menu ────────────────────────────────────────── */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mob-menu').classList.toggle('open');
});
document.querySelectorAll('#mob-menu a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('mob-menu').classList.remove('open'))
);

/* ── Smooth anchor scroll ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ══════════════════════════════════════════════════
   PARALLAX — hero layers & hero title
══════════════════════════════════════════════════ */
const heroEl = document.getElementById('hero');
const layer1 = document.getElementById('hl1');
const layer2 = document.getElementById('hl2');
const layer3 = document.getElementById('hl3');

function parallaxTick() {
  if (!heroEl) return;
  const sy = window.scrollY;
  const heroH = heroEl.offsetHeight;
  if (sy > heroH * 1.2) return;

  // Layers move at different speeds — classic multi-plane parallax
  if (layer1) layer1.style.transform = `translateY(${sy * 0.12}px)`;
  if (layer2) layer2.style.transform = `translateY(${sy * 0.28}px)`;
  if (layer3) layer3.style.transform = `translateY(${sy * 0.45}px)`;

  // Hero text drifts subtly
  const heroText = document.querySelector('.hero-left');
  if (heroText) heroText.style.transform = `translateY(${sy * 0.18}px)`;
}

window.addEventListener('scroll', parallaxTick, { passive: true });

/* ══════════════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════════════════
   MULTI-STEP QUOTE FORM
══════════════════════════════════════════════════ */
const steps   = document.querySelectorAll('.f-step');
const nodes   = document.querySelectorAll('.fp-node');
const btnBack = document.getElementById('btn-back');
const btnNext = document.getElementById('btn-next');

let cur = 0;

// Accumulated form data object
const fd = {
  servicio:    '',
  equipo:      '',
  descripcion: '',
  ubicacion:   '',
  cantidad:    '',
  urgencia:    '',
  fecha:       '',
  hora:        '',
  nombre:      '',
  telefono:    '',
  direccion:   '',
  notas:       ''
};

/* ── Go to step n ───────────────────────────────────────── */
function goStep(n) {
  steps[cur].classList.remove('active');
  nodes[cur].classList.remove('active');
  if (n > cur) nodes[cur].classList.add('done');
  else         nodes[cur].classList.remove('done');

  cur = n;
  steps[cur].classList.add('active');
  nodes[cur].classList.remove('done');
  nodes[cur].classList.add('active');

  btnBack.disabled = cur === 0;

  const lastReal = steps.length - 2; // last step before success
  btnNext.textContent = cur === lastReal ? 'Enviar Cotización' : 'Siguiente';

  // Hide nav on success screen
  document.querySelector('.f-nav').style.display =
    cur === steps.length - 1 ? 'none' : 'flex';
}

/* ── Option buttons ─────────────────────────────────────── */
document.querySelectorAll('.opt').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.opts').querySelectorAll('.opt').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
  });
});

/* ── Next ───────────────────────────────────────────────── */
btnNext.addEventListener('click', () => {
  if (!validate(cur)) return;
  collect(cur);
  if (cur < steps.length - 1) goStep(cur + 1);
});

/* ── Back ───────────────────────────────────────────────── */
btnBack.addEventListener('click', () => {
  if (cur > 0) goStep(cur - 1);
});

/* ── Validation ─────────────────────────────────────────── */
function validate(step) {
  if (step === 0) {
    if (!document.querySelector('#step1 .opt.sel'))
      return toast('Por favor selecciona el tipo de servicio.'), false;
  }
  if (step === 1) {
    if (!document.querySelector('#step2 .opt.sel'))
      return toast('Por favor selecciona el tipo de equipo.'), false;
  }
  if (step === 2) {
    const v = document.getElementById('f-desc').value.trim();
    if (!v) return toast('Describe el problema o requerimiento.'), false;
  }
  if (step === 3) {
    const v = document.getElementById('f-date').value;
    if (!v) return toast('Selecciona una fecha preferida.'), false;
  }
  if (step === 4) {
    const n = document.getElementById('f-name').value.trim();
    const p = document.getElementById('f-phone').value.trim();
    if (!n || !p) return toast('Nombre y teléfono son requeridos.'), false;
  }
  return true;
}

/* ── Collect step data ──────────────────────────────────── */
function collect(step) {
  const sel = g => {
    const el = document.querySelector(`${g} .opt.sel`);
    return el ? el.dataset.val : '';
  };

  if (step === 0) fd.servicio    = sel('#step1');
  if (step === 1) fd.equipo      = sel('#step2');
  if (step === 2) {
    fd.descripcion = document.getElementById('f-desc').value.trim();
    fd.ubicacion   = document.getElementById('f-loc').value.trim();
    fd.cantidad    = sel('#step3');
  }
  if (step === 3) {
    fd.fecha    = document.getElementById('f-date').value;
    fd.hora     = document.getElementById('f-time').value;
    fd.urgencia = sel('#step4');
  }
  if (step === 4) {
    fd.nombre    = document.getElementById('f-name').value.trim();
    fd.telefono  = document.getElementById('f-phone').value.trim();
    fd.direccion = document.getElementById('f-addr').value.trim();
    fd.notas     = document.getElementById('f-notes').value.trim();
    submitForm();
  }
}

/* ── Build & send WhatsApp message ──────────────────────── */
function submitForm() {
  // Format date nicely
  let fechaStr = 'No especificada';
  if (fd.fecha) {
    const d = new Date(fd.fecha + 'T12:00:00');
    fechaStr = d.toLocaleDateString('es-HN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    fechaStr = fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1);
  }

  const lines = [
    '*DAVNI — SOLICITUD DE COTIZACIÓN*',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '*SERVICIO SOLICITADO*',
    `• Tipo de servicio: ${fd.servicio}`,
    `• Tipo de equipo:   ${fd.equipo}`,
    fd.cantidad  ? `• Cantidad:         ${fd.cantidad}` : null,
    '',
    '*DESCRIPCIÓN DEL TRABAJO*',
    fd.descripcion,
    fd.ubicacion ? `• Área/Zona: ${fd.ubicacion}` : null,
    '',
    '*FECHA Y HORARIO*',
    `• Fecha preferida: ${fechaStr}`,
    fd.hora     ? `• Hora preferida:  ${fd.hora}` : null,
    fd.urgencia ? `• Urgencia:        ${fd.urgencia}` : null,
    '',
    '*DATOS DE CONTACTO*',
    `• Nombre:    ${fd.nombre}`,
    `• Teléfono:  ${fd.telefono}`,
    fd.direccion ? `• Dirección: ${fd.direccion}` : null,
    fd.notas     ? `• Notas:     ${fd.notas}` : null,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '_Cotización enviada desde el sitio web_',
  ];

  const msg = lines.filter(l => l !== null).join('\n');

  // Send a copy by email (fire-and-forget — never blocks the WhatsApp flow)
  sendQuoteEmail(fechaStr);

  // Show success screen
  goStep(steps.length - 1);

  // Open WhatsApp after short delay so user sees confirmation
  setTimeout(() => {
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
  }, 700);
}

/* ── Send quote by email via FormSubmit (no backend needed) ───
   First-ever submission triggers a one-time confirmation email
   to QUOTE_EMAIL — it must be approved once for delivery to start. */
function sendQuoteEmail(fechaStr) {
  const payload = {
    _subject: `Nueva cotización DAVNI — ${fd.nombre || 'Sin nombre'}`,
    _template: 'table',
    _captcha: 'false',
    'Servicio solicitado': fd.servicio,
    'Tipo de equipo': fd.equipo,
    'Cantidad de unidades': fd.cantidad,
    'Descripción del trabajo': fd.descripcion,
    'Área / zona': fd.ubicacion,
    'Fecha preferida': fechaStr,
    'Hora preferida': fd.hora,
    'Urgencia': fd.urgencia,
    'Nombre': fd.nombre,
    'Teléfono / WhatsApp': fd.telefono,
    'Dirección': fd.direccion,
    'Notas adicionales': fd.notas,
  };

  fetch(`https://formsubmit.co/ajax/${QUOTE_EMAIL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(err => console.warn('No se pudo enviar la copia por correo:', err));
}

/* ── Toast error ────────────────────────────────────────── */
function toast(msg) {
  let t = document.getElementById('_toast');
  if (!t) {
    t = document.createElement('div');
    t.id = '_toast';
    Object.assign(t.style, {
      position: 'fixed', bottom: '24px', left: '50%',
      transform: 'translateX(-50%) translateY(0)',
      background: '#C0392B', color: '#fff',
      padding: '11px 22px', borderRadius: '8px',
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: '700', fontSize: '.85rem',
      zIndex: '9999', boxShadow: '0 4px 20px rgba(0,0,0,.25)',
      opacity: '1', transition: 'opacity .3s', whiteSpace: 'nowrap',
    });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._t);
  t._t = setTimeout(() => (t.style.opacity = '0'), 3200);
}

/* ── Direct WA buttons ──────────────────────────────────── */
document.querySelectorAll('[data-wa]').forEach(el => {
  el.addEventListener('click', () => {
    const m = el.dataset.waMsg || '¡Hola! Quiero información sobre sus servicios de aire acondicionado.';
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(m)}`, '_blank');
  });
});

/* ── Set min date to today ──────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const di = document.getElementById('f-date');
  if (di) di.min = new Date().toISOString().split('T')[0];
});
