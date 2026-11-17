// Ilustraciones SVG originales, dibujadas a mano en código.
const INK = '#1F2A44';
let uid = 0;
const id = (p) => `${p}-${++uid}`;

/* ================= Ciclo de la mariposa monarca ================= */

const leaf = (
  d = 'M10 98 C 22 52, 70 26, 112 30 C 104 74, 64 108, 10 98 Z',
  vein = 'M14 96 C 46 78, 80 54, 110 32',
  ribs = 'M40 80 L 34 62 M58 68 L 54 48 M76 56 L 76 40 M52 72 L 70 80 M72 60 L 90 64',
) => `
  <path d="${d}" fill="#7CC46B" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="${vein}" fill="none" stroke="#3D8B47" stroke-width="3" stroke-linecap="round"/>
  <path d="${ribs}" stroke="#3D8B47" stroke-width="2" stroke-linecap="round"/>`;

export const huevo = () => `
<svg viewBox="0 0 120 120" aria-hidden="true">
  ${leaf()}
  <circle cx="64" cy="54" r="27" fill="#FFFFFF" fill-opacity=".55" stroke="${INK}" stroke-width="4"/>
  <path d="M84 74 L 102 94" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
  <path d="M84 74 L 102 94" stroke="#F2A541" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse cx="64" cy="57" rx="10" ry="14" fill="#FFF6DA" stroke="${INK}" stroke-width="2.5"/>
  <path d="M60 45 C 58 52, 58 62, 60 69 M64 43.5 V 70.5 M68 45 C 70 52, 70 62, 68 69" fill="none" stroke="#E5C98A" stroke-width="1.6"/>
  <path d="M48 40 a 20 20 0 0 1 12 -9" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
</svg>`;

export const oruga = () => {
  const body = 'M20 78 C 34 62, 48 86, 64 74 S 86 62, 98 70';
  return `
<svg viewBox="0 0 120 120" aria-hidden="true">
  ${leaf('M4 104 C 20 84, 70 80, 116 94 C 96 112, 40 116, 4 104 Z', 'M8 103 C 40 98, 80 96, 112 95', '')}
  <path d="${body}" fill="none" stroke="${INK}" stroke-width="25" stroke-linecap="round"/>
  <path d="${body}" fill="none" stroke="#2A2A2A" stroke-width="19" stroke-linecap="round"/>
  <path d="${body}" fill="none" stroke="#FFD23F" stroke-width="19" stroke-dasharray="4.5 10.5"/>
  <path d="${body}" fill="none" stroke="#FFFFFF" stroke-width="19" stroke-dasharray="2.5 12.5" stroke-dashoffset="-7.5"/>
  <path d="M21 70 L 10 56 M26 68 L 22 52" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  <path d="M96 62 L 100 46 M101 63 L 110 50" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="101" cy="71" r="11" fill="#2A2A2A" stroke="${INK}" stroke-width="3"/>
  <path d="M95 70 a 6 6 0 0 0 12 0" fill="none" stroke="#FFD23F" stroke-width="2.4"/>
  <circle cx="98" cy="67" r="1.9" fill="#fff"/><circle cx="105" cy="67" r="1.9" fill="#fff"/>
  <path d="M30 98 l 0 6 M44 96 l 0 6 M58 96 l 0 6 M72 92 l 0 6" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
</svg>`;
};

export const crisalida = () => {
  const g = id('cris');
  return `
<svg viewBox="0 0 120 120" aria-hidden="true">
  <defs>
    <linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#9BE3B0"/><stop offset="1" stop-color="#3FAF6E"/>
    </linearGradient>
  </defs>
  <path d="M8 18 C 40 12, 78 22, 112 14" fill="none" stroke="#8A5A33" stroke-width="7" stroke-linecap="round"/>
  <path d="M86 18 l 12 -10 M30 16 l -6 -10" stroke="#8A5A33" stroke-width="4" stroke-linecap="round"/>
  <path d="M60 18 V 30" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  <path d="M60 30 C 82 32, 88 62, 80 84 C 74 102, 46 102, 40 84 C 32 62, 38 32, 60 30 Z" fill="url(#${g})" stroke="${INK}" stroke-width="3.5"/>
  <path d="M42 50 C 54 55, 66 55, 78 50" fill="none" stroke="#1F2A44" stroke-width="3"/>
  <g fill="#F2C230" stroke="${INK}" stroke-width="1.2">
    <circle cx="46" cy="45" r="2.6"/><circle cx="54" cy="47.5" r="2.6"/><circle cx="66" cy="47.5" r="2.6"/><circle cx="74" cy="45" r="2.6"/>
    <circle cx="50" cy="88" r="2.2"/><circle cx="60" cy="91" r="2.2"/><circle cx="70" cy="88" r="2.2"/>
  </g>
  <path d="M50 62 C 48 70, 50 80, 54 86" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3.5" stroke-linecap="round"/>
</svg>`;
};

function wings() {
  return `
    <path d="M58 56 C 48 28, 22 12, 11 22 C 2 32, 12 54, 57 62 Z" fill="#F57A1F" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M57 65 C 32 64, 16 80, 25 96 C 34 108, 52 96, 59 70 Z" fill="#EE6A18" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M57 59 C 42 45, 30 34, 17 26 M57 61 C 42 55, 27 50, 11 41 M57 67 C 43 75, 34 85, 29 95 M58 69 C 50 80, 46 90, 44 100" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M11 22 C 5 28, 5 38, 10 46 M25 96 C 28 102, 35 104, 42 102" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
    <g fill="#fff"><circle cx="9" cy="31" r="1.6"/><circle cx="9" cy="39" r="1.6"/><circle cx="15" cy="21" r="1.6"/><circle cx="29" cy="101" r="1.5"/><circle cx="37" cy="103" r="1.5"/></g>`;
}

export const mariposa = () => `
<svg viewBox="0 0 120 120" aria-hidden="true">
  <g>${wings()}</g>
  <g transform="translate(120 0) scale(-1 1)">${wings()}</g>
  <ellipse cx="60" cy="68" rx="4.6" ry="22" fill="${INK}"/>
  <circle cx="60" cy="44" r="6" fill="${INK}"/>
  <path d="M57 40 C 53 30, 49 25, 44 22 M63 40 C 67 30, 71 25, 76 22" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="44" cy="22" r="2.6" fill="${INK}"/><circle cx="76" cy="22" r="2.6" fill="${INK}"/>
</svg>`;

/* ================= Fracciones ================= */

const FILL = '#14A3A3';
const EMPTY = '#FFFDF7';

function slice(cx, cy, r, a0, a1) {
  const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${cx} ${cy} L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

export function pie(n, k, color = FILL) {
  const parts = [];
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const a1 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / n;
    parts.push(
      `<path d="${slice(60, 60, 46, a0, a1)}" fill="${i < k ? color : EMPTY}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
    );
  }
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="63" cy="64" r="46" fill="${INK}" opacity=".18"/>${parts.join('')}</svg>`;
}

export function bar(n, k, color = FILL) {
  const w = 100 / n;
  const parts = [];
  for (let i = 0; i < n; i++) {
    parts.push(
      `<rect x="${10 + i * w}" y="38" width="${w}" height="44" fill="${i < k ? color : EMPTY}" stroke="${INK}" stroke-width="3"/>`,
    );
  }
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="13" y="41" width="100" height="44" rx="6" fill="${INK}" opacity=".18"/>${parts.join('')}<rect x="10" y="38" width="100" height="44" rx="5" fill="none" stroke="${INK}" stroke-width="3.5"/></svg>`;
}

export function grid(rows, cols, k, color = FILL) {
  const size = 84;
  const cw = size / cols;
  const ch = size / rows;
  const parts = [];
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      parts.push(
        `<rect x="${18 + c * cw}" y="${18 + r * ch}" width="${cw}" height="${ch}" fill="${i < k ? color : EMPTY}" stroke="${INK}" stroke-width="3"/>`,
      );
      i++;
    }
  }
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="21" y="21" width="${size}" height="${size}" rx="6" fill="${INK}" opacity=".18"/>${parts.join('')}<rect x="18" y="18" width="${size}" height="${size}" rx="5" fill="none" stroke="${INK}" stroke-width="3.5"/></svg>`;
}

/* ================= Sistema solar ================= */

function stars(seed = 1, n = 14, w = 200, h = 160) {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = (rnd() * w).toFixed(1);
    const y = (rnd() * h).toFixed(1);
    const r = (0.8 + rnd() * 1.6).toFixed(1);
    out += rnd() > 0.82
      ? `<path d="M${x} ${y - r * 3} L${+x + +r} ${y - r} L${+x + r * 3} ${y} L${+x + +r} ${+y + +r} L${x} ${+y + r * 3} L${x - r} ${+y + +r} L${x - r * 3} ${y} L${x - r} ${y - r} Z" fill="#FFE39A"/>`
      : `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" opacity="${(0.5 + rnd() * 0.5).toFixed(2)}"/>`;
  }
  return out;
}

function planet({ cx, cy, r, base, bands = [], craters = [], shade = true }) {
  const clip = id('pl');
  return `
  <defs><clipPath id="${clip}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${base}"/>
  <g clip-path="url(#${clip})">
    ${bands.map(([y, hgt, c]) => `<rect x="${cx - r}" y="${cy - r + y * 2 * r}" width="${2 * r}" height="${hgt * 2 * r}" fill="${c}"/>`).join('')}
    ${craters.map(([x, y, cr, c]) => `<circle cx="${cx - r + x * 2 * r}" cy="${cy - r + y * 2 * r}" r="${cr * r}" fill="${c}"/>`).join('')}
    ${shade ? `<circle cx="${cx + r * 0.45}" cy="${cy + r * 0.45}" r="${r}" fill="#0B1330" opacity=".22"/>` : ''}
  </g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="3"/>`;
}

const sunShape = (cx, cy, r, rays = true) => `
  ${rays ? `<g stroke="#FFC53D" stroke-width="5" stroke-linecap="round">${Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    const r1 = r + 8;
    const r2 = r + (i % 2 ? 16 : 22);
    return `<line x1="${(cx + r1 * Math.cos(a)).toFixed(1)}" y1="${(cy + r1 * Math.sin(a)).toFixed(1)}" x2="${(cx + r2 * Math.cos(a)).toFixed(1)}" y2="${(cy + r2 * Math.sin(a)).toFixed(1)}"/>`;
  }).join('')}</g>` : ''}
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFB020" stroke="${INK}" stroke-width="3"/>
  <circle cx="${cx - r * 0.12}" cy="${cy - r * 0.12}" r="${r * 0.72}" fill="#FFD25A"/>
  <path d="M${cx - r * 0.5} ${cy - r * 0.35} a ${r * 0.6} ${r * 0.6} 0 0 1 ${r * 0.45} ${-r * 0.3}" fill="none" stroke="#FFF3C4" stroke-width="4" stroke-linecap="round"/>`;

const space = (inner, seed) => `
<svg viewBox="0 0 200 160" aria-hidden="true">
  ${stars(seed, 18)}
  ${inner}
</svg>`;

export const SPACE = {
  mercurio: () => space(`
    <g transform="translate(-40 0)">${sunShape(40, 80, 56, false)}</g>
    <path d="M30 80 C 70 20, 170 20, 190 80" fill="none" stroke="#7D8CC4" stroke-width="2" stroke-dasharray="4 6"/>
    ${planet({ cx: 104, cy: 40, r: 14, base: '#A7A2A0', craters: [[0.3, 0.35, 0.18, '#8C8784'], [0.65, 0.6, 0.14, '#8C8784'], [0.5, 0.8, 0.1, '#8C8784']] })}
    ${planet({ cx: 160, cy: 66, r: 18, base: '#F1C27A', bands: [[0.3, 0.12, '#E0A95C'], [0.62, 0.1, '#E0A95C']] })}`, 3),
  sol: () => space(`${sunShape(100, 80, 40)}
    ${planet({ cx: 176, cy: 130, r: 10, base: '#3D8EE0', craters: [[0.35, 0.4, 0.3, '#5BB35F']] })}`, 7),
  jupiter: () => space(`
    ${planet({ cx: 92, cy: 82, r: 56, base: '#E9C9A0', bands: [[0.14, 0.08, '#C98E5A'], [0.3, 0.1, '#F4E0C2'], [0.46, 0.12, '#B9764A'], [0.66, 0.07, '#D9A777'], [0.8, 0.06, '#C98E5A']], craters: [[0.62, 0.56, 0.11, '#C4553A']] })}
    ${planet({ cx: 176, cy: 34, r: 7, base: '#3D8EE0', craters: [[0.4, 0.4, 0.3, '#5BB35F']] })}`, 11),
  marte: () => space(`
    ${planet({ cx: 100, cy: 82, r: 50, base: '#D9623B', bands: [[0.0, 0.09, '#F6E7DA']], craters: [[0.3, 0.45, 0.16, '#B44A2B'], [0.62, 0.62, 0.12, '#B44A2B'], [0.45, 0.78, 0.09, '#B44A2B'], [0.72, 0.36, 0.08, '#E98A5E']] })}`, 5),
  tierra: () => space(`
    ${sunShape(100, 80, 18, false)}
    <ellipse cx="100" cy="80" rx="80" ry="46" fill="none" stroke="#7D8CC4" stroke-width="2.4" stroke-dasharray="5 6"/>
    <path d="M172 50 l 8 -2 l -3 8" fill="none" stroke="#FFC53D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    ${planet({ cx: 40, cy: 112, r: 15, base: '#3D8EE0', craters: [[0.3, 0.35, 0.3, '#5BB35F'], [0.75, 0.7, 0.22, '#5BB35F']] })}`, 9),
  saturno: () => {
    const ring = (half) => `<path d="${half === 'back' ? 'M28 86 A 72 20 0 0 1 172 86' : 'M28 86 A 72 20 0 0 0 172 86'}" fill="none" stroke="#E7D3A6" stroke-width="10" stroke-linecap="round"/>
      <path d="${half === 'back' ? 'M28 86 A 72 20 0 0 1 172 86' : 'M28 86 A 72 20 0 0 0 172 86'}" fill="none" stroke="#B89E6A" stroke-width="3"/>`;
    return space(`<g transform="rotate(-12 100 86)">
      ${ring('back')}
      ${planet({ cx: 100, cy: 86, r: 40, base: '#F0D79A', bands: [[0.22, 0.1, '#DDB86C'], [0.45, 0.12, '#F7E6BC'], [0.66, 0.1, '#D2A65A']] })}
      ${ring('front')}</g>`, 13);
  },
};

/* Portadas para el índice */
export const cover = {
  mariposa: () => `
<svg viewBox="0 0 240 170" aria-hidden="true">
  <circle cx="190" cy="40" r="26" fill="#FFC53D" opacity=".55"/>
  <path d="M20 150 C 60 120, 100 140, 130 118" fill="none" stroke="#3D8B47" stroke-width="5" stroke-linecap="round"/>
  <path d="M70 140 C 60 112, 84 98, 104 106 C 104 128, 90 142, 70 140 Z" fill="#7CC46B" stroke="${INK}" stroke-width="3"/>
  <path d="M28 144 C 18 120, 40 106, 58 116 C 58 134, 46 146, 28 144 Z" fill="#7CC46B" stroke="${INK}" stroke-width="3"/>
  <path d="M120 60 C 130 40, 150 40, 160 30" fill="none" stroke="${INK}" stroke-width="2.5" stroke-dasharray="3 7" stroke-linecap="round"/>
  <g transform="translate(130 46) scale(.95) rotate(12 60 60)">${mariposa().replace(/<\/?svg[^>]*>/g, '')}</g>
</svg>`,
  fracciones: () => `
<svg viewBox="0 0 240 170" aria-hidden="true">
  <g transform="translate(14 18) scale(1.05)">${pie(4, 3).replace(/<\/?svg[^>]*>/g, '')}</g>
  <g transform="translate(112 56) scale(1.05) rotate(-6 60 60)">${bar(3, 2, '#F2701D').replace(/<\/?svg[^>]*>/g, '')}</g>
  <g transform="translate(150 -6) scale(.6) rotate(8 60 60)">${grid(2, 2, 1, '#FFC53D').replace(/<\/?svg[^>]*>/g, '')}</g>
</svg>`,
  espacio: () => `
<svg viewBox="0 0 240 170" aria-hidden="true">
  ${stars(21, 22, 240, 170)}
  <g transform="translate(14 4) scale(1.05)">${SPACE.saturno().replace(/<\/?svg[^>]*>/g, '').replace(stars(13, 18), '')}</g>
  <g transform="translate(-10 -30)">${sunShape(30, 40, 22)}</g>
</svg>`,
};
