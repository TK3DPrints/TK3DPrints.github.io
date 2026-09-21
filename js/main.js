/* ==========================================================================
   main.js — shared helpers + the header/footer that appear on every page.
   You should not need to edit this file to change products, prices or text.
   ========================================================================== */
(function () {
  'use strict';

  const SITE = { business: BUSINESS, content: CONTENT };

  /* ---------- tiny helper for building HTML safely (never uses innerHTML) ---------- */
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === 'class') el.className = value;
      else if (key === 'text') el.textContent = value;
      else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
      else el.setAttribute(key, value === true ? '' : value);
    });
    children.flat(Infinity).forEach(child => {
      if (child === null || child === undefined || child === false) return;
      el.append(child.nodeType ? child : document.createTextNode(String(child)));
    });
    return el;
  }

  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n) || 0);

  /* ---------- products ---------- */
  function activeProducts() {
    const seen = new Set();
    return (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).filter(p => {
      if (!p || typeof p !== 'object') return false;
      if (p.active === false) return false;                        // hidden on purpose
      const problems = [];
      if (!p.id || /\s/.test(p.id)) problems.push('id (needs a value with no spaces)');
      if (!p.name) problems.push('name');
      if (typeof p.price !== 'number' || !isFinite(p.price) || p.price < 0) problems.push('price (must be a number like 15.00)');
      if (seen.has(p.id)) problems.push('id (duplicate — every id must be unique)');
      if (problems.length) {
        console.warn('[products.js] Skipping product "' + (p.name || p.id || '?') + '" — check: ' + problems.join(', '));
        return false;
      }
      seen.add(p.id);
      return true;
    });
  }

  function findProduct(id) { return activeProducts().find(p => p.id === id) || null; }

  function colorsOf(p) {
    return Array.isArray(p.availableColors) ? p.availableColors.filter(Boolean) : [];
  }

  function swatchColor(name) {
    const map = BUSINESS.colorSwatches || {};
    const key = Object.keys(map).find(k => k.toLowerCase() === String(name).toLowerCase());
    return key ? map[key] : null;
  }

  function swatch(name) {
    const dot = h('span', { class: 'swatch', 'aria-hidden': 'true' });
    const color = swatchColor(name);
    if (color) dot.style.background = color; else dot.classList.add('swatch-none');
    return dot;
  }

  const PLACEHOLDER = 'images/placeholder.svg';
  function productImage(product, extra) {
    const img = h('img', Object.assign({
      src: product.image || PLACEHOLDER,
      alt: product.name,
      width: 800, height: 800,
      loading: 'lazy',
      decoding: 'async'
    }, extra || {}));
    img.addEventListener('error', () => {                          // missing image → friendly fallback
      if (!img.src.endsWith(PLACEHOLDER)) img.src = PLACEHOLDER;
    });
    return img;
  }

function productCard(p) {
  const colors = colorsOf(p);
  const url = 'product.html?id=' + encodeURIComponent(p.id);

  // All images (main + extras)
  const galleryImages = [p.image, ...(p.extraImages || [])];
  let currentIndex = 0;

  // Main image element
  const mainImg = productImage(p);

  // Update main image when arrows are clicked
  const showImage = (index) => {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    mainImg.src = galleryImages[currentIndex];
  };

  // Thumbnail gallery
  const gallery = h('div', { class: 'card-gallery' },
    galleryImages.map((src, i) =>
      h('img', {
        src,
        alt: p.name,
        class: 'thumb',
        loading: 'lazy',
        decoding: 'async',
        onclick: () => showImage(i)
      })
    )
  );

  // Arrow controls
  const galleryWrapper = h('div', { class: 'card-gallery-wrapper' },
    h('button', {
      class: 'arrow left',
      onclick: () => showImage(currentIndex - 1)
    }, '‹'),
    gallery,
    h('button', {
      class: 'arrow right',
      onclick: () => showImage(currentIndex + 1)
    }, '›')
  );

  return h('article', { class: 'card product-card' },
    h('a', { class: 'card-media', href: url, tabindex: '-1', 'aria-hidden': 'true' },
      mainImg
    ),
    galleryWrapper,
    h('div', { class: 'card-body' },
      p.category ? h('p', { class: 'tag', text: p.category }) : null,
      h('h3', { class: 'card-title' }, h('a', { href: url, text: p.name })),
      h('p', { class: 'price', text: money(p.price) }),
      h('p', { class: 'card-text', text: p.description || '' }),
      colors.length
        ? h('ul', {
            class: 'swatch-row',
            'aria-label': 'Available colors: ' + colors.join(', ')
          }, colors.map(c => h('li', { title: c }, swatch(c))))
        : null,
      h('a', {
        class: 'btn btn-block',
        href: url,
        'aria-label': 'Order ' + p.name,
        text: 'Order'
      })
    )
  );
}



  function renderProcess(listEl) {
    if (!listEl) return;
    CONTENT.process.forEach(step => {
      listEl.append(h('li', {}, h('h3', { text: step.title }), h('p', { text: step.text })));
    });
  }

  /* ---------- config lookup ("business.name" → BUSINESS.name) ---------- */
  function lookup(path) {
    return path.split('.').reduce((obj, key) => (obj == null ? obj : obj[key]), SITE);
  }

  /* ---------- header ---------- */
  const NAV = [
    { href: 'index.html',   label: 'Home' },
    { href: 'shop.html',    label: 'Shop' },
    { href: 'custom.html',  label: 'Custom Print' },
    { href: 'about.html',   label: 'About' },
    { href: 'faq.html',     label: 'FAQ' },
    { href: 'contact.html', label: 'Contact' }
  ];

  function currentPage() {
    const file = location.pathname.split('/').pop() || 'index.html';
    return file === 'product.html' ? 'shop.html' : file;
  }

  function logoMark() {
    const s = svgEl('svg', { viewBox: '0 0 64 64', width: 34, height: 34, 'aria-hidden': 'true', class: 'logo-mark' });
    s.append(
      svgEl('rect', { width: 64, height: 64, rx: 14, fill: '#111c27' }),
      svgEl('rect', { x: 14, y: 16, width: 36, height: 8, rx: 3, fill: '#ffc21a' }),
      svgEl('rect', { x: 14, y: 28, width: 36, height: 8, rx: 3, fill: '#4d7cff' }),
      svgEl('rect', { x: 14, y: 40, width: 36, height: 8, rx: 3, fill: '#ffffff' })
    );
    return s;
  }

  function buildHeader() {
    const mount = document.getElementById('site-header');
    if (!mount) return;
    const page = currentPage();
    const nav = h('nav', { id: 'site-nav', class: 'site-nav', 'aria-label': 'Main' },
      NAV.map(item => h('a', Object.assign({ href: item.href, text: item.label },
        item.href === page ? { 'aria-current': 'page' } : {}))),
      h('a', { class: 'btn btn-small nav-cta', href: 'custom.html#quote-form', text: 'Get a quote' })
    );
    const toggle = h('button', {
      class: 'nav-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'site-nav',
      onclick: () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Close' : 'Menu';
      }
    }, 'Menu');
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { toggle.click(); toggle.focus(); }
    });
    mount.replaceWith(h('header', { class: 'site-header' },
      h('div', { class: 'wrap header-inner' },
        h('a', { class: 'brand', href: 'index.html', 'aria-label': BUSINESS.name + ' — home' },
          logoMark(), h('span', { text: BUSINESS.name })),
        toggle, nav)));
  }

  /* ---------- footer ---------- */
  function buildFooter() {
    const mount = document.getElementById('site-footer');
    if (!mount) return;
    const socials = (BUSINESS.social || []).filter(s => s.url);
    const hours = BUSINESS.hours || [];
    mount.replaceWith(h('footer', { class: 'site-footer' },
      h('div', { class: 'wrap footer-grid' },
        h('div', {},
          h('p', { class: 'footer-brand', text: BUSINESS.name }),
          h('p', { text: BUSINESS.tagline }),
          h('p', { class: 'muted-on-dark', text: BUSINESS.location })),
        h('div', {},
          h('h2', { class: 'footer-head', text: 'Contact' }),
          h('p', {}, h('a', { href: 'mailto:' + BUSINESS.email, text: BUSINESS.email })),
          BUSINESS.phone ? h('p', {}, h('a', { href: 'tel:' + BUSINESS.phone.replace(/[^\d+]/g, ''), text: BUSINESS.phone })) : null,
          socials.length
            ? h('ul', { class: 'footer-links' }, socials.map(s =>
                h('li', {}, h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer', text: s.name }))))
            : null),
        hours.length
          ? h('div', {},
              h('h2', { class: 'footer-head', text: 'Hours' }),
              h('dl', { class: 'hours' }, hours.map(r => [h('dt', { text: r.days }), h('dd', { text: r.time })])))
          : null,
        h('div', {},
          h('h2', { class: 'footer-head', text: 'Explore' }),
          h('ul', { class: 'footer-links' }, NAV.map(n => h('li', {}, h('a', { href: n.href, text: n.label })))))
      ),
      h('div', { class: 'wrap footer-base' },
        h('p', { text: '© ' + new Date().getFullYear() + ' ' + BUSINESS.name + '. ' + BUSINESS.paymentNote }))));
  }

  /* ---------- fill in text from the config files ---------- */
  function bindContent() {
    document.querySelectorAll('[data-bind]').forEach(el => {
      const v = lookup(el.dataset.bind);
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-list]').forEach(el => {
      const items = lookup(el.dataset.list);
      if (!Array.isArray(items)) return;
      const tag = el.dataset.itemTag || 'p';
      items.forEach(text => el.append(h(tag, { text })));
    });
    document.querySelectorAll('[data-mailto]').forEach(el => {
      el.setAttribute('href', 'mailto:' + BUSINESS.email);
      if (!el.textContent.trim()) el.textContent = BUSINESS.email;
    });
    document.querySelectorAll('[data-phone]').forEach(el => {
      if (!BUSINESS.phone) { el.hidden = true; return; }
      const link = el.querySelector('a') || el;
      link.setAttribute('href', 'tel:' + BUSINESS.phone.replace(/[^\d+]/g, ''));
      link.textContent = BUSINESS.phone;
    });
  }

  function setTitle() {
    const page = document.body.dataset.title;
    document.title = page ? page + ' | ' + BUSINESS.name : BUSINESS.name + ' — ' + BUSINESS.tagline;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', BUSINESS.description);
  }

  window.TK = { SITE, h, svgEl, money, activeProducts, findProduct, colorsOf, swatch, productImage, productCard, renderProcess };

  document.addEventListener('DOMContentLoaded', () => {
    setTitle(); buildHeader(); buildFooter(); bindContent();
    document.dispatchEvent(new Event('tk:ready'));
  });
})();
