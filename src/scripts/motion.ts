/**
 * All scroll motion for the home page, driven by one rAF-throttled scroll handler: reveals,
 * header state, parallax layers, the guide character (who stays fixed while the hero, the story
 * and the features scroll around him), the story scrub, and the "how it works" checklist.
 */
import { mouthAt, phases } from '../lib/untangle';
import { routeAt, MW, MH } from '../lib/map';

const root = document.documentElement;
root.classList.remove('no-js');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// Reveal once, when an element enters the viewport.
const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (still || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
}

// Parallax. The hero flanks start at rest and spread their layers with scroll; other scenes drift
// by their distance from the viewport centre, so they sit at rest when centred.
const scenes = [...document.querySelectorAll<SVGSVGElement>('.scene svg, .flank svg')].map((svg) => ({
  svg,
  hero: !!svg.closest('.flank'),
  layers: [...svg.querySelectorAll<SVGGElement>('.layer[data-depth]')].map((g) => ({ g, depth: Number(g.dataset.depth) || 0 }))
}));

function parallax(vh: number) {
  for (const s of scenes) {
    const r = s.svg.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) continue;
    // Hero: far layers sink a little, near ones rise a little, all staying close to rest.
    for (const l of s.layers) {
      const y = s.hero ? scrollY * (0.2 - l.depth) * 0.6 : -(r.top + r.height / 2 - vh / 2) * l.depth;
      l.g.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  }
}

/* ---------- The guide and his lines ---------- */

const guide = document.querySelector<HTMLElement>('[data-guide]');
const miftah = document.querySelector<HTMLElement>('[data-miftah-fab]');
const mouth = guide?.querySelector<SVGPathElement>('[data-mouth]') ?? null;
const lines = guide ? [...guide.querySelectorAll<HTMLElement>('[data-line]')] : [];
let line = 'hello';
let hush = 0;

/** Show one of his lines (or none), and move his mouth for a moment when it changes. */
function say(name: string | null) {
  if (!guide || name === line) return;
  line = name ?? '';
  lines.forEach((l) => l.classList.toggle('on', l.dataset.line === name));
  guide.classList.toggle('quiet', !name);
  if (!name) return;
  guide.classList.add('talking');
  clearTimeout(hush);
  hush = window.setTimeout(() => guide.classList.remove('talking'), 1600);
}

/* ---------- The story ---------- */

const un = document.querySelector<HTMLElement>('[data-untangle]');
const one = <T extends Element>(sel: string) => un?.querySelector<T>(sel) ?? null;
const all = <T extends Element>(sel: string) => (un ? [...un.querySelectorAll<T>(sel)] : []);
const screen = one<HTMLElement>('[data-screen]');
const query = one<HTMLElement>('[data-query]');
const found = one<HTMLElement>('[data-found]');
const searchView = one<HTMLElement>('[data-search-view]');
const appView = one<HTMLElement>('[data-app-view]');
const tabSearch = one<HTMLElement>('[data-tab-search]');
const tabApp = one<HTMLElement>('[data-tab-app]');
const chores = all<HTMLElement>('[data-label]');
const thought = one<HTMLElement>('[data-thought]');
const results = all<HTMLElement>('[data-result]');
const stays = all<HTMLElement>('[data-stay]');
const chapters = all<HTMLElement>('[data-chapter]');

/** Story progress: 0 until the section is pinned, 1 near its end. */
function storyProgress(vh: number) {
  if (!un) return 0;
  const r = un.getBoundingClientRect();
  const span = r.height - vh;
  return span > 0 ? clamp01(-r.top / (span * 0.9)) : 1;
}

function story(f: ReturnType<typeof phases>) {
  chapters.forEach((c, i) => c.classList.toggle('active', i === f.chapter));
  chores.forEach((c) => (c.style.opacity = f.chores.toFixed(3)));
  if (thought) {
    thought.style.opacity = f.thought.toFixed(3);
    thought.style.transform = `scale(${(0.9 + 0.1 * f.thought).toFixed(3)})`;
  }
  if (!screen || !query || !found || !searchView || !appView || !tabSearch || !tabApp) return;

  // The screen lights up above him; he types, the results come in and are crossed out.
  // ...and it steps back while he turns to us to say what he found.
  screen.style.opacity = (f.screen * (f.say ? 0.3 : 1)).toFixed(3);
  screen.style.transform = `translateY(${((1 - f.screen) * 18).toFixed(1)}px) scale(${(0.96 + 0.04 * f.screen).toFixed(3)})`;
  const full = query.dataset.full ?? '';
  query.textContent = full.slice(0, Math.round(full.length * f.typed));
  results.forEach((r, i) => {
    const inT = Math.min(1, clamp01(f.shown - i) * 4);
    r.style.opacity = (inT * (1 - 0.5 * f.found)).toFixed(3);
    r.style.translate = `0 ${((1 - inT) * 6).toFixed(1)}px`;
    r.style.setProperty('--strike', clamp01((f.struck - i) * 2.5).toFixed(3));
  });
  found.style.opacity = f.found.toFixed(3);
  found.style.transform = `scale(${(0.94 + 0.06 * f.found).toFixed(3)})`;

  // Hostay comes up and he opens it: the planning view replaces the search.
  searchView.style.opacity = (1 - f.use).toFixed(3);
  appView.style.opacity = f.use.toFixed(3);
  tabApp.style.opacity = f.found.toFixed(3);
  tabSearch.classList.toggle('on', f.use < 0.5);
  tabApp.classList.toggle('on', f.use >= 0.5);
  stays.forEach((s, i) => s.style.setProperty('--fill', clamp01(f.fill * 1.6 - i * 0.1).toFixed(3)));
}

/* ---------- The features he tells us about ---------- */

const modules = document.querySelector<HTMLElement>('#modules');
const features = [...document.querySelectorAll<HTMLElement>('[data-feature]')];

/** The card nearest the middle of the screen (1-based), 0 for the intro, -1 before the section. */
function featureInView(vh: number) {
  if (!modules) return -1;
  const m = modules.getBoundingClientRect();
  if (m.top > vh * 0.55 || m.bottom < vh * 0.4) return -1;
  let best = 0;
  let dist = vh * 0.3;
  for (const c of features) {
    const r = c.getBoundingClientRect();
    const d = Math.abs(r.top + r.height / 2 - vh * 0.45);
    if (d < dist) {
      dist = d;
      best = Number(c.dataset.feature);
    }
  }
  return best;
}

/* ---------- How it works: the checklist ticks itself off ---------- */

const setup = document.querySelector<HTMLElement>('[data-setup]');
const steps = setup ? [...setup.querySelectorAll<HTMLElement>('[data-step]')] : [];
const count = setup?.querySelector<HTMLElement>('[data-count]');
const how = document.querySelector<HTMLElement>('#how');
let ticked = -1;

function checklist(vh: number) {
  if (!setup || !steps.length) return;
  // The section is pinned: progress through its scroll ticks the steps, the last one well
  // before the end so the finished checklist stays on screen for a moment.
  const r = (how ?? setup).getBoundingClientRect();
  const pinned = r.height > vh * 1.4;
  const k = pinned ? (vh * 0.3 - r.top) / Math.max(1, (r.height - vh) * 0.85) : (vh * 0.8 - setup.getBoundingClientRect().top) / (vh * 0.75);
  const done = Math.max(0, Math.min(steps.length, Math.floor(k * (steps.length + 1))));
  if (done === ticked) return;
  ticked = done;
  steps.forEach((s, i) => s.classList.toggle('done', i < done));
  setup.style.setProperty('--done', String(done / steps.length));
  if (count) count.textContent = String(done);
  if (setup.dataset.manual !== 'true') {
    const open = Math.min(done, steps.length - 1);
    steps.forEach((s, i) => s.querySelector('[data-step-toggle]')?.setAttribute('aria-expanded', String(i === open)));
  }
  setup.classList.toggle('celebrate', done === steps.length);
}

/* ---------- Made in Morocco: the map comes in, then the route from Tangier to Agadir ---------- */

const morocco = document.querySelector<HTMLElement>('[data-morocco]');
const mapRoute = morocco?.querySelector<SVGPathElement>('[data-map-route]');
const traveller = morocco?.querySelector<HTMLElement>('[data-map-traveller]');
const cities = morocco ? [...morocco.querySelectorAll<HTMLElement>('[data-city]')] : [];

function journey(vh: number) {
  if (!morocco || !mapRoute || !traveller) return;
  const r = morocco.getBoundingClientRect();
  // pinned: entering draws the coast, then scrolling through runs the route
  const k = still ? 1 : clamp01((vh - r.top) / (r.height * 0.95));
  const coast = clamp01(k / 0.45);
  const land = clamp01((k - 0.25) / 0.2);
  const run = clamp01((k - 0.45) / 0.45);
  morocco.style.setProperty('--coast-off', (1 - coast).toFixed(4));
  morocco.style.setProperty('--land', land.toFixed(3));
  morocco.style.setProperty('--route-off', (1 - run).toFixed(4));
  morocco.style.setProperty('--trav', (land * (run < 1 ? 1 : 0.9)).toFixed(3));
  const [x, y] = routeAt(run);
  traveller.style.left = `${(x / MW) * 100}%`;
  traveller.style.top = `${(y / MH) * 100}%`;
  cities.forEach((c) => c.classList.toggle('on', land > 0.5 && Number(c.dataset.t) <= run + 0.001));
}

/* ---------- A day with Hostay: the sun crosses the day ---------- */

const dayEl = document.querySelector<HTMLElement>('[data-day]');
const sun = dayEl?.querySelector<HTMLElement>('[data-sun]');
const moments = dayEl ? [...dayEl.querySelectorAll<HTMLElement>('[data-moment]')] : [];

function day(vh: number) {
  if (!dayEl) return;
  const r = dayEl.getBoundingClientRect();
  // pinned on wide screens (a tall section): progress through it; otherwise as it scrolls by
  const k = still ? 1 : r.height > vh * 1.5 ? clamp01(-r.top / ((r.height - vh) * 0.9)) : clamp01((vh * 0.85 - r.top) / r.height);
  // the sun follows the arc drawn in the sky (a quadratic curve in a 1000 × 160 box)
  const y = (1 - k) * (1 - k) * 150 + 2 * (1 - k) * k * -60 + k * k * 150;
  dayEl.style.setProperty('--day', k.toFixed(4));
  sun?.style.setProperty('--sun-x', `${(k * 100).toFixed(2)}%`);
  sun?.style.setProperty('--sun-y', `${((y / 160) * 100).toFixed(2)}%`);
  moments.forEach((m) => m.classList.toggle('on', Number(m.dataset.at) <= k + 0.001));
}

/* ---------- One frame ---------- */

function frame() {
  ticking = false;
  const vh = innerHeight;
  root.classList.toggle('scrolled', scrollY > 12);
  checklist(vh);
  journey(vh);
  day(vh);

  const p = still ? 1 : storyProgress(vh);
  const f = phases(p, results.length);
  if (!still) {
    parallax(vh);
    story(f);
  }

  if (guide && mouth) {
    // Hero → story: he is happy and waving while the hero fills the screen, then the story
    // section slides in around him and he becomes worried.
    const top = un ? un.getBoundingClientRect().top : 0;
    const hello = still ? 0 : clamp01((top - vh * 0.2) / (vh * 0.35));
    const calm = lerp(f.calm, 1, hello);
    const search = f.search * (1 - hello);
    const turn = f.turn * (1 - hello);
    guide.style.setProperty('--calm', calm.toFixed(3));
    guide.style.setProperty('--search', search.toFixed(3));
    guide.style.setProperty('--turn', turn.toFixed(3));
    guide.style.setProperty('--worry', ((1 - search) * (1 - calm)).toFixed(3));
    mouth.setAttribute('d', mouthAt(search, calm));
    guide.classList.toggle('wave', hello > 0.5);
    guide.classList.toggle('typing', !still && f.typing && hello === 0);
    guide.classList.toggle('worried', (1 - search) * (1 - calm) > 0.05);

    // What he says: hello in the hero, "Hostay !" once he has found it, then the features.
    const feature = featureInView(vh);
    features.forEach((c) => c.classList.toggle('current', Number(c.dataset.feature) === feature));
    let next: string | null = null;
    if (hello > 0.5) next = 'hello';
    else if (feature >= 0) next = `f${feature}`;
    else if (f.say) next = 'hostay';
    say(next);
    guide.dataset.pos = hello > 0.5 ? 'side' : 'top';
    guide.dataset.zone = feature >= 0 ? 'features' : '';
    guide.classList.toggle('joy', f.say && feature < 1);

    // He leaves once the features are told, as "how it works" comes up.
    const exit = how ? clamp01((vh * 0.9 - how.getBoundingClientRect().top) / (vh * 0.45)) : 0;
    guide.style.setProperty('--exit', `${(exit * 115).toFixed(1)}%`);
    guide.style.opacity = (1 - exit).toFixed(3);
    guide.style.visibility = exit >= 1 ? 'hidden' : 'visible';
    // Once he has gone, Miftah stays at hand at the bottom of the screen.
    miftah?.classList.toggle('show', exit > 0.6);
  }
}

let ticking = false;
const request = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(frame);
};
addEventListener('scroll', request, { passive: true });
addEventListener('resize', request);
if (guide) {
  guide.classList.add('talking');
  hush = window.setTimeout(() => guide.classList.remove('talking'), 2400);
}
frame();
