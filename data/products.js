/* ==========================================================================
   PRODUCTS  —  every ready-made item in the shop lives in this one list.
   ========================================================================== */

const PRODUCTS = [
  {
    id: "ford-radio-mount",
    name: "Under-Dash Single DIN Radio Mount",
    price: 45.00,
    description: "Custom under-dash mount designed to fit a standard single-DIN radio in classic Ford interiors. Designed for a clean installation without modifying the original dash.",

    image: "images/radio-mount-1.png",

    extraImages: [
      "images/radio-mount-2.png",
      "images/radio-mount-3.jpg"
    ],

    category: "Ford",
    availableColors: [],
    featured: true,
    active: true
  },

  {
    id: "decorative-tree",
    name: "PVC Mega Tree Light Topper",
    price: 19.00,

    description: "Create a professional-looking holiday light tree with this durable 3D printed topper. Designed to mount on a PVC center pole, the topper provides evenly spaced attachment points for light strands. Run lights from the upper tabs down to ground stakes to quickly create the iconic cone-shaped silhouette of a Christmas tree made entirely from lights. Ideal for DIY holiday displays, mega trees, and seasonal outdoor decorations.",

    image: "images/TreeTopview.jpg",

    extraImages: [
      "images/TreeBottomView.jpg",
      "images/TreeMeasurement.png"
    ],

    category: "Holiday Decor",
    availableColors: [],
    featured: true,
    active: true
  },

  {
    id: "rc-stand",
    name: "RC stand",
    price: 15.00,

    description: "Durable 3D printed display stand designed to showcase RC cars and trucks. Provides a stable platform for storage, display, maintenance, and photography while keeping tires off the surface and preventing flat spots.",

    image: "images/RCstand.jpg",

    extraImages: [
      "images/RCstand2.jpg"
    ],

    category: "RC Accessories",
    availableColors: [],
    featured: false,
    active: true
  }
];
