/* ==========================================================================
   BUSINESS INFORMATION  —  edit the values between the quotes.
   Change something here and it updates on EVERY page automatically.
   Rules: keep the quotes "like this", and keep the commas at the end of lines.
   ========================================================================== */

const BUSINESS = {

  // ---- The basics -------------------------------------------------------
  name: "TK 3D Prints",                       // Shows in the header, footer and browser tab
  tagline: "Ready-made and custom 3D prints",   // Short line used in the footer
  description:
    "TK 3D Prints designs and prints useful, good-looking things — from ready-made gear you can order today to one-off custom parts made from your idea.",

  // ---- Contact info -----------------------------------------------------
  email: "tk3dprintsstore@gmail.com",  // Shown on the site and used for "Email us" links.
                                 // (Form messages are delivered by the Google Apps Script — see README.)
  phone: "",                     // Leave as "" to hide the phone number everywhere
  location: "Edgerton, Ohio",  // Example: "Fort Wayne, Indiana"
  serviceArea: "Local pickup available. We ship anywhere in the US.",

  // ---- Business hours ---------------------------------------------------
  // Add or remove lines. Leave the list empty ( hours: [] ) to hide hours.
  hours: [],
  hoursNote: "Messages are answered within 1–2 business days.",

  // ---- Social media -----------------------------------------------------
  // Leave a url as "" and that link is hidden.
  social: [
    { name: "Instagram", url: "" },
    { name: "Facebook",  url: "https://www.facebook.com/share/1QGEnC22Ng/?mibextid=wwXIfr" },
    { name: "TikTok",    url: "" },
    { name: "YouTube",   url: "" }
  ],

  // ---- Pickup & shipping ------------------------------------------------
  // Set enabled to false to hide that choice on the order form.
  pickup: {
    enabled: true,
    label: "Local pickup",
    info: "Free. We'll email you when your order is ready and arrange a time."
  },
  shipping: {
    enabled: true,
    label: "Ship to me",
    info: "Shipping cost is calculated by weight and location and added to your invoice."
  },

  // ---- Materials offered on the custom quote form ------------------------
materials: [
  "Not sure — recommend one",

  // --- Filaments ---
  "PLA (standard, most colors)",
  "PLA+ (high-strength PLA)",
  "ABS (impact-resistant, machinable)",
  "ASA (UV and outdoor use)",
  "PETG (tougher, water resistant)",
  "TPU (flexible / rubbery)",
  "Nylon (durable, wear-resistant)",
  "PC (polycarbonate, high heat resistance)",
  "Carbon Fiber PLA",
  "Carbon Fiber PETG",
  "Wood PLA",
  "Silk PLA",
  "Metal-filled PLA",
],


  // ---- Colors shown as swatches on products -------------------------------
  // A color name used in products.js is matched here (not case sensitive).
  // Colors that aren't listed still work — they just show as a plain text label.
  colorSwatches: {
    "Black":  "#1b1b1d",
    "White":  "#f4f4f2",
    "Gray":   "#8a9199",
    "Grey":   "#8a9199",
    "Red":    "#d1352b",
    "Orange": "#f07a1a",
    "Yellow": "#f5c518",
    "Green":  "#2f9e5a",
    "Blue":   "#2358d6",
    "Purple": "#7a4bc4",
    "Pink":   "#e8739f",
    "Teal":   "#17a2a2",
    "Silver": "#b9bfc6",
    "Gold":   "#c9a13b",
    "Wood":   "#b8875a"
  },

  // ---- Form delivery (see README, "Connect the forms to your email") ------
  // Paste the Google Apps Script "Web app URL" between the quotes.
  // This is a public address, NOT a password — it is safe to keep in GitHub.
  formEndpoint: "https://script.google.com/macros/s/AKfycbyE1APDHB9Q9qfzUvL5Ct54t8gJRlj3U84Hte6lDFghroFuTH5Bk2_EriwRPrTz2_UJlA/exec",

  // ---- Upload limits (checked again by the script on the server side) ------
  uploads: {
    maxFiles: 6,          // total files per request
    maxFileMB: 8,         // biggest single file
    maxTotalMB: 10        // all files together
  },

  // ---- Payments ---------------------------------------------------------
  // "invoice" = you send a Square invoice after reviewing the request.
  // This is the only mode in the first version. See js/forms.js ("PAYMENT HOOK")
  // for where a future Square checkout could be added.
  paymentMode: "invoice",
  paymentNote: "No payment is taken on this website. After we confirm your order, you'll get a Square invoice by email."
};
