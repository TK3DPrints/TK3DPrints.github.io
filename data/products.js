/* ==========================================================================
   PRODUCTS  —  every ready-made item in the shop lives in this one list.
   ========================================================================== */

const PRODUCTS = [
  {
    id: "ford-radio-mount",
    name: "Under-Dash Single DIN Radio Mount",
    price: 45.00,
    description: "Custom under-dash mount designed to fit a standard single-DIN radio in classic Ford interiors. Designed for a clean installation without modifying the original dash.",

    // Main image used by productImage()
    image: "images/radio-mount-1.png",

    // Additional images you want to keep
    extraImages: [
      "images/radio-mount-2.png",
      "images/radio-mount-3.jpg"
    ],

     const galleryWrapper = h('div', { class: 'card-gallery-wrapper' },
  h('button', { class: 'arrow left', onclick: () => gallery.scrollBy({ left: -120, behavior: 'smooth' }) }, '‹'),
  gallery,
  h('button', { class: 'arrow right', onclick: () => gallery.scrollBy({ left: 120, behavior: 'smooth' }) }, '›')
);


    category: "Ford",
    availableColors: [],
    featured: true,
    active: true
  }
];
