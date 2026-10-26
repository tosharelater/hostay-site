/**
 * Interactions for the standalone pages (styles in styles/subpage.css): reading progress,
 * step rails that fill as you scroll, a light that follows the pointer on cards, the hero
 * illustration leaning toward the pointer, smooth FAQ answers and the FAQ search.
 */
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* reading progress + rails, on one rAF-throttled scroll handler */
const bar = document.createElement('div');
bar.className = 'read-progress';
bar.setAttribute('aria-hidden', 'true');
document.body.append(bar);
const rails = [...document.querySelectorAll<HTMLElement>('[data-rail]')];

let ticking = false;
function frame() {
  ticking = false;
  const vh = innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  bar.style.setProperty('--read', (max > 0 ? scrollY / max : 0).toFixed(4));
  for (const r of rails) {
    const b = r.getBoundingClientRect();
    // full once the list's end reaches the middle of the screen
    r.style.setProperty('--rail', (still ? 1 : clamp01((vh * 0.6 - b.top) / Math.max(1, b.height))).toFixed(4));
  }
}
const request = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(frame);
};
addEventListener('scroll', request, { passive: true });
addEventListener('resize', request);
frame();

/* pointer light on cards */
if (fine && !still) {
  document.addEventListener('pointermove', (e) => {
    const card = (e.target as Element | null)?.closest?.<HTMLElement>('.glow');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  // the hero illustration leans toward the pointer
  const hero = document.querySelector<HTMLElement>('.ph');
  const visual = hero?.querySelector<HTMLElement>('.visual');
  if (hero && visual) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      visual.style.setProperty('--rx', `${(x * 10).toFixed(2)}deg`);
      visual.style.setProperty('--ry', `${(-y * 8).toFixed(2)}deg`);
    });
    hero.addEventListener('pointerleave', () => {
      visual.style.setProperty('--rx', '0deg');
      visual.style.setProperty('--ry', '0deg');
    });
  }
}

/* FAQ: answers slide open and closed */
document.querySelectorAll<HTMLDetailsElement>('details[data-smooth]').forEach((d) => {
  const summary = d.querySelector('summary');
  const answer = d.querySelector<HTMLElement>('.answer');
  if (!summary || !answer || still) return;
  summary.addEventListener('click', (e) => {
    e.preventDefault();
    if (d.open) {
      answer.style.height = `${answer.scrollHeight}px`;
      requestAnimationFrame(() => (answer.style.height = '0px'));
      answer.addEventListener('transitionend', () => (d.open = false), { once: true });
      d.classList.remove('opening');
    } else {
      d.open = true;
      d.classList.add('opening');
      answer.style.height = '0px';
      requestAnimationFrame(() => (answer.style.height = `${answer.scrollHeight}px`));
      answer.addEventListener('transitionend', () => (answer.style.height = 'auto'), { once: true });
    }
  });
});

/* FAQ search: filters questions and answers as you type */
const search = document.querySelector<HTMLInputElement>('[data-faq-search]');
if (search) {
  const groups = [...document.querySelectorAll<HTMLElement>('[data-faq-group]')];
  const empty = document.querySelector<HTMLElement>('[data-faq-empty]');
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  search.addEventListener('input', () => {
    const q = norm(search.value.trim());
    let any = false;
    for (const g of groups) {
      let shown = 0;
      g.querySelectorAll<HTMLDetailsElement>('details').forEach((d) => {
        const hit = !q || norm(d.textContent ?? '').includes(q);
        d.hidden = !hit;
        if (hit) shown++;
      });
      g.hidden = shown === 0;
      if (shown) any = true;
    }
    if (empty) empty.hidden = any;
  });
}
