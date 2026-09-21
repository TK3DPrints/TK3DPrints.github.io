/**
 * TK 3D Printing — form-to-email relay (Google Apps Script)
 *
 * This is NOT part of the website. You paste it into script.google.com
 * (see README, "Connect the forms to your email"). It receives the quote
 * form, order form and contact form from the website and emails them to you.
 *
 * - Runs as YOUR Google account. Uploaded files are only attached to the
 *   email — they are never stored publicly.
 * - No passwords or keys are in this file.
 * - The rules below (allowed file types, sizes) are checked AGAIN here, because
 *   anything checked only in the browser can be bypassed.
 */

// >>> Where the emails should go. Must be an address you can receive mail at.
var RECIPIENT = "timothyknappwork@gmail.com";
var BUSINESS_NAME = "TK 3D Prints";

// ---- Safety limits (keep in sync with data/business.js) ----
var MAX_FILES = 6;
var MAX_FILE_BYTES = 8 * 1024 * 1024;
var MAX_TOTAL_BYTES = 10 * 1024 * 1024;
var ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "stl", "3mf", "obj"];
var MAX_REQUESTS_PER_HOUR = 30;       // protects your inbox from floods
var MAX_FIELD_LENGTH = 3000;
var TYPES = { quote: "Custom quote request", order: "Order request", contact: "Website message" };

function doGet() {
  return reply_({ ok: true, message: "The form relay is running." });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return fail_("Empty request.");
    if (e.postData.contents.length > 16 * 1024 * 1024) return fail_("That upload is too large.");

    var data = JSON.parse(e.postData.contents);

    // Bots fill the hidden "website" field. Pretend it worked, send nothing.
    if (data.website) return reply_({ ok: true });

    if (!TYPES[data.type]) return fail_("Unknown form type.");
    if (!allowRequest_()) return fail_("Too many requests right now. Please email us directly.");

    // --- fields: only plain text, trimmed and length-limited ---
    var fields = data.fields || {};
    var rows = [];
    var replyTo = "";
    Object.keys(fields).slice(0, 30).forEach(function (label) {
      var value = String(fields[label] == null ? "" : fields[label]).trim().substring(0, MAX_FIELD_LENGTH);
      var key = String(label).substring(0, 80);
      if (value) rows.push([key, value]);
      if (key === "Email") replyTo = value;
    });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(replyTo)) return fail_("Please enter a valid email address.");
    if (rows.length === 0) return fail_("The form was empty.");

    // --- files: allow-list of extensions, size caps, never executed ---
    var attachments = [];
    var files = (data.files || []);
    if (files.length > MAX_FILES) return fail_("Too many files (limit " + MAX_FILES + ").");
    var total = 0;
    for (var i = 0; i < files.length; i++) {
      var name = safeName_(files[i].name);
      var ext = name.indexOf(".") > -1 ? name.split(".").pop().toLowerCase() : "";
      if (ALLOWED_EXT.indexOf(ext) === -1) return fail_("File type not allowed: ." + ext);
      var bytes = Utilities.base64Decode(String(files[i].data || ""));
      if (bytes.length === 0) return fail_("A file was empty.");
      if (bytes.length > MAX_FILE_BYTES) return fail_(name + " is too large.");
      total += bytes.length;
      if (total > MAX_TOTAL_BYTES) return fail_("Files are too large in total.");
      attachments.push(Utilities.newBlob(bytes, "application/octet-stream", name));
    }

    // --- build the email ---
    var who = "";
    rows.forEach(function (r) { if (r[0] === "Name") who = r[1]; });
    who = who.replace(/[\r\n]+/g, " ").substring(0, 80);   // no line breaks in the subject line
    var subject = "[" + BUSINESS_NAME + "] " + TYPES[data.type] + (who ? " from " + who : "");
    var text = rows.map(function (r) { return r[0] + ": " + r[1]; }).join("\n\n");
    var html = "<h2>" + esc_(TYPES[data.type]) + "</h2><table cellpadding='6' style='border-collapse:collapse'>" +
      rows.map(function (r) {
        return "<tr><td style='vertical-align:top;font-weight:bold;border-bottom:1px solid #ddd'>" + esc_(r[0]) +
               "</td><td style='border-bottom:1px solid #ddd;white-space:pre-wrap'>" + esc_(r[1]) + "</td></tr>";
      }).join("") + "</table><p style='color:#666'>Reply to this email to answer the customer directly." +
      (attachments.length ? " " + attachments.length + " file(s) attached." : "") + "</p>";

    MailApp.sendEmail({
      to: RECIPIENT,
      replyTo: replyTo,
      name: BUSINESS_NAME + " website",
      subject: subject,
      body: text,
      htmlBody: html,
      attachments: attachments
    });
    return reply_({ ok: true });

  } catch (err) {
    console.error(err);
    return fail_("Something went wrong sending your request. Please email us directly.");
  }
}

/* ---------- helpers ---------- */
function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function fail_(message) { return reply_({ ok: false, error: message }); }

// Escape user text so it can't inject HTML into the email.
function esc_(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
// Keep only safe characters in file names.
function safeName_(name) {
  return String(name || "file").replace(/[^A-Za-z0-9._ -]/g, "_").replace(/\.{2,}/g, ".").substring(0, 100);
}
// Simple hourly limit, counted across all visitors.
function allowRequest_() {
  var cache = CacheService.getScriptCache();
  var n = Number(cache.get("hourly") || 0);
  if (n >= MAX_REQUESTS_PER_HOUR) return false;
  cache.put("hourly", String(n + 1), 3600);
  return true;
}
