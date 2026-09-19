/* product.js — builds one product page and its order form from products.js. */
document.addEventListener('tk:ready', () => {
  const { h, findProduct, colorsOf, swatch, productImage, money } = TK;
  const root = document.getElementById('product-root');
  const id = new URLSearchParams(location.search).get('id');
  const p = id ? findProduct(id) : null;

  // Unknown, hidden (active:false) or missing product
  if (!p) {
    document.title = 'Product not found | ' + BUSINESS.name;
    root.replaceChildren(h('div', { class: 'not-found' },
      h('h1', { text: 'We can’t find that product' }),
      h('p', { text: 'It may have been removed or is no longer available.' }),
      h('a', { class: 'btn', href: 'shop.html', text: 'Back to the shop' })));
    return;
  }
  document.title = p.name + ' | ' + BUSINESS.name;
  document.getElementById('crumb-name').textContent = p.name;

  const colors = colorsOf(p);
  const ways = [];
  if (BUSINESS.pickup.enabled)   ways.push({ value: 'Pickup',   ...BUSINESS.pickup });
  if (BUSINESS.shipping.enabled) ways.push({ value: 'Shipping', ...BUSINESS.shipping });

  /* --- form pieces --- */
  const field = (label, control, hint) => h('div', { class: 'field' },
    h('label', { for: control.id, text: label }), control, hint ? h('p', { class: 'hint', text: hint }) : null);

  const qty = h('input', { id: 'qty', name: 'quantity', type: 'number', inputmode: 'numeric', min: 1, max: 99, step: 1, value: 1, required: true, 'data-label': 'quantity', class: 'qty-input' });
  const total = h('output', { class: 'total', for: 'qty', text: money(p.price) });
  const updateTotal = () => {
    const n = Math.max(1, Math.min(99, parseInt(qty.value, 10) || 1));
    total.textContent = money(p.price * n);
  };
  qty.addEventListener('input', updateTotal);
  const step = delta => () => { qty.value = Math.max(1, Math.min(99, (parseInt(qty.value, 10) || 1) + delta)); clearIfInvalid(); updateTotal(); };
  const clearIfInvalid = () => Forms.clearError(qty);

  const colorGroup = colors.length
    ? h('fieldset', { class: 'field choice-group' },
        h('legend', { text: 'Color' }),
        h('div', { class: 'choices' }, colors.map((c, i) =>
          h('label', { class: 'choice' },
            h('input', { type: 'radio', name: 'color', value: c, checked: i === 0, required: true }),
            swatch(c), h('span', { text: c })))))
    : null;

  const wayGroup = ways.length > 1
    ? h('fieldset', { class: 'field choice-group' },
        h('legend', { text: 'Pickup or shipping' }),
        h('div', { class: 'choices choices-stack' }, ways.map((w, i) =>
          h('label', { class: 'choice choice-wide' },
            h('input', { type: 'radio', name: 'way', value: w.value, checked: i === 0 }),
            h('span', {}, h('strong', { text: w.label }), h('small', { text: w.info }))))))
    : null;

  const address = h('textarea', { id: 'address', name: 'address', rows: 3, maxlength: 300, 'data-label': 'shipping address', autocomplete: 'street-address' });
  const addressField = h('div', { class: 'field', hidden: true }, h('label', { for: 'address', text: 'Shipping address' }), address);
  function syncWay() {
    const chosen = wayGroup ? form.elements.way.value : (ways[0] ? ways[0].value : 'Pickup');
    const ship = chosen === 'Shipping';
    addressField.hidden = !ship;
    address.required = ship;
    if (!ship) Forms.clearError(address);
  }

  const status = h('div', { class: 'form-status', role: 'status', hidden: true });
  const submitBtn = h('button', { class: 'btn btn-block', type: 'submit', text: 'Send order request' });
  const honeypot = h('div', { class: 'hp', 'aria-hidden': 'true' },
    h('label', { for: 'website', text: 'Leave this empty' }),
    h('input', { id: 'website', name: 'website', type: 'text', tabindex: '-1', autocomplete: 'off' }));

  const form = h('form', { class: 'order-form', novalidate: true, 'aria-label': 'Order ' + p.name },
    colorGroup,
    h('div', { class: 'field' },
      h('label', { for: 'qty', text: 'Quantity' }),
      h('div', { class: 'stepper' },
        h('button', { type: 'button', 'aria-label': 'Decrease quantity', text: '−', onclick: step(-1) }),
        qty,
        h('button', { type: 'button', 'aria-label': 'Increase quantity', text: '+', onclick: step(1) }))),
    wayGroup, addressField,
    field('Your name', h('input', { id: 'name', name: 'name', type: 'text', required: true, maxlength: 100, autocomplete: 'name', 'data-label': 'name' })),
    field('Your email', h('input', { id: 'email', name: 'email', type: 'email', required: true, maxlength: 160, autocomplete: 'email', inputmode: 'email', 'data-label': 'email' })),
    field('Notes (optional)', h('textarea', { id: 'notes', name: 'notes', rows: 3, maxlength: 1000, 'data-label': 'notes' })),
    honeypot,
    h('p', { class: 'order-total' }, 'Estimated total ', total, h('span', { class: 'hint', text: ' before shipping and tax' })),
    submitBtn,
    h('p', { class: 'hint', text: 'This sends an order request. We will email you to confirm, then send a Square invoice. You are not charged on this website.' }),
    status);

  form.addEventListener('change', syncWay);

  Forms.wire(form, {
    type: 'order',
    subject: f => 'Order request: ' + p.name + ' × ' + f['Quantity'],
    collect: () => {
      const n = Math.max(1, parseInt(qty.value, 10) || 1);
      const way = wayGroup ? form.elements.way.value : (ways[0] ? ways[0].value : 'Pickup');
      return {
        'Product': p.name,
        'Product ID': p.id,
        'Color': colors.length ? form.elements.color.value : '',
        'Quantity': String(n),
        'Price each (as shown on the site)': money(p.price),
        'Estimated total (before shipping and tax)': money(p.price * n),
        'Pickup or shipping': way,
        'Shipping address': way === 'Shipping' ? address.value.trim() : '',
        'Name': form.elements.name.value.trim(),
        'Email': form.elements.email.value.trim(),
        'Notes': form.elements.notes.value.trim()
      };
    },
    onSuccess: f => {
      form.replaceWith(h('div', { class: 'success', role: 'status' },
        h('h2', { text: 'Order request sent' }),
        h('p', { text: 'Thanks, ' + f['Name'] + '. We will email ' + f['Email'] + ' to confirm your order and send a Square invoice.' }),
        h('p', { class: 'summary', text: f['Quantity'] + ' × ' + f['Product'] + (f['Color'] ? ' (' + f['Color'] + ')' : '') }),
        h('a', { class: 'btn btn-ghost', href: 'shop.html', text: 'Keep shopping' })));
    }
  });

  root.replaceChildren(h('div', { class: 'product-layout' },
    h('div', { class: 'product-media' }, productImage(p, { loading: 'eager', fetchpriority: 'high' })),
    h('div', { class: 'product-info' },
      p.category ? h('p', { class: 'tag', text: p.category }) : null,
      h('h1', { text: p.name }),
      h('p', { class: 'price price-large', text: money(p.price) }),
      h('p', { class: 'product-desc', text: p.description || '' }),
      form)));
  syncWay();
});
