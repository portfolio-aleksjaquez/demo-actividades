import '../css/base.css';
import '../css/index.css';
import { initTopbar } from './common.js';
import { cover } from './art.js';

initTopbar();
for (const el of document.querySelectorAll('[data-cover]')) {
  el.innerHTML = cover[el.dataset.cover]();
}
