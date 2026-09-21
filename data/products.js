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
    id: "ford-radio-mount",
    name: "Under-Dash Single DIN Radio Mount",
    price: 45.00,
    description: "Custom under-dash mount designed to fit a standard single-DIN radio in classic Ford interiors. Designed for a clean installation without modifying the original dash.",
  images: [
  "images/radio-mount-1.png",
  "images/radio-mount-2.png",
  "images/radio-mount-3.jpg"
],    
     category: "Ford",
    availableColors: [],
    featured: true,
    active: true
  }

];
