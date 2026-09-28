const grid = document.getElementById('dog-grid');
const filters = document.getElementById('filters');
const form = document.getElementById('dog-form');
const message = document.getElementById('form-message');
const regionSelect = document.getElementById('f-region');

let regions = [];
let current = 'all';

async function api(path, options) {
  const res = await fetch(path, options);
  const body = await res.json();
  if (!res.ok) throw new Error((body.errors || [body.error]).join(', '));
  return body;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderCard(dog) {
  const label = regions.find((r) => r.id === dog.region)?.label ?? dog.region;
  const card = el('article', 'dog-card');
  card.dataset.region = dog.region;
  card.append(
    el('div', 'dog-visual', dog.emoji),
    el('div', 'dog-flag', dog.flag),
    el('h2', '', dog.name),
    el('p', 'dog-country', `${dog.country} — ${label}`),
    el('p', 'dog-desc', dog.description),
  );
  return card;
}

function renderFilters() {
  filters.replaceChildren();
  for (const { id, label } of [{ id: 'all', label: 'Toutes' }, ...regions]) {
    const btn = el('button', `filter-btn${id === current ? ' active' : ''}`, label);
    btn.dataset.region = id;
    btn.addEventListener('click', () => { current = id; refresh(); });
    filters.append(btn);
  }
}

async function refresh() {
  regions = await api('/api/regions');
  const dogs = await api(`/api/dogs?region=${encodeURIComponent(current)}`);
  renderFilters();
  grid.replaceChildren(...dogs.map(renderCard));
}

async function loadRegionOptions() {
  const res = await fetch('/api/regions');
  const list = await res.json();
  for (const { id, label } of list) regionSelect.append(new Option(label, id));
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    await api('/api/dogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    message.textContent = 'Chien ajouté !';
    form.reset();
    await refresh();
  } catch (err) {
    message.textContent = err.message;
  }
});

refresh().then(loadRegionOptions);
