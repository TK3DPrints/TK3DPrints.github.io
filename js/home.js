/* home.js — builds the featured products and hero picture on the Home page. */
document.addEventListener('tk:ready', () => {
  const { h, activeProducts, productCard, productImage, money } = TK;
  const products = activeProducts();

  // Three short points under the hero
  const list = document.getElementById('highlights');
  CONTENT.home.highlights.forEach(item =>
    list.append(h('li', {}, h('h3', { text: item.title }), h('p', { text: item.text }))));

  // Featured products (falls back to the first few if none are marked featured)
  let featured = products.filter(p => p.featured);
  if (!featured.length) featured = products;
  featured = featured.slice(0, 4);

  const grid = document.getElementById('featured-grid');
  if (featured.length) {
    featured.forEach(p => grid.append(productCard(p)));
  } else {
    grid.replaceWith(h('p', { class: 'empty', text: 'New products are coming soon. In the meantime, you can request a custom print.' }));
  }

  // Hero picture: the first featured product, shown like a spec tag
  const visual = document.getElementById('hero-visual');
  const hero = featured[0];
  if (hero) {
    const url = 'product.html?id=' + encodeURIComponent(hero.id);
    visual.append(
      h('a', { class: 'print-frame', href: url, 'aria-label': hero.name + ' — view product' },
        productImage(hero, { loading: 'eager', fetchpriority: 'high' })),
      h('p', { class: 'spec-tag' },
        h('span', { class: 'spec-name', text: hero.name }),
        h('span', { class: 'spec-price', text: money(hero.price) })));
  } else {
    visual.append(h('div', { class: 'print-frame' }, productImage({ name: 'Featured product', image: '' }, { loading: 'eager' })));
  }
});
