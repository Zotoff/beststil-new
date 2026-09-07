const root = document.documentElement;
const themeToggle = document.querySelector('[data-theme-toggle]');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function currentTheme() {
  return root.dataset.theme === 'dark' ? 'dark' : 'light';
}

function updateThemeControl() {
  const isDark = currentTheme() === 'dark';
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
  themeMeta?.setAttribute('content', isDark ? '#0c1210' : '#f2f0e9');
}

updateThemeControl();

themeToggle?.addEventListener('click', () => {
  const nextTheme = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = nextTheme;
  try { localStorage.setItem('beststil-theme', nextTheme); } catch {}
  updateThemeControl();
});

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-nav');

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuButton || !menu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  if (restoreFocus) menuButton.focus();
}

menuButton?.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? 'Закрыть меню' : 'Открыть меню');
  menu?.classList.toggle('is-open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
});

menu?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu({ restoreFocus: true });
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1080) closeMenu();
});

function updateHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const comparison = document.querySelector('[data-comparison]');
const comparisonRange = document.querySelector('[data-comparison-range]');

comparisonRange?.addEventListener('input', () => {
  comparison?.style.setProperty('--position', `${comparisonRange.value}%`);
});

const priceTabs = Array.from(document.querySelectorAll('[data-price-tab]'));
const pricePanels = Array.from(document.querySelectorAll('[data-price-panel]'));

function activatePriceTab(tab, { focus = false } = {}) {
  const panelId = tab.getAttribute('aria-controls');
  priceTabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  pricePanels.forEach((panel) => { panel.hidden = panel.id !== panelId; });
  if (focus) tab.focus();
}

priceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activatePriceTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let targetIndex = index;
    if (event.key === 'ArrowLeft') targetIndex = (index - 1 + priceTabs.length) % priceTabs.length;
    if (event.key === 'ArrowRight') targetIndex = (index + 1) % priceTabs.length;
    if (event.key === 'Home') targetIndex = 0;
    if (event.key === 'End') targetIndex = priceTabs.length - 1;
    activatePriceTab(priceTabs[targetIndex], { focus: true });
  });
});

const mobileBooking = document.querySelector('.mobile-booking');
const heroBooking = document.querySelector('.hero-actions .button-accent');

if (mobileBooking && heroBooking && 'IntersectionObserver' in window) {
  const bookingObserver = new IntersectionObserver(([entry]) => {
    mobileBooking.classList.toggle('is-visible', !entry.isIntersecting);
  }, { threshold: 0.35 });
  bookingObserver.observe(heroBooking);
}

const year = document.querySelector('[data-current-year]');
if (year) year.textContent = new Date().getFullYear();

