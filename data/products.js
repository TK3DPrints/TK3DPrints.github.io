/* ==========================================================================
   PRODUCTS  —  every ready-made item in the shop lives in this one list.

   TO ADD A PRODUCT
     1. Put the photo in the  images  folder (example: images/my-item.jpg)
     2. Copy one whole { ... }, block below, paste it right after another one,
        and change the values.

   TO REMOVE A PRODUCT (without deleting it)  ->  set  active: false

   FIELDS
     id              Short unique name, lowercase, no spaces (use dashes).
                     Example: "controller-stand"
     name            The product's title.
     price           Number only — no $ sign.  Example: 15.00
     description     A sentence or two about the product.
     image           Path to the photo.  Example: "images/controller-stand.jpg"
                     (If the file is missing, an "Image coming soon" picture shows.)
     category        Groups products into filter buttons on the Shop page.
     availableColors Colors customers can pick. Use [] for "no color choice".
     featured        true = also shown on the Home page.
     active          true = visible in the shop.  false = hidden.

   Every product needs a comma after its closing brace  },
   If you need a quote mark inside text, write \"  like this.
   ========================================================================== */

const PRODUCTS = [

  {
    id: "controller-stand",
    name: "PS5 Controller Stand",
    price: 15.00,
    description: "A compact stand that holds a PS5 controller upright and keeps the charging port easy to reach. Weighted base, non-slip feet.",
    image: "images/controller-stand.svg",
    category: "Gaming",
    availableColors: ["Black", "White", "Blue"],
    featured: true,
    active: true
  },

  {
    id: "headphone-hook",
    name: "Under-Desk Headphone Hook",
    price: 9.00,
    description: "Clamps to the edge of a desk and holds headphones off the surface. No screws or adhesive needed.",
    image: "images/headphone-hook.svg",
    category: "Home Office",
    availableColors: ["Black", "White", "Gray"],
    featured: true,
    active: true
  },

  {
    id: "geometric-planter",
    name: "Geometric Planter",
    price: 18.00,
    description: "A faceted planter for small succulents and herbs, with a drainage hole and a matching saucer.",
    image: "images/geometric-planter.svg",
    category: "Home Decor",
    availableColors: ["White", "Green", "Orange", "Black"],
    featured: true,
    active: true
  },

  {
    id: "dice-tower",
    name: "Tabletop Dice Tower",
    price: 24.00,
    description: "A one-piece dice tower with internal ramps for fair rolls. Sized for standard tabletop dice.",
    image: "images/dice-tower.svg",
    category: "Tabletop",
    availableColors: ["Black", "Purple", "Red"],
    featured: true,
    active: true
  },

  {
    id: "cable-organizer",
    name: "Desk Cable Organizer",
    price: 8.00,
    description: "Five slots keep charging cables from sliding off your desk. Stick-on pad included.",
    image: "images/cable-organizer.svg",
    category: "Home Office",
    availableColors: ["Black", "White"],
    featured: false,
    active: true
  },

  {
    id: "phone-stand",
    name: "Foldable Phone Stand",
    price: 12.00,
    description: "Holds a phone at a comfortable viewing angle for video calls and recipes. Folds flat for a pocket or bag.",
    image: "images/phone-stand.svg",
    category: "Home Office",
    availableColors: ["Black", "White", "Blue", "Orange"],
    featured: false,
    active: true
  },

  // Example of a hidden product: it will NOT show on the site until you set active: true
  {
    id: "retired-example",
    name: "Retired Example Product",
    price: 5.00,
    description: "This product is hidden because active is false.",
    image: "images/does-not-exist.jpg",
    category: "Gaming",
    availableColors: ["Black"],
    featured: true,
    active: false
  }

];
