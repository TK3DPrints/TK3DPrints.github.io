/* contact.js — the general contact form. */
document.addEventListener('tk:ready', () => {
  const { h } = TK;
  const form = document.getElementById('contact-form');

  const socials = (BUSINESS.social || []).filter(s => s.url);
  const socialBox = document.getElementById('social-links');
  if (socials.length) socials.forEach(s => socialBox.append(h('li', {}, h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer', text: s.name }))));
  else socialBox.closest('.contact-block').hidden = true;

  const hoursBox = document.getElementById('hours-list');
  if ((BUSINESS.hours || []).length) BUSINESS.hours.forEach(r => hoursBox.append(h('dt', { text: r.days }), h('dd', { text: r.time })));
  else hoursBox.closest('.contact-block').hidden = true;

  Forms.wire(form, {
    type: 'contact',
    subject: f => 'Website message from ' + f['Name'],
    collect: () => ({
      'Name': form.elements.name.value.trim(),
      'Email': form.elements.email.value.trim(),
      'Message': form.elements.message.value.trim()
    }),
    onSuccess: f => form.replaceWith(h('div', { class: 'success', role: 'status' },
      h('h2', { text: 'Message sent' }),
      h('p', { text: 'Thanks, ' + f['Name'] + '. We will reply to ' + f['Email'] + ' soon.' })))
  });
});
