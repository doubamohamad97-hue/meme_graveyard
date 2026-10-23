const searchInput = document.querySelector('#search');
const cards = [...document.querySelectorAll('.grave-card')];
const filters = [...document.querySelectorAll('.filter')];
const emptyState = document.querySelector('#empty-state');
let activeFilter = 'all';

function updateCards() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const matchesQuery = card.dataset.name.includes(query);
    const matchesFilter = activeFilter === 'all' || card.dataset.type === activeFilter;
    const show = matchesQuery && matchesFilter;
    card.hidden = !show;
    if (show) visible++;
  });
  emptyState.hidden = visible > 0;
}
searchInput.addEventListener('input', updateCards);
filters.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filters.forEach(item => item.classList.toggle('active', item === button));
  updateCards();
}));

const form = document.querySelector('#bury-form');
const dialog = document.querySelector('#preview-dialog');
const previewName = document.querySelector('#preview-name');
const previewEpitaph = document.querySelector('#preview-epitaph');
const previewLink = document.querySelector('#preview-link');
const copyStatus = document.querySelector('#copy-status');
let graveText = '';

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  const rawUrl = String(data.get('url')).trim();
  const epitaph = String(data.get('epitaph')).trim() || 'Gone, but not forgotten.';
  let parsed;
  try { parsed = new URL(rawUrl); } catch { alert('Please enter a valid URL.'); return; }
  if (!['http:', 'https:'].includes(parsed.protocol)) { alert('Please use an http or https link.'); return; }
  previewName.textContent = name;
  previewEpitaph.textContent = '“' + epitaph + '”';
  previewLink.href = parsed.href;
  previewLink.textContent = 'Open original link ↗';
  graveText = `🪦 MEME GRAVEYARD\nR.I.P. ${name}\n${epitaph}\n${parsed.href}\nMemes die. Legends get tombstones.`;
  copyStatus.textContent = '';
  dialog.showModal();
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('#copy-grave').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(graveText);
    copyStatus.textContent = 'Grave text copied.';
  } catch {
    copyStatus.textContent = graveText;
  }
});
document.querySelector('#show-all').addEventListener('click', () => {
  searchInput.value = '';
  activeFilter = 'all';
  filters.forEach(item => item.classList.toggle('active', item.dataset.filter === 'all'));
  updateCards();
  document.querySelector('#graves').scrollIntoView({behavior:'smooth'});
});
