import '../css/base.css';
import '../css/quiz.css';
import { initTopbar, shuffle, play, celebrate, showFeedback, hideFeedback, ICONS, announce } from './common.js';
import { SPACE } from './art.js';

const QUESTIONS = [
  {
    id: 'cercano',
    art: 'mercurio',
    text: '¿Cuál es el planeta más cercano al Sol?',
    answer: 'Mercurio',
    why: 'Mercurio es el primer planeta del sistema solar. Por eso le da la vuelta al Sol más rápido que todos: ¡en solo 88 días!',
    options: {
      Mercurio: '',
      Venus: 'Venus es el segundo planeta. Está cerca del Sol, pero Mercurio está todavía más cerca.',
      Tierra: 'La Tierra es el tercer planeta. Antes de ella están Mercurio y Venus.',
      Marte: 'Marte es el cuarto planeta; está más lejos del Sol que la Tierra.',
    },
  },
  {
    id: 'sol',
    art: 'sol',
    text: '¿Qué es el Sol?',
    answer: 'Una estrella',
    why: 'El Sol es una estrella: una enorme esfera de gases muy calientes que produce su propia luz y calor.',
    options: {
      'Una estrella': '',
      'Un planeta': 'Los planetas no producen luz propia: giran alrededor de una estrella.',
      'Un satélite': 'Un satélite gira alrededor de un planeta, como la Luna alrededor de la Tierra. El Sol no gira alrededor de ningún planeta.',
      'Un cometa': 'Los cometas son bolas de hielo y polvo que viajan alrededor del Sol. El Sol es muchísimo más grande.',
    },
  },
  {
    id: 'grande',
    art: 'jupiter',
    text: '¿Cuál es el planeta más grande del sistema solar?',
    answer: 'Júpiter',
    why: 'Júpiter es el más grande: dentro de él cabrían más de mil planetas Tierra. Su Gran Mancha Roja es una tormenta gigante.',
    options: {
      Júpiter: '',
      Saturno: 'Saturno es enorme y es el segundo más grande, pero Júpiter lo supera.',
      Tierra: 'La Tierra es pequeña comparada con los planetas gigantes como Júpiter y Saturno.',
      Neptuno: 'Neptuno es un gigante helado, pero es mucho más pequeño que Júpiter.',
    },
  },
  {
    id: 'rojo',
    art: 'marte',
    text: '¿Qué planeta es conocido como “el planeta rojo”?',
    answer: 'Marte',
    why: 'Marte se ve rojizo porque su suelo tiene mucho óxido de hierro, algo parecido al óxido de un clavo viejo.',
    options: {
      Marte: '',
      Venus: 'Venus está cubierto de nubes amarillentas; no es el planeta rojo.',
      Júpiter: 'Júpiter tiene franjas de colores y una mancha roja, pero el planeta rojo es Marte.',
      Mercurio: 'Mercurio es gris y lleno de cráteres, parecido a nuestra Luna.',
    },
  },
  {
    id: 'vuelta',
    art: 'tierra',
    text: '¿Cuánto tarda la Tierra en dar una vuelta completa alrededor del Sol?',
    answer: 'Unos 365 días',
    why: 'La Tierra tarda unos 365 días, es decir, un año, en recorrer su órbita alrededor del Sol. A ese movimiento se le llama traslación.',
    options: {
      'Unos 365 días': '',
      '24 horas': 'En 24 horas la Tierra gira sobre sí misma (rotación) y por eso hay día y noche. La vuelta al Sol tarda mucho más.',
      'Un mes': 'Un mes es, más o menos, lo que tarda la Luna en dar la vuelta a la Tierra.',
      'Diez años': 'Diez años son diez vueltas completas de la Tierra alrededor del Sol.',
    },
  },
  {
    id: 'anillos',
    art: 'saturno',
    text: '¿Qué planeta tiene los anillos más grandes y fáciles de ver?',
    answer: 'Saturno',
    why: 'Saturno tiene los anillos más grandes y brillantes. Están formados por millones de trozos de hielo y roca.',
    options: {
      Saturno: '',
      Júpiter: 'Júpiter tiene anillos, pero son muy delgados y oscuros; casi no se ven.',
      Marte: 'Marte no tiene anillos; tiene dos lunas pequeñas llamadas Fobos y Deimos.',
      Tierra: 'La Tierra no tiene anillos. Lo que gira a su alrededor es la Luna.',
    },
  },
];

initTopbar();

const $ = (s) => document.querySelector(s);
const card = $('[data-quiz]');
const artEl = $('[data-art]');
const countEl = $('[data-count]');
const dotsEl = $('[data-dots]');
const form = $('[data-form]');
const questionEl = $('[data-question]');
const optionsEl = $('[data-options]');
const feedback = $('[data-feedback]');
const primary = $('[data-primary]');
const resetBtn = $('[data-reset]');
const results = $('[data-results]');
const resultsTitle = $('[data-results-title]');
const starsEl = $('[data-stars]');
const resultsMsg = $('[data-results-msg]');
const resultsList = $('[data-results-list]');
const retry = $('[data-retry]');

let order = [];
let index = 0;
let answers = [];
let checked = false;

const CHECK_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const NEXT_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function setPrimary(mode) {
  primary.dataset.mode = mode;
  const labels = { check: 'Comprobar', next: 'Siguiente', finish: 'Ver mi puntaje' };
  primary.innerHTML = `${mode === 'check' ? CHECK_ICON : NEXT_ICON}${labels[mode]}`;
}

function start() {
  order = shuffle(QUESTIONS);
  answers = [];
  index = 0;
  results.hidden = true;
  form.hidden = false;
  card.classList.remove('is-done');
  render(false);
}

function renderDots() {
  dotsEl.innerHTML = order
    .map((q, i) => {
      const a = answers[i];
      const cls = a ? (a.correct ? 'ok' : 'err') : i === index ? 'now' : '';
      return `<li class="${cls}"></li>`;
    })
    .join('');
}

function render(focus = true) {
  const q = order[index];
  checked = false;
  artEl.innerHTML = SPACE[q.art]();
  artEl.classList.remove('enter');
  void artEl.offsetWidth;
  artEl.classList.add('enter');
  countEl.textContent = `Pregunta ${index + 1} de ${order.length}`;
  questionEl.textContent = q.text;
  const opts = shuffle(Object.keys(q.options));
  optionsEl.innerHTML = opts
    .map(
      (o, i) => `
      <label class="option">
        <input type="radio" name="respuesta" value="${o}" />
        <span class="option-letter" aria-hidden="true">${'ABCD'[i]}</span>
        <span class="option-text">${o}</span>
        <span class="option-mark" aria-hidden="true"></span>
      </label>`,
    )
    .join('');
  hideFeedback(feedback);
  setPrimary('check');
  primary.disabled = false;
  renderDots();
  if (focus) questionEl.focus();
}

function selectedValue() {
  return form.querySelector('input[name="respuesta"]:checked')?.value;
}

function check() {
  const q = order[index];
  const value = selectedValue();
  if (!value) {
    play('err');
    showFeedback(feedback, 'info', 'Elige una respuesta primero.', 'Toca o selecciona una de las opciones y después presiona Comprobar.');
    return;
  }
  checked = true;
  const correct = value === q.answer;
  answers[index] = { q, value, correct };
  for (const label of optionsEl.querySelectorAll('.option')) {
    const input = label.querySelector('input');
    input.disabled = true;
    if (input.value === q.answer) {
      label.dataset.result = 'ok';
      label.querySelector('.option-mark').innerHTML = ICONS.check;
    } else if (input.value === value) {
      label.dataset.result = 'err';
      label.querySelector('.option-mark').innerHTML = ICONS.cross;
    }
  }
  if (correct) {
    play('ok');
    showFeedback(feedback, 'ok', '¡Correcto!', q.why);
  } else {
    play('err');
    showFeedback(
      feedback,
      'err',
      `Casi. La respuesta correcta es: ${q.answer}.`,
      `${q.options[value]} ${q.why}`,
    );
  }
  renderDots();
  setPrimary(index === order.length - 1 ? 'finish' : 'next');
  primary.focus();
}

function finish() {
  const score = answers.filter((a) => a.correct).length;
  const total = order.length;
  form.hidden = true;
  results.hidden = false;
  card.classList.add('is-done');
  artEl.innerHTML = SPACE.saturno();
  countEl.textContent = 'Resultados';
  renderDots();
  resultsTitle.textContent = `Obtuviste ${score} de ${total}`;
  const stars = score === total ? 3 : score >= total - 2 ? 2 : 1;
  starsEl.innerHTML = [0, 1, 2]
    .map((i) => `<span class="${i < stars ? 'on' : ''}">${ICONS.star}</span>`)
    .join('');
  starsEl.setAttribute('aria-label', `${stars} de 3 estrellas`);
  starsEl.setAttribute('role', 'img');
  resultsMsg.textContent =
    score === total
      ? '¡Increíble! Eres una experta o un experto del sistema solar.'
      : score >= total - 2
        ? '¡Muy buen viaje! Repasa las preguntas marcadas y vuelve a intentarlo.'
        : 'Cada intento te acerca a las estrellas. Lee las explicaciones y reintenta.';
  resultsList.innerHTML = answers
    .map(
      (a) => `<li class="${a.correct ? 'ok' : 'err'}"><span class="r-icon" aria-hidden="true">${a.correct ? ICONS.check : ICONS.cross}</span>
        <span><strong>${a.q.text}</strong><br />Respondiste “${a.value}”${a.correct ? '' : `; la correcta es “${a.q.answer}”`}.
        <span class="sr-only">${a.correct ? 'Correcta' : 'Incorrecta'}</span></span></li>`,
    )
    .join('');
  play('win');
  celebrate();
  resultsTitle.focus();
  announce(`Terminaste. Obtuviste ${score} de ${total} respuestas correctas.`);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const mode = primary.dataset.mode;
  if (mode === 'check' && !checked) check();
  else if (mode === 'next') {
    index++;
    render();
  } else if (mode === 'finish') finish();
});

optionsEl.addEventListener('change', () => {
  if (!checked && feedback.dataset.kind === 'info') hideFeedback(feedback);
});

resetBtn.addEventListener('click', () => {
  start();
  questionEl.focus();
  announce('Actividad reiniciada. Pregunta 1.');
});
retry.addEventListener('click', () => {
  start();
  questionEl.focus();
});

start();
