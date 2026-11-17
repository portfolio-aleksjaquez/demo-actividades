// Utilidades compartidas: sonido (WebAudio), celebración, anuncios y barra superior.

export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Anuncios para lectores de pantalla ---------- */
let liveEl;
export function announce(text) {
  if (!liveEl) {
    liveEl = document.createElement('div');
    liveEl.className = 'sr-only';
    liveEl.setAttribute('aria-live', 'polite');
    liveEl.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveEl);
  }
  // Vaciar primero para que el mismo texto se vuelva a anunciar.
  liveEl.textContent = '';
  window.setTimeout(() => {
    liveEl.textContent = text;
  }, 40);
}

/* ---------- Sonido generado con WebAudio ---------- */
const SOUND_KEY = 'demo-actividades:sonido';
let ctx = null;
let soundOn = false;
try {
  soundOn = localStorage.getItem(SOUND_KEY) === '1';
} catch {
  soundOn = false;
}

const NOTES = {
  pick: [[740, 0.05, 'sine']],
  drop: [[520, 0.06, 'sine'], [660, 0.07, 'sine']],
  ok: [[523, 0.09], [659, 0.09], [784, 0.16]],
  err: [[311, 0.12, 'sawtooth', 0.05], [233, 0.2, 'sawtooth', 0.05]],
  win: [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.12], [784, 0.08], [1047, 0.34]],
};

export function play(name) {
  if (!soundOn || !NOTES[name]) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    let t = ctx.currentTime + 0.01;
    for (const [freq, dur, type = 'triangle', vol = 0.16] of NOTES[name]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
      t += dur * 0.85;
    }
  } catch {
    /* Sin audio disponible: se ignora. */
  }
}

const ICON_ON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const ICON_OFF = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

function renderSoundButton(btn) {
  btn.setAttribute('aria-pressed', String(soundOn));
  btn.innerHTML = `${soundOn ? ICON_ON : ICON_OFF}<span>${soundOn ? 'Sonido activado' : 'Activar sonido'}</span>`;
}

export function initTopbar() {
  const btn = document.querySelector('[data-sound-toggle]');
  if (!btn) return;
  renderSoundButton(btn);
  btn.addEventListener('click', () => {
    soundOn = !soundOn;
    try {
      localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0');
    } catch {
      /* almacenamiento no disponible */
    }
    renderSoundButton(btn);
    if (soundOn) play('drop');
    announce(soundOn ? 'Sonido activado' : 'Sonido desactivado');
  });
}

/* ---------- Celebración con confeti de papel ---------- */
const CONFETTI_COLORS = ['#F2701D', '#FFC53D', '#14A3A3', '#E8507A', '#5BB35F', '#3D6FE0'];

export function celebrate() {
  if (reducedMotion()) return;
  const layer = document.createElement('div');
  layer.className = 'confetti';
  layer.setAttribute('aria-hidden', 'true');
  const count = window.innerWidth < 600 ? 60 : 110;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    const size = 7 + Math.random() * 9;
    p.style.setProperty('--x', `${Math.random() * 100}vw`);
    p.style.setProperty('--drift', `${(Math.random() - 0.5) * 220}px`);
    p.style.setProperty('--rot', `${(Math.random() - 0.5) * 1440}deg`);
    p.style.setProperty('--dur', `${2.2 + Math.random() * 1.8}s`);
    p.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    p.style.width = `${size}px`;
    p.style.height = `${size * (Math.random() > 0.5 ? 0.45 : 1)}px`;
    p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    if (Math.random() > 0.7) p.style.borderRadius = '50%';
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 4800);
}

/* Íconos pequeños reutilizables */
export const ICONS = {
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  cross: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>`,
  hint: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  star: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z" fill="currentColor" stroke="#1F2A44" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
};

/**
 * Muestra la retroalimentación en el globo de texto.
 * kind: 'ok' | 'err' | 'info'
 */
export function showFeedback(el, kind, title, body = '') {
  el.hidden = false;
  el.dataset.kind = kind;
  const icon = kind === 'ok' ? ICONS.check : kind === 'err' ? ICONS.hint : ICONS.hint;
  el.innerHTML = `<span class="feedback-icon">${icon}</span><div><p class="feedback-title">${title}</p>${
    body ? `<p class="feedback-body">${body}</p>` : ''
  }</div>`;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

export function hideFeedback(el) {
  el.hidden = true;
  el.innerHTML = '';
}
