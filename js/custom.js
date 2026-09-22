/* custom.js — the custom quote form (fields, file picking, checks, sending). */
document.addEventListener('tk:ready', () => {
  const { h, renderProcess } = TK;
  renderProcess(document.getElementById('process'));

  const form = document.getElementById('quote-form');

  // Show the real upload limits from business.js
  const L = BUSINESS.uploads;
  document.getElementById('limits-text').textContent =
    `${L.maxFileMB} MB per file and ${L.maxTotalMB} MB in total, maximum ${L.maxFiles} files`;

  // Fill the material dropdown and color suggestions from business.js
  const material = form.elements.namedItem('material');
  BUSINESS.materials.forEach(m =>
    material.append(h('option', { value: m, text: m }))
  );

  const colorList = document.getElementById('color-suggestions');
  Object.keys(BUSINESS.colorSwatches || {}).forEach(c =>
    colorList.append(h('option', { value: c }))
  );

  // Simple color names + visual picker
  const COLOR_NAMES = {
    '#000000': 'Black',
    '#ffffff': 'White',
    '#ff0000': 'Red',
    '#00ff00': 'Green',
    '#0000ff': 'Blue',
    '#ffff00': 'Yellow',
    '#ff00ff': 'Magenta',
    '#00ffff': 'Cyan',
    '#808080': 'Gray'
  };

  function nearestColorName(hex) {
    hex = hex.toLowerCase();
    return COLOR_NAMES[hex] || hex;
  }

  const colorPicker = document.getElementById('q-color');
  const colorNameInput = document.getElementById('q-color-name');
  const colorChooseBtn = document.getElementById('color-choose');

  if (colorChooseBtn && colorPicker && colorNameInput) {
    colorChooseBtn.addEventListener('click', () => {
      colorPicker.click();
    });

    colorPicker.addEventListener('input', () => {
      const hex = colorPicker.value;
      const name = nearestColorName(hex);
      colorNameInput.value = name;
    });
  }

  // File pickers
  const picks = {
    image: { input: form.elements.photos, list: document.getElementById('photo-list'), files: [] },
    model: { input: form.elements.models, list: document.getElementById('model-list'), files: [] }
  };

  const allFiles = () => picks.image.files.concat(picks.model.files);

  const kb = n =>
    n < 1024 * 1024
      ? `${Math.max(1, Math.round(n / 1024))} KB`
      : `${(n / 1024 / 1024).toFixed(1)} MB`;

  function renderList(kind) {
    const pick = picks[kind];
    pick.list.replaceChildren(
      ...pick.files.map(file => {
        const thumb =
          kind === 'image'
            ? h('img', {
                class: 'thumb',
                src: URL.createObjectURL(file),
                alt: '',
                width: 48,
                height: 48
              })
            : h('span', {
                class: 'thumb thumb-file',
                'aria-hidden': 'true',
                text: Forms.extOf(file.name).toUpperCase()
              });

        return h(
          'li',
          {},
          thumb,
          h('span', { class: 'file-name', text: file.name }),
          h('span', { class: 'file-size', text: kb(file.size) }),
          h('button', {
            type: 'button',
            class: 'link-button',
            'aria-label': `Remove ${file.name}`,
            text: 'Remove',
            onclick: () => {
              pick.files = pick.files.filter(f => f !== file);
              Forms.clearError(pick.input);
              renderList(kind);
            }
          })
        );
      })
    );
  }

  Object.entries(picks).forEach(([kind, pick]) => {
    pick.input.addEventListener('change', () => {
      Forms.clearError(pick.input);
      const problems = [];

      Array.from(pick.input.files).forEach(file => {
        const dup = pick.files.some(f => f.name === file.name && f.size === file.size);
        const problem = dup ? '' : Forms.fileProblem(file, kind);

        if (problem) problems.push(problem);
        else if (!dup) pick.files.push(file);
      });

      const overall = Forms.totalProblem(allFiles());
      if (overall) {
        problems.push(overall);
        pick.files = pick.files.filter(f => !Array.from(pick.input.files).includes(f));
      }

      pick.input.value = '';
      renderList(kind);

      if (problems.length) Forms.setError(pick.input, problems.join(' '));
    });
  });

  Forms.wire(form, {
    type: 'quote',
    subject: f => `Custom quote request: ${f['What would you like made?']}`,
    getFiles: allFiles,

    extraValidate: () => {
      const issues = [];
      const problem = Forms.totalProblem(allFiles());
      if (problem) issues.push({ el: picks.image.input, message: problem });
      return issues;
    },

    collect: () => {
      const v = n => (form.elements.namedItem(n) ? form.elements.namedItem(n).value.trim() : '');

      const dims = ['length', 'width', 'height'].map(n => v(n)).some(Boolean)
        ? `${v('length') || '?'} × ${v('width') || '?'} × ${v('height') || '?'} ${v('units')} (L × W × H)`
        : '';

      return {
        'Name': v('name'),
        'Email': v('email'),
        'What would you like made?': v('title'),
        'Description': v('description'),
        'Dimensions': dims,
        'Quantity': v('quantity'),
        'Preferred color': v('color'),
        'Preferred material': v('material'),
        'Additional notes': v('notes'),
        'Attached files': allFiles().map(f => f.name).join(', ')
      };
    },

    onSuccess: f => {
      form.replaceWith(
        h(
          'div',
          { class: 'success', id: 'quote-success', role: 'status' },
          h('h2', { text: 'Request received' }),
          h('p', {
            text: `Thanks, ${f['Name']}. We will review your request and email ${f['Email']} with questions or a quote. Submitting this form does not guarantee a price.`
          }),
          h('a', {
            class: 'btn btn-ghost',
            href: 'index.html',
            text: 'Back to home'
          })
        )
      );

      document.getElementById('quote-success').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  });
});
