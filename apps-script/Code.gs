/**
 * TK 3D Printing — form-to-email relay (Google Apps Script)
 *
 * Improved version:
 * - Rolling rate limit (per hour)
 * - Better MIME detection for attachments
 * - Better email validation
 * - UTF‑8 decoding of incoming JSON
 * - Null‑byte stripping in fields
 * - Improved error logging
 * - Request ID + timestamp included in email
 */

var RECIPIENT = "timothyknappwork@gmail.com";
var BUSINESS_NAME = "TK 3D Prints";

// ---- Safety limits ----
var MAX_FILES = 6;
var MAX_FILE_BYTES = 8 * 1024 * 1024;
var MAX_TOTAL_BYTES = 10 * 1024 * 1024;
var ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "stl", "3mf", "obj"];
var MAX_REQUESTS_PER_HOUR = 30;
var MAX_FIELD_LENGTH = 3000;
var TYPES = { quote: "Custom quote request", order: "Order request", contact: "Website message" };

function doGet() {
  return reply_({ ok: true, message: "The form relay is running." });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents)
      return fail_("Empty request.");

    if (e.postData.contents.length > 16 * 1024 * 1024)
      return fail_("That upload is too large.");

    // Decode safely as UTF‑8
    var raw = Utilities.newBlob(e.postData.contents).getDataAsString("UTF-8");
    var data = JSON.parse(raw);

    // Honeypot field
    if (data.website) return reply_({ ok: true });

    if (!TYPES[data.type]) return fail_("Unknown form type.");

    if (!allowRequestRolling_())
      return fail_("Too many requests right now. Please email us directly.");

    // --- fields ---
    var fields = data.fields || {};
    var rows = [];
    var replyTo = "";

    Object.keys(fields).slice(0, 30).forEach(function (label) {
      var value = String(fields[label] == null ? "" : fields[label])
        .replace(/\0/g, "") // remove null bytes
        .trim()
        .substring(0, MAX_FIELD_LENGTH);

      var key = String(label).substring(0, 80);

      if (value) rows.push([key, value]);
      if (key === "Email") replyTo = value;
    });

    if (!isValidEmail_(replyTo))
      return fail_("Please enter a valid email address.");

    if (rows.length === 0)
      return fail_("The form was empty.");

    // --- files ---
    var attachments = [];
    var files = (data.files || []);
    if (files.length > MAX_FILES)
      return fail
