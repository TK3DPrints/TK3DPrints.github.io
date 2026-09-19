# TK 3D Printing — Website (Phase 1)

A simple, fast website with a shop of ready-made 3D prints and a custom-quote form.
Everything you'll ever want to change lives in **three text files** in the `data` folder.
You never need to touch the other code.

| File you edit | What it controls |
|---|---|
| `data/products.js` | Every product: name, price, photo, colors, featured, hidden |
| `data/business.js` | Business name, email, phone, hours, social links, pickup/shipping, materials |
| `data/content.js` | Homepage words, About page, "how custom works" steps, the FAQ |

Photos go in the `images` folder.

> **Tip for editing:** you can edit files right on GitHub (open the file → pencil icon → **Commit changes**).
> The site updates about a minute later. Keep the **quotes** `" "` and **commas** `,` exactly as they are —
> only change the words between the quotes.

---

## 1. What is in the project

```
index.html, shop.html, product.html, custom.html,
about.html, faq.html, contact.html      ← the pages (you don't need to edit these)
data/
  products.js     ← YOUR PRODUCTS
  business.js     ← YOUR BUSINESS INFO + settings
  content.js      ← YOUR PAGE TEXT + FAQ
images/           ← product photos, favicon
css/styles.css    ← colors and fonts (top of file), rarely needed
js/               ← the code that builds pages from your data (leave alone)
apps-script/Code.gs  ← NOT part of the website: the email relay you paste into Google (Section 5)
.gitignore        ← tells Git which files to never upload
```

---

## 2. How to change things (step by step)

### Add a product
1. Get a **square** photo (about 800 × 800 pixels; `.jpg` or `.webp`; under ~300 KB loads fastest).
   Name it with no spaces, like `desk-lamp.jpg`.
2. Put it in the `images` folder (on GitHub: open `images` → **Add file → Upload files**).
3. Open `data/products.js`. Copy one whole product block (from `{` to `},`), paste it right after another block, and change the values:
   ```js
   {
     id: "desk-lamp",                 // unique, lowercase, dashes, no spaces
     name: "Desk Lamp Shade",
     price: 22.00,                    // numbers only, no $
     description: "A faceted lamp shade that fits standard E26 bulbs.",
     image: "images/desk-lamp.jpg",
     category: "Home Decor",
     availableColors: ["White", "Black"],
     featured: false,
     active: true
   },
   ```
4. Save/commit. The new product appears in the shop with its own product page.

### Remove a product (without deleting it)
Change `active: true` to `active: false`. It disappears from the shop, the home page, and its page link.
Change it back to `true` any time to bring it back.

### Change a product's name / price / description
Edit `name`, `price` or `description` in `data/products.js`. That's the only place.

### Replace a product image
Upload the new photo to `images` with a **new name** (helps avoid old-photo caching), then change the product's `image:` line to match.
(Or upload with the same name to overwrite it — you may need to refresh a couple of times to see it.)

### Add or remove colors
Edit the list: `availableColors: ["Black", "White", "Blue"]`. Use `[]` for a product with no color choice.
Common color names (Black, White, Red, Blue, Green, …) get a colored dot automatically. To add a new color dot,
add a line to `colorSwatches` in `data/business.js`, e.g. `"Mint": "#98e0c0",`.

### Mark a product as featured
Set `featured: true`. Up to four featured products show on the home page (the first one is the large hero picture).
If none are featured, the home page shows the first few products.

### Change categories
Change the `category:` text on products. The shop's filter buttons are made automatically from the categories in use.

### Change my business email
`data/business.js` → `email: "..."`. That changes what customers **see** and the "email us" links.

> ⚠️ **The email that RECEIVES form submissions is set separately** in the Google script (`RECIPIENT` in `Code.gs`, Section 5).
> If you change your email, change it in both places.

### Change my business name
`data/business.js` → `name: "TK 3D Printing"`. It updates in the header, footer, page titles, and everywhere else.
(To change the little logo, edit `images/favicon.svg`.)

### Change phone, location, hours, social links, pickup/shipping text
All in `data/business.js`. Leave `phone: ""` to hide the phone number. Leave a social `url: ""` to hide that link.
In the `pickup` or `shipping` block, change `enabled: true` to `enabled: false` to remove that choice from the order form.

### Change the FAQ
`data/content.js` → the `faq` list. Each question is one block:
```js
{ question: "Do you make gifts?", answer: "Yes! ..." },
```
Copy a block to add one; delete a block to remove one.

### Change the homepage text
`data/content.js` → `home: { ... }` (headline, paragraph, button labels, the three highlights, the custom-print section).
About-page text is `about: { ... }` in the same file.

### Change the site colors
Top of `css/styles.css`, the `:root { ... }` block: `--accent` (buttons/links), `--signal` (yellow highlight), `--ink` (dark).

---

## 3. What is static and what is an outside service

| Part | Where it lives | Notes |
|---|---|---|
| Web pages, styles, product list, text | **GitHub Pages** (static) | Free, HTTPS included. Cannot receive form data by itself. |
| Form submissions + file uploads → email | **Google Apps Script** (your Google account) | Free. Runs the little relay in `apps-script/Code.gs`. |
| Invoicing / payment | **Square** (you send invoices by hand) | No payments happen on the website. |
| Database, accounts, payment processing | **None** | Not needed in Phase 1. |

Nothing secret is stored in this repository. The Apps Script "web app URL" you paste into `business.js` is a
*public address* (like a phone number), not a password.

---

## 4. Things you must set up outside the code

- [ ] **GitHub account + repository** (Section 6)
- [ ] **Turn on GitHub Pages** (Section 6)
- [ ] **Google Apps Script relay** so forms email you (Section 5) — *until you do this, the forms show "not connected yet"*
- [ ] Replace the **sample product photos** (`images/*.svg` are placeholders) with real photos
- [ ] Edit `data/business.js`: real **location**, **hours**, **phone** (optional), **social links**
- [ ] Read the FAQ text in `data/content.js` and make sure it matches how you really work (print times, returns policy, file ownership) — I wrote sensible starter answers, but they're your policies
- [ ] Your **Square** account (you already have this) — you'll send invoices manually
- [ ] *(Later, optional)* a custom domain name

---

## 5. Connect the forms to your email (Google Apps Script)

This is a free "relay": the website sends the form (and any uploaded files) to a tiny script in *your* Google account,
and the script emails it to you. Files are only attached to that email — they aren't stored on the website.
**Takes about 10 minutes.**

1. Sign in to Google with the account you want the script to run under (use the same Gmail that will receive the requests).
2. Go to **https://script.google.com** → **New project**.
3. Delete everything in the editor, then open `apps-script/Code.gs` from this project, copy it all, and paste it in.
4. At the top, check `var RECIPIENT = "vomit1214@gmail.com";` — that's where requests are delivered. Change it if needed.
5. Click the **Save** (disk) icon. Name the project "TK 3D Printing form relay".
6. Click **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
7. Click **Deploy**. Google asks you to **Authorize access**:
   choose your account → you'll see *"Google hasn't verified this app"* (normal — it's your own script) →
   **Advanced → Go to (project name) (unsafe) → Allow**. It needs permission to send email as you.
8. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/AKfyc.../exec`).
9. Open `data/business.js` and paste it: `formEndpoint: "https://script.google.com/macros/s/.../exec",`
10. Commit/publish the change, wait about a minute, then **submit a test** on your live site's Custom Print page (with a photo) and check your inbox (and Spam, the first time).

**Good to know**
- When you reply to a request email, your reply goes **straight to the customer** (the script sets Reply-To).
- Free Gmail can send about **100 emails per day** this way — plenty for a small business.
- **If you edit `Code.gs` later:** *Deploy → Manage deployments → pencil → Version: New version → Deploy.* The URL stays the same.
- Upload limits are 6 files, 8 MB each, 10 MB total (photos: JPG/PNG/WebP; 3D: STL/3MF/OBJ). To change them,
  edit `uploads` in `data/business.js` **and** the matching numbers at the top of `Code.gs`.
- The script also blocks spam: a hidden "honeypot" field, and a cap of 30 submissions per hour.
- If forms ever fail, customers see a message and a "send by email instead" link, so no request is silently lost.

---

## 6. Put the website on GitHub Pages

1. Create a free account at **github.com** and click **New repository**. Name it (e.g. `tk-3d-printing`). Choose **Public** (required for free Pages). Do **not** add a README (this project has one).
2. Upload the project: on the new repo page click **uploading an existing file**, drag in **all files and folders** from this project
   (the *contents* — `index.html`, `data`, `images`, etc. must be at the top level, not inside another folder). Click **Commit changes**.
   *(Make sure `.gitignore` is included. It may be hidden in your file explorer — turn on "show hidden files".)*
3. Go to **Settings → Pages**. Under **Build and deployment → Source**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute, your site is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.
5. Tick **Enforce HTTPS** on the same Pages settings page (it's on by default for new sites).
6. *(Optional)* In Pages settings you can add a **custom domain** later; GitHub explains the DNS steps there.

Every time you commit a change to a file, the live site updates automatically in about a minute.

**Trying it on your computer first:** you can double-click `index.html` to preview. (Fonts load from the internet; forms only
work once the script from Section 5 is connected.)

---

## 7. How ordering works (Phase 1)

**Ready-made order:** customer picks color, quantity, pickup/shipping, enters name + email → you get an email →
you confirm details and **send a Square invoice**.
**Custom quote:** customer describes the project + uploads photos/3D files → you get an email with the files attached →
you reply with a price → they approve → you **send a Square invoice**.

> **Always take the price from your `products.js`, not from the email.** The order email includes the price the customer's
> browser displayed, but anyone technical could alter that. Treat every order as a *request* you check before invoicing.

**Adding Square checkout later:** the code has a marked spot (`PAYMENT HOOK` in `js/forms.js`) and `paymentMode` in
`business.js`. The simplest future step is to create *Payment Links* in your Square dashboard and add a `squareLink` field to each
product; a fully automatic checkout would need a small server component (Square's secret keys must **never** go in this repo).

---

## 8. Security notes

- **No card data** is collected or stored. No payment processor code is included.
- **No secrets** anywhere in the repo: no API keys, passwords, or tokens. `.gitignore` also blocks common secret files (`.env`, `*.key`, …) and customer file folders.
- **Forms are validated twice**: in the browser (friendly messages) and again in the Google script (where it really counts):
  required fields, email format, length limits, file **type allow-list** (JPG/PNG/WebP/STL/3MF/OBJ), file **size and count limits**.
- **Uploaded files are never opened, run, or published.** They're only attached to an email sent to you. Treat unknown attachments with normal email caution.
- All customer text is escaped before it goes into the email (no HTML injection).
- The pages set a **Content-Security-Policy** so only this site's own scripts run, and the only outside connection allowed for data is Google's script address. Pages are built with safe DOM methods (no `innerHTML`).
- **HTTPS** is provided by GitHub Pages.
- The public website code is fully separated from anything server-side: the only "server" is the small Google script, and it's a separate file that isn't deployed with the site.
- Honest limitation: because the form address is public, a determined spammer could send junk. The limits above cap the damage, and the worst case is temporary "try again / email us" messages.

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| Site is blank / products missing | A typo in a data file (missing quote or comma). Press F12 → Console shows which file and line. Undo your last edit to compare. |
| A product doesn't show | Check `active: true`, that `price` is a number (no quotes, no `$`), and that its `id` is unique with no spaces. The Console names skipped products. |
| Product photo shows "Image coming soon" | The file name/path doesn't match `image:` exactly (capitals matter: `Lamp.JPG` ≠ `lamp.jpg`). |
| Form says "not connected yet" | Finish Section 5 and paste the URL into `formEndpoint`. |
| Form says it couldn't send | Re-check the script deployment: *Execute as: Me*, *Access: Anyone*, and that you deployed a **new version** after editing. |
| Emails land in spam | Mark one as "Not spam" once; Gmail learns. |
| Changes don't appear | Wait ~1–2 minutes and hard-refresh (Ctrl/Cmd + Shift + R). |

---

## 10. What was tested

Real-browser tests (Chromium) on desktop (1280 px) and phone (390 px) width: all 7 pages load without JavaScript errors or sideways scrolling;
navigation and mobile menu; category filtering and search; empty search results; empty store; hidden (`active: false`) products (also blocked when opened by direct link);
unknown/missing product links; missing product images (fallback picture); products with no colors; an invalid entry in `products.js` (skipped with a console warning);
the order form (validation, quantity, shipping address, success, failure); the custom quote form (required fields, bad email, too-short text, negative sizes,
blocked `.exe`, over-size file, add/remove files, multi-file send with correct data); honeypot; server error, network error and "not configured" states; all internal links.
The Apps Script logic was tested against mocked Google services with valid and hostile submissions.
**Not tested (needs your accounts):** the live Google script deployment and real email delivery — that's what your test submission in Section 5, step 10 is for.
