import '../css/base.css';
import '../css/emparejar.css';
import { initTopbar, shuffle, play, celebrate, showFeedback, hideFeedback, ICONS, announce } from './common.js';
import { createBoard } from './dnd.js';
import { pie, bar, grid } from './art.js';

const PAIRS = [
  { id: 'f12', n: 1, d: 2, word: 'un medio', art: () => pie(2, 1), shape: 'Círculo' },
  { id: 'f14', n: 1, d: 4, word: 'un cuarto', art: () => grid(2, 2, 1, '#FFC53D'), shape: 'Cuadrado' },
  { id: 'f34', n: 3, d: 4, word: 'tres cuartos', art: () => pie(4, 3, '#F2701D'), shape: 'Círculo' },
  { id: 'f13', n: 1, d: 3, word: 'un tercio', art: () => bar(3, 1, '#E8507A'), shape: 'Barra' },
  { id: 'f23', n: 2, d: 3, word: 'dos tercios', art: () => pie(3, 2, '#5BB35F'), shape: 'Círculo' },
  { id: 'f25', n: 2, d: 5, word: 'dos quintos', art: () => bar(5, 2), shape: 'Barra' },
];
const LETTERS = 'ABCDEF';

const describe = (p) =>
  `${p.shape} dividido${p.shape === 'Barra' ? 'a' : ''} en ${p.d} partes iguales, ${p.n} ${p.n === 1 ? 'coloreada' : 'coloreadas'}`;

initTopbar();

const root = document.querySelector('[data-board]');
const tray = root.querySelector('[data-tray]');
const figures = root.querySelector('[data-figures]');
const feedback = root.querySelector('[data-feedback]');
const win = root.querySelector('[data-win]');
const checkBtn = root.querySelector('[data-check]');
const resetBtn = root.querySelector('[data-reset]');
const progress = root.querySelector('[data-progress]');

function buildFigures() {
  figures.innerHTML = '';
  shuffle(PAIRS).forEach((p, i) => {
    const li = document.createElement('li');
    li.className = 'figure zone';
    li.dataset.zone = 'figure';
    li.dataset.accept = p.id;
    li.dataset.name = `la figura ${LETTERS[i]}`;
    li.dataset.desc = describe(p);
    li.innerHTML = `
      <button class="drop-btn" type="button" tabindex="-1"></button>
      <span class="fig-letter" aria-hidden="true">${LETTERS[i]}</span>
      <span class="fig-art" role="img" aria-label="Figura ${LETTERS[i]}: ${describe(p)}">${p.art()}</span>
      <span class="pocket" aria-hidden="true"><span class="pocket-ghost">Suelta aquí</span></span>
      <div class="zone-items"></div>`;
    figures.appendChild(li);
  });
}

for (const p of PAIRS) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'token frac-card';
  b.dataset.token = p.id;
  b.dataset.label = `${p.word} (${p.n}/${p.d})`;
  b.setAttribute('aria-pressed', 'false');
  b.setAttribute('aria-describedby', 'instrucciones');
  b.innerHTML = `
    <span class="mark" aria-hidden="true"><span class="i-ok">${ICONS.check}</span><span class="i-err">${ICONS.cross}</span></span>
    <span class="frac" aria-hidden="true"><span class="num">${p.n}</span><span class="den">${p.d}</span></span>
    <span class="frac-word" aria-hidden="true">${p.word}</span>`;
  tray.appendChild(b);
}

buildFigures();

let board;
function makeBoard() {
  board = createBoard({
    root,
    zoneName: (z) => `${z.dataset.name} (${z.dataset.desc})`,
    onChange: () => {
      hideFeedback(feedback);
      updateProgress();
    },
  });
}
makeBoard();

function updateProgress() {
  const placed = PAIRS.length - board.pending();
  progress.textContent = `${placed} de ${PAIRS.length} unidas`;
}

function reset(animate = true) {
  root.classList.remove('is-complete');
  // Las fracciones regresan a la bandeja y las figuras cambian de lugar.
  board.reset(shuffle(PAIRS.map((p) => p.id)), animate);
  buildFigures();
  board.refresh();
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
      missing === 1 ? 'Falta 1 fracción por unir.' : `Faltan ${missing} fracciones por unir.`,
      'Cada figura necesita una fracción. Arrastra las que quedan en la bandeja.',
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
    showFeedback(feedback, 'ok', '¡Perfecto! Todas las fracciones están con su figura.', 'Leíste muy bien cuántas partes tiene cada entero y cuántas están coloreadas.');
    win.hidden = false;
    checkBtn.disabled = true;
    resetBtn.focus();
  } else {
    play('err');
    const wrong = results.filter((r) => !r.correct).map((r) => r.zone.dataset.name.replace('la figura ', ''));
    showFeedback(
      feedback,
      'err',
      `¡Casi! ${good} de ${results.length} parejas son correctas.`,
      `Revisa ${wrong.length === 1 ? 'la figura' : 'las figuras'} ${wrong.join(', ')}. Cuenta primero las partes iguales (el número de abajo) y después las coloreadas (el número de arriba).`,
    );
  }
});

resetBtn.addEventListener('click', () => {
  reset();
  announce('Actividad reiniciada. Las fracciones volvieron a la bandeja y las figuras cambiaron de lugar.');
});

reset(false);
