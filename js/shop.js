/* shop.js — product grid, category filter buttons and search on the Shop page. */
document.addEventListener('tk:ready', () => {
  const { h, activeProducts, productCard } = TK;
  const products = activeProducts();
  const catOf = p => p.category || 'Other';

  const filters = document.getElementById('filters');
  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('empty');
  const count = document.getElementById('result-count');
  const search = document.getElementById('search');
  const toolbar = document.getElementById('toolbar');

  // Nothing to show at all
  if (!products.length) {
    toolbar.hidden = true;
    empty.hidden = false;
    empty.textContent = 'No products are available right now. Check back soon, or request a custom print.';
    return;
  }

  const categories = ['All', 'Ford', ...new Set(products.map(catOf)).filter(c => c !== 'Ford')];

  const params = new URLSearchParams(location.search);
  const state = { cat: categories.includes(params.get('cat')) ? params.get('cat') : 'All', q: '' };

  const buttons = categories.map(cat => h('button', {
    type: 'button', class: 'pill', text: cat,
    onclick: () => { state.cat = cat; sync(); render(); }
  }));
  filters.append(...buttons);
  if (categories.length <= 2) filters.hidden = true;     // one category → no need for filter buttons

  function sync() {
    buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(categories[i] === state.cat)));
    const url = new URL(location.href);
    if (state.cat === 'All') url.searchParams.delete('cat'); else url.searchParams.set('cat', state.cat);
    history.replaceState(null, '', url);
  }

  function render() {
    const q = state.q.trim().toLowerCase();
    const shown = products.filter(p =>
      (state.cat === 'All' || catOf(p) === state.cat) &&
      (!q || [p.name, p.description, p.category].join(' ').toLowerCase().includes(q)));

    grid.replaceChildren(...shown.map(productCard));
    empty.hidden = shown.length > 0;
    if (!shown.length) {
      empty.replaceChildren(
        h('p', { text: 'No products match that. ' }),
        h('button', { type: 'button', class: 'btn btn-ghost', text: 'Show all products',
          onclick: () => { state.cat = 'All'; state.q = ''; search.value = ''; sync(); render(); } }));
    }
    count.textContent = shown.length + (shown.length === 1 ? ' product' : ' products');
  }

  search.addEventListener('input', () => { state.q = search.value; render(); });
  sync(); render();
});
