import '../css/base.css';
import '../css/ordenar.css';
import { initTopbar, shuffle, play, celebrate, showFeedback, hideFeedback, ICONS, announce } from './common.js';
import { createBoard } from './dnd.js';
import { huevo, oruga, crisalida, mariposa } from './art.js';

const STAGES = [
  {
    id: 'huevo',
    label: 'Huevo',
    art: huevo,
    hint: 'Todo comienza con algo diminuto: la mariposa pone un huevo debajo de una hoja de algodoncillo.',
  },
  {
    id: 'oruga',
    label: 'Oruga',
    art: oruga,
    hint: 'Del huevo sale una oruga a rayas que come hojas y crece muchísimo.',
  },
  {
    id: 'crisalida',
    label: 'Crisálida',
    art: crisalida,
    hint: 'Cuando la oruga ya creció, se cuelga y forma una crisálida verde con puntos dorados.',
  },
  {
    id: 'mariposa',
    label: 'Mariposa adulta',
    art: mariposa,
    hint: 'Al final, de la crisálida sale la mariposa adulta, lista para volar.',
  },
];

initTopbar();

const root = document.querySelector('[data-board]');
const tray = root.querySelector('[data-tray]');
const slots = root.querySelector('[data-slots]');
const feedback = root.querySelector('[data-feedback]');
const win = root.querySelector('[data-win]');
const checkBtn = root.querySelector('[data-check]');
const resetBtn = root.querySelector('[data-reset]');
const progress = root.querySelector('[data-progress]');

STAGES.forEach((s, i) => {
  const li = document.createElement('li');
  li.className = 'slot zone';
  li.dataset.zone = 'slot';
  li.dataset.accept = s.id;
  li.dataset.name = `el lugar ${i + 1}`;
  li.innerHTML = `
    <button class="drop-btn" type="button" tabindex="-1"></button>
    <span class="slot-num" aria-hidden="true">${i + 1}</span>
    <span class="slot-ghost" aria-hidden="true">Etapa ${i + 1}</span>
    <div class="zone-items"></div>`;
  slots.appendChild(li);
});

for (const s of STAGES) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'token stage-card';
  b.dataset.token = s.id;
  b.dataset.label = s.label;
  b.setAttribute('aria-pressed', 'false');
  b.setAttribute('aria-describedby', 'instrucciones');
  b.innerHTML = `
    <span class="mark" aria-hidden="true"><span class="i-ok">${ICONS.check}</span><span class="i-err">${ICONS.cross}</span></span>
    <span class="card-art">${s.art()}</span>
    <span class="card-name">${s.label}</span>`;
  tray.appendChild(b);
}

const board = createBoard({
  root,
  zoneName: (z) => z.dataset.name,
  onChange: () => {
    hideFeedback(feedback);
    updateProgress();
  },
});

function updateProgress() {
  const placed = STAGES.length - board.pending();
  progress.textContent = `${placed} de ${STAGES.length} colocadas`;
}

function newOrder() {
  const ids = STAGES.map((s) => s.id);
  let order;
  do order = shuffle(ids);
  while (order.join() === ids.join());
  return order;
}

function reset(animate = true) {
  root.classList.remove('is-complete');
  board.reset(newOrder(), animate);
  hideFeedback(feedback);
  win.hidden = true;
  checkBtn.disabled = false;
  updateProgress();
}

checkBtn.addEventListener('click', () => {
  const missing = board.pending();
  if (missing > 0) {
    play('err');
    showFeedback(
      feedback,
      'info',
      missing === 1 ? 'Falta 1 tarjeta por colocar.' : `Faltan ${missing} tarjetas por colocar.`,
      'Coloca todas las tarjetas en los lugares del 1 al 4 y vuelve a comprobar.',
    );
    return;
  }
  const results = board.check();
  const good = results.filter((r) => r.correct).length;
  if (good === results.length) {
    board.lock();
    play('win');
    celebrate();
    root.classList.add('is-complete');
    showFeedback(feedback, 'ok', '¡Excelente! Las cuatro etapas están en orden.', 'Huevo, oruga, crisálida y mariposa adulta: así se transforma la monarca.');
    win.hidden = false;
    checkBtn.disabled = true;
    resetBtn.focus();
  } else {
    play('err');
    const firstWrong = results.find((r) => !r.correct);
    const stage = STAGES.find((s) => s.id === firstWrong.zone.dataset.accept);
    showFeedback(
      feedback,
      'err',
      `Vas muy bien: ${good} de ${results.length} en su lugar.`,
      `Mueve las tarjetas marcadas en rojo. Pista para el lugar ${STAGES.indexOf(stage) + 1}: ${stage.hint}`,
    );
  }
});

resetBtn.addEventListener('click', () => {
  reset();
  announce('Actividad reiniciada. Las tarjetas volvieron a la bandeja en un orden nuevo.');
});

reset(false);
