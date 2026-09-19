/* ==========================================================================
   forms.js — validation, file checks and sending for ALL forms
   (custom quote, product order, contact).

   HOW SENDING WORKS
   The browser sends the form as JSON to the Google Apps Script address in
   data/business.js (formEndpoint). That script emails it to you.
   No passwords or secret keys are used here. See README.
   ========================================================================== */
const Forms = (function () {
  'use strict';
  const { h } = TK;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp'];
  const MODEL_EXT = ['stl', '3mf', 'obj'];
  const MB = 1024 * 1024;
  const limits = BUSINESS.uploads;

  const extOf = name => (name.split('.').length > 1 ? name.split('.').pop().toLowerCase() : '');

  /* ---------- field errors ---------- */
  function setError(input, message) {
    const field = input.closest('.field') || input.parentElement;
    let err = field.querySelector('.field-error');
    if (!err) {
      err = h('p', { class: 'field-error', role: 'alert' });
      field.append(err);
    }
    if (!err.id) err.id = 'err-' + (input.id || input.name || Math.random().toString(36).slice(2));
    err.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', err.id);
  }
  function clearError(input) {
    const field = input.closest('.field') || input.parentElement;
    const err = field.querySelector('.field-error');
    if (err) err.remove();
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }
  function clearAll(form) { form.querySelectorAll('[aria-invalid]').forEach(clearError); }

  /* ---------- validate the simple text/number fields ---------- */
  // Reads rules from attributes: required, maxlength, minlength, min, max, type
  function validateFields(form) {
    let firstBad = null;
    const bad = (input, msg) => { setError(input, msg); if (!firstBad) firstBad = input; };
    clearAll(form);

    form.querySelectorAll('input, textarea, select').forEach(input => {
      if (['file', 'checkbox', 'radio', 'button', 'submit'].includes(input.type) || input.name === 'website') return;
      if (input.closest('[hidden]')) return;                             // skip hidden sections
      const value = input.value.trim();
      const label = (input.dataset.label || input.name).toLowerCase();

      if (input.required && !value) return bad(input, input.dataset.error || 'Please enter your ' + label + '.');
      if (!value) return;
      if (input.type === 'email' && !EMAIL_RE.test(value)) return bad(input, 'Enter a valid email address, like name@example.com.');
      if (input.minLength > 0 && value.length < input.minLength) return bad(input, 'Please write at least ' + input.minLength + ' characters.');
      if (input.maxLength > 0 && value.length > input.maxLength) return bad(input, 'That is too long (limit ' + input.maxLength + ' characters).');
      if (input.type === 'number') {
        const n = Number(value);
        if (!isFinite(n)) return bad(input, 'Enter a number.');
        if (input.min !== '' && n < Number(input.min)) return bad(input, 'The smallest allowed value is ' + input.min + '.');
        if (input.max !== '' && n > Number(input.max)) return bad(input, 'The largest allowed value is ' + input.max + '.');
        if (input.step === '1' && !Number.isInteger(n)) return bad(input, 'Enter a whole number.');
      }
    });
    return firstBad;
  }

  /* ---------- file rules ---------- */
  // kind: 'image' | 'model'. Returns an error message, or '' if the file is fine.
  function fileProblem(file, kind) {
    const allowed = kind === 'model' ? MODEL_EXT : IMAGE_EXT;
    if (!allowed.includes(extOf(file.name))) {
      return '"' + file.name + '" was not added. Allowed types: ' + allowed.join(', ').toUpperCase() + '.';
    }
    if (file.size === 0) return '"' + file.name + '" is empty.';
    if (file.size > limits.maxFileMB * MB) return '"' + file.name + '" is larger than ' + limits.maxFileMB + ' MB.';
    return '';
  }
  function totalProblem(files) {
    if (files.length > limits.maxFiles) return 'You can attach up to ' + limits.maxFiles + ' files.';
    const total = files.reduce((s, f) => s + f.size, 0);
    if (total > limits.maxTotalMB * MB) return 'Files are ' + (total / MB).toFixed(1) + ' MB in total. The limit is ' + limits.maxTotalMB + ' MB.';
    return '';
  }

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
      reader.onerror = () => reject(new Error('Could not read ' + file.name));
      reader.readAsDataURL(file);
    });
  }

  /* ---------- sending ---------- */
  // type: 'quote' | 'order' | 'contact'.  fields: { "Label": "value" }.  files: File[]
  async function submit(type, fields, files, honeypot) {
    const endpoint = (BUSINESS.formEndpoint || '').trim();
    if (!endpoint) return { ok: false, reason: 'not-configured' };

    const payload = {
      type,
      fields,
      website: honeypot || '',                                          // bots fill this; humans never see it
      files: await Promise.all((files || []).map(async f => ({
        name: f.name, size: f.size, data: await toBase64(f)
      })))
    };

    /* PAYMENT HOOK ------------------------------------------------------
       Today, orders are only *requests*; you invoice through Square.
       To let customers pay on the site later, this is the place to call a
       server-side function that creates a Square checkout link
       (the Square secret key must live on a server, NEVER in this file).
       ------------------------------------------------------------------- */

    try {
      // text/plain avoids a browser "preflight" request that Google Apps Script can't answer.
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      return data && data.ok ? { ok: true } : { ok: false, reason: 'server', message: data && data.error };
    } catch (e) {
      return { ok: false, reason: 'network' };
    }
  }

  // A plain email link as a backup when the form can't send.
  function mailtoLink(subject, fields) {
    const body = Object.entries(fields).filter(([, v]) => v).map(([k, v]) => k + ': ' + v).join('\n');
    return 'mailto:' + BUSINESS.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  /* ---------- status box under a form ---------- */
  function showStatus(box, kind, message, fallbackHref) {
    box.className = 'form-status ' + kind;
    box.replaceChildren(h('p', { text: message }));
    if (fallbackHref) box.append(h('p', {}, h('a', { href: fallbackHref, text: 'Send this by email instead' })));
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Explains a failed send in plain language.
  function explainFailure(box, result, subject, fields) {
    const link = mailtoLink(subject, fields);
    if (result.reason === 'not-configured') {
      showStatus(box, 'error',
        'This form is not connected to email yet. (Site owner: see the README, "Connect the forms to your email".) You can email ' + BUSINESS.email + ' directly.', link);
    } else if (result.reason === 'server' && result.message) {
      showStatus(box, 'error', result.message, link);
    } else {
      showStatus(box, 'error', 'We could not send this right now. Check your connection and try again, or email ' + BUSINESS.email + ' directly.', link);
    }
  }

  /* ---------- connect a <form> to validation + sending ---------- */
  // opts: type, subject, collect() -> fields, getFiles() -> File[],
  //       extraValidate() -> [{el, message}], onSuccess(fields)
  function wire(form, opts) {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    const idleLabel = button.textContent;

    form.addEventListener('input', e => { if (e.target.hasAttribute('aria-invalid')) clearError(e.target); });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      status.hidden = true;

      let firstBad = validateFields(form);
      (opts.extraValidate ? opts.extraValidate() : []).forEach(item => {
        setError(item.el, item.message);
        if (!firstBad) firstBad = item.el;
      });
      if (firstBad) { firstBad.focus(); return; }

      const fields = opts.collect();
      const files = opts.getFiles ? opts.getFiles() : [];
      const honeypot = form.elements.website ? form.elements.website.value : '';

      button.disabled = true;
      button.textContent = 'Sending…';
      const result = honeypot ? { ok: true } : await submit(opts.type, fields, files, honeypot);
      button.disabled = false;
      button.textContent = idleLabel;

      if (result.ok) opts.onSuccess(fields);
      else explainFailure(status, result, opts.subject(fields), fields);
    });
  }

  return { EMAIL_RE, IMAGE_EXT, MODEL_EXT, MB, limits, extOf, setError, clearError, clearAll, validateFields,
           fileProblem, totalProblem, submit, mailtoLink, showStatus, explainFailure, wire };
})();
