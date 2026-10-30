const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASSWORD) return null;

  const port = Number(EMAIL_PORT) || 465;

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port,
    secure: port === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },

    // Reuse one connection instead of logging in for every email.
    pool: true,
    maxConnections: 1,
    maxMessages: 100,

    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
  });

  return transporter;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Generic email sender used by registration, verification,
 * welcome, password-reset and announcement emails.
 */
async function sendEmail({ to, subject, text, html, replyTo }) {
  const mailer = getTransporter();

  if (!mailer) {
    throw new Error("Email is not configured.");
  }

  if (!to || !subject) {
    throw new Error("Email recipient and subject are required.");
  }

  return mailer.sendMail({
    from: {
      name: process.env.EMAIL_FROM_NAME || "Church Website",
      address: process.env.EMAIL_USER,
    },
    to,
    subject,
    text,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
}

async function sendPrayerRequestNotification(request) {
  const to = process.env.PRAYER_REQUEST_RECIPIENT;

  if (!to) {
    throw new Error("Email is not configured.");
  }

  const text = [
    "A new prayer request was submitted on the church website.",
    "",
    `Name: ${request.name}`,
    `Email: ${request.email}`,
    `Phone: ${request.phone || "Not provided"}`,
    "",
    "Request:",
    request.message,
    "",
    `Reference: #${request.id}`,
  ].join("\n");

  const html = `
    <p>A new prayer request was submitted on the church website.</p>
    <p>
      <strong>Name:</strong> ${escapeHtml(request.name)}<br>
      <strong>Email:</strong> ${escapeHtml(request.email)}<br>
      <strong>Phone:</strong> ${escapeHtml(request.phone || "Not provided")}
    </p>
    <p><strong>Request:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(request.message)}</p>
    <p style="color:#666">Reference: #${request.id}</p>
  `;

  await sendEmail({
    to,
    subject: `New prayer request #${request.id}`,
    text,
    html,
    replyTo: { name: request.name, address: request.email },
  });
}

module.exports = { sendEmail, sendPrayerRequestNotification };