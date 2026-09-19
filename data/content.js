/* ==========================================================================
   PAGE TEXT  —  the wording on the Home page, About page, process steps and FAQ.
   Edit only the text inside the quotes. Keep the quotes and commas.
   ========================================================================== */

const CONTENT = {

  // ---- HOME PAGE ---------------------------------------------------------
  home: {
    heroTitle: "Practical things, printed layer by layer.",
    heroText:  "Order ready-made prints that ship or pick up locally, or tell us what you need and we'll design and print it just for you.",
    heroPrimaryButton:   "Shop ready-made",
    heroSecondaryButton: "Request a custom quote",

    // Three short points under the hero
    highlights: [
      { title: "Quality-checked",  text: "Each item is inspected before it ships, so you get a clean print every time." },
      { title: "Printed to order",   text: "Your item is printed after you order, in the color you choose." },
      { title: "Pickup or shipping", text: "Pick up locally for free or have it shipped to your door." }
    ],

    featuredTitle: "Popular right now",
    featuredLink:  "See the whole shop",

    customTitle: "Need something that doesn't exist yet?",
    customText:  "Send us a description, a sketch, photos, or a 3D file. We'll review it, design it if needed, and reply by email with a price and timeline.",
    customButton: "Start a custom request",

    ctaTitle: "Questions before you order?",
    ctaText:  "We're happy to help you pick a material, check a size, or plan a project.",
    ctaButton: "Contact us"
  },

  // ---- CUSTOM PRINT PAGE: how it works -----------------------------------
  process: [
    { title: "Describe your idea", text: "Fill out the form below. Photos, sketches and 3D files all help." },
    { title: "We review it",       text: "We check size, material and printability, and email you with questions if needed." },
    { title: "You get a quote",    text: "We reply with a price and timeline. There is no obligation to accept." },
    { title: "Approve and pay",    text: "If you're happy, we send a Square invoice. We start printing once it's paid." },
    { title: "Pickup or delivery", text: "We email you when it's ready for pickup, or ship it to you." }
  ],

  // ---- ABOUT PAGE --------------------------------------------------------
  about: {
    title: "A small workshop that makes useful things.",
    paragraphs: [
      "We are a small 3D-printing business. We do two things: sell ready-made products we've designed ourselves, and make custom parts and designs for people who need something specific.",
      "Ready-made products are listed in the shop with a fixed price. Pick a color, place your order, and we print it for you.",
      "Custom work starts with a conversation. Describe what you need, and we'll tell you what's possible, what it would cost, and how long it would take. We can also do the design work if you don't have a 3D file.",
      "Every order is printed, checked and packed by hand."
    ]
  },

  // ---- FAQ ---------------------------------------------------------------
  // Each entry is: { question: "...", answer: "..." },
  // To add a question, copy one entry and paste it below. To remove, delete it.
  faq: [
    {
      question: "What materials do you print with?",
      answer: "Mostly PLA, which comes in many colors and is great for indoor use. We also print in PETG for tougher, water-resistant parts, ABS/ASA for heat and outdoor use, and TPU for flexible parts. If you're not sure, choose \"Not sure\" on the quote form and we'll recommend one."
    },
    {
      question: "How long does printing take?",
      answer: "Most ready-made items ship or are ready for pickup within 3–7 days. Custom projects depend on size and design work; we'll give you a timeline with your quote."
    },
    {
      question: "Can you make something custom?",
      answer: "Yes. Use the Custom Print page to describe what you need. Include size, photos, and any 3D files you have. If you don't have a file, we can design it from your description."
    },
    {
      question: "What file types can I upload?",
      answer: "Photos as JPG, PNG or WebP. 3D files as STL, 3MF or OBJ. Files can be up to 8 MB each and 10 MB in total. If your file is larger, tell us in the notes and we'll arrange another way to send it."
    },
    {
      question: "How much will a custom item cost?",
      answer: "It depends on size, material, print time and design work. Submitting the form does not guarantee a price. We'll review your request and contact you with a quote."
    },
    {
      question: "How do I pay?",
      answer: "There's no checkout on this website. After you place an order or approve a quote, we send you a Square invoice by email. You can pay it online by card."
    },
    {
      question: "Do you ship, or can I pick up?",
      answer: "Both. Local pickup is free. Shipping is calculated by weight and destination and added to your invoice before you pay."
    },
    {
      question: "What is your return policy?",
      answer: "If your item arrives damaged or isn't what you ordered, contact us within 7 days and we'll reprint or refund it. Custom-designed items are made specifically for you, so they can't be returned unless there's a defect."
    },
  ]
};
