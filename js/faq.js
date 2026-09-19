/* faq.js — builds the FAQ list from content.js. */
document.addEventListener('tk:ready', () => {
  const { h } = TK;
  document.getElementById('faq-list').append(...CONTENT.faq.map(item =>
    h('details', { class: 'faq-item' },
      h('summary', { text: item.question }),
      h('p', { text: item.answer }))));
});
