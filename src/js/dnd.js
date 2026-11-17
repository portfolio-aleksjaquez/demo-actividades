// Motor de arrastrar y colocar con Pointer Events (mouse, dedo y lápiz)
// más una alternativa de "tocar para tomar / tocar para colocar" que
// también funciona con teclado (Enter o Espacio).
import { announce, play, reducedMotion } from './common.js';

const DRAG_THRESHOLD = 6;
const EDGE = 56;
const MAX_SPEED = 12;

export function createBoard({ root, onChange, zoneName }) {
  const zones = () => [...root.querySelectorAll('[data-zone]')];
  const tokens = () => [...root.querySelectorAll('[data-token]')];
  const itemsEl = (zone) => zone.querySelector('.zone-items') || zone;
  const zoneOf = (token) => token.closest('[data-zone]');
  const tokensIn = (zone) => [...itemsEl(zone).children].filter((el) => el.matches('[data-token]'));
  const isTray = (zone) => zone.dataset.zone === 'tray';
  const nameOf = (zone) => (isTray(zone) ? 'la bandeja' : zoneName(zone));

  let selected = null;
  let locked = false;
  let drag = null;
  let suppressClickUntil = 0;

  /* ---------- Animación FLIP al mover tarjetas ---------- */
  function flip(mutate) {
    const all = tokens();
    const first = new Map(all.map((t) => [t, t.getBoundingClientRect()]));
    mutate();
    if (reducedMotion()) return;
    for (const t of all) {
      const a = first.get(t);
      const b = t.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      t.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
        { duration: 280, easing: 'cubic-bezier(.2,.9,.25,1.05)' },
      );
    }
  }

  function move(token, zone) {
    const from = zoneOf(token);
    if (from === zone) return false;
    if (!isTray(zone)) {
      const occupant = tokensIn(zone)[0];
      if (occupant) itemsEl(from).appendChild(occupant); // intercambio
    }
    itemsEl(zone).appendChild(token);
    return true;
  }

  function refresh() {
    for (const zone of zones()) {
      const filled = tokensIn(zone).length > 0;
      zone.classList.toggle('is-filled', filled);
      const btn = zone.querySelector('.drop-btn');
      if (btn) {
        if (isTray(zone)) btn.setAttribute('aria-label', 'Regresar la tarjeta a la bandeja');
        else {
          const occ = tokensIn(zone)[0];
          btn.setAttribute(
            'aria-label',
            `Colocar en ${nameOf(zone)}${occ ? `, ahora tiene ${occ.dataset.label}` : ', vacío'}`,
          );
        }
      }
    }
    for (const t of tokens()) {
      const z = zoneOf(t);
      const state = t.dataset.result === 'ok' ? ', correcta' : t.dataset.result === 'err' ? ', revisar' : '';
      t.setAttribute('aria-label', `${t.dataset.label}, en ${nameOf(z)}${state}`);
    }
  }

  function clearResults() {
    let had = false;
    for (const el of root.querySelectorAll('[data-result]')) {
      delete el.dataset.result;
      had = true;
    }
    return had;
  }

  function changed() {
    clearResults();
    refresh();
    onChange?.();
  }

  /* ---------- Selección (toque y teclado) ---------- */
  function setDropTabbable(on) {
    for (const b of root.querySelectorAll('.drop-btn')) b.tabIndex = on ? 0 : -1;
  }

  function select(token) {
    deselect(false);
    selected = token;
    token.setAttribute('aria-pressed', 'true');
    root.classList.add('has-selection');
    setDropTabbable(true);
    play('pick');
    announce(
      `Tomaste ${token.dataset.label}. Elige un lugar y presiona Enter o Espacio para colocarla. Escape para cancelar.`,
    );
  }

  function deselect(speak = true) {
    if (!selected) return;
    selected.setAttribute('aria-pressed', 'false');
    if (speak) announce(`Soltaste ${selected.dataset.label} sin moverla.`);
    selected = null;
    root.classList.remove('has-selection');
    setDropTabbable(false);
  }

  function placeSelected(zone) {
    const token = selected;
    deselect(false);
    let moved = false;
    flip(() => {
      moved = move(token, zone);
    });
    token.focus({ preventScroll: true });
    if (moved) {
      play('drop');
      changed();
      announce(`${token.dataset.label} colocada en ${nameOf(zone)}.`);
    }
  }

  root.addEventListener('click', (e) => {
    if (locked) return;
    if (performance.now() < suppressClickUntil) return;
    const token = e.target.closest('[data-token]');
    const dropBtn = e.target.closest('.drop-btn');
    if (token) {
      if (!selected) select(token);
      else if (selected === token) deselect();
      else if (zoneOf(token) === zoneOf(selected)) select(token);
      else placeSelected(zoneOf(token));
    } else if (dropBtn) {
      if (!selected) {
        announce('Primero toma una tarjeta.');
        return;
      }
      placeSelected(dropBtn.closest('[data-zone]'));
    }
  });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selected) {
      const t = selected;
      deselect();
      t.focus();
    }
  });

  /* ---------- Arrastre con Pointer Events ---------- */
  function zoneAt(x, y) {
    let hit = null;
    for (const z of zones()) {
      const r = z.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        if (!hit || isTray(hit)) hit = z; // preferir los lugares sobre la bandeja
      }
    }
    return hit;
  }

  function setOver(zone) {
    for (const z of zones()) z.classList.toggle('is-over', z === zone);
  }

  function position() {
    const { token, start, last } = drag;
    const dx = last.x - start.x + (window.scrollX - start.sx);
    const dy = last.y - start.y + (window.scrollY - start.sy);
    token.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-6, Math.min(6, (last.x - drag.prevX) * 0.6))}deg) scale(1.06)`;
    drag.prevX += (last.x - drag.prevX) * 0.25;
  }

  function autoScroll() {
    if (!drag?.active) return;
    const y = drag.last.y;
    let v = 0;
    if (y < EDGE) v = -Math.ceil(((EDGE - y) / EDGE) * MAX_SPEED);
    else if (y > window.innerHeight - EDGE) v = Math.ceil(((y - (window.innerHeight - EDGE)) / EDGE) * MAX_SPEED);
    if (v) window.scrollBy(0, v);
    position();
    setOver(zoneAt(drag.last.x, drag.last.y));
    drag.raf = requestAnimationFrame(autoScroll);
  }

  const blockTouch = (e) => {
    if (drag?.active) e.preventDefault();
  };
  document.addEventListener('touchmove', blockTouch, { passive: false });

  root.addEventListener('pointerdown', (e) => {
    const token = e.target.closest('[data-token]');
    if (!token || locked) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = {
      token,
      id: e.pointerId,
      active: false,
      start: { x: e.clientX, y: e.clientY, sx: window.scrollX, sy: window.scrollY },
      last: { x: e.clientX, y: e.clientY },
      prevX: e.clientX,
    };
    token.setPointerCapture(e.pointerId);
  });

  root.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.last = { x: e.clientX, y: e.clientY };
    if (!drag.active) {
      if (Math.hypot(e.clientX - drag.start.x, e.clientY - drag.start.y) < DRAG_THRESHOLD) return;
      drag.active = true;
      if (selected) deselect(false);
      drag.token.classList.add('is-dragging');
      document.documentElement.classList.add('is-dragging');
      play('pick');
      drag.raf = requestAnimationFrame(autoScroll);
    }
    e.preventDefault();
  });

  function endDrag(e, cancelled) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    if (!d.active) return; // fue un toque: lo maneja el evento click
    cancelAnimationFrame(d.raf);
    suppressClickUntil = performance.now() + 200;
    document.documentElement.classList.remove('is-dragging');
    const target = cancelled ? null : zoneAt(e.clientX, e.clientY);
    setOver(null);
    let moved = false;
    flip(() => {
      d.token.classList.remove('is-dragging');
      d.token.style.transform = '';
      if (target) moved = move(d.token, target);
    });
    if (moved) {
      play('drop');
      changed();
      announce(`${d.token.dataset.label} colocada en ${nameOf(target)}.`);
    }
  }

  root.addEventListener('pointerup', (e) => endDrag(e, false));
  root.addEventListener('pointercancel', (e) => endDrag(e, true));
  root.addEventListener('lostpointercapture', (e) => {
    if (drag && drag.active && e.pointerId === drag.id) endDrag(e, false);
  });

  /* ---------- API pública ---------- */
  function check() {
    const results = [];
    for (const zone of zones()) {
      if (isTray(zone)) continue;
      const token = tokensIn(zone)[0];
      if (!token) {
        results.push({ zone, token: null, correct: false });
        continue;
      }
      const correct = token.dataset.token === zone.dataset.accept;
      token.dataset.result = correct ? 'ok' : 'err';
      zone.dataset.result = correct ? 'ok' : 'err';
      results.push({ zone, token, correct });
    }
    refresh();
    return results;
  }

  function pending() {
    const tray = zones().find(isTray);
    return tray ? tokensIn(tray).length : 0;
  }

  function reset(order, animate = true) {
    deselect(false);
    clearResults();
    locked = false;
    root.classList.remove('is-locked');
    const tray = zones().find(isTray);
    const byId = new Map(tokens().map((t) => [t.dataset.token, t]));
    const put = () => {
      for (const id of order) itemsEl(tray).appendChild(byId.get(id));
    };
    if (animate) flip(put);
    else put();
    for (const t of tokens()) t.removeAttribute('aria-disabled');
    refresh();
  }

  function lock() {
    deselect(false);
    locked = true;
    root.classList.add('is-locked');
    for (const t of tokens()) t.setAttribute('aria-disabled', 'true');
  }

  refresh();
  return { check, reset, lock, pending, refresh };
}
