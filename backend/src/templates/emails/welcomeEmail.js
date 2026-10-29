function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const welcomeEmail = ({ firstName, loginUrl }) => {
  const churchName = process.env.CHURCH_NAME || "our church";
  const name = escapeHtml(firstName || "friend");

  const subject = `Welcome to ${churchName}`;

  const text = [
    `Hello ${firstName || "friend"},`,
    "",
    `Welcome to ${churchName}! We're glad you joined our church family.`,
    "",
    "You can sign in to your member account here:",
    loginUrl,
    "",
    "\"Casting all your care upon him; for he careth for you.\" (1 Peter 5:7, KJV)",
    "",
    `Blessings,`,
    churchName,
  ].join("\n");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1e293b">
    <h2 style="margin:0 0 12px;color:#0f172a">Welcome, ${name}!</h2>
    <p style="line-height:1.6">
      We're glad you joined <strong>${escapeHtml(churchName)}</strong>. Your member account is ready.
    </p>
    <p style="margin:24px 0">
      <a href="${loginUrl}"
         style="background:#0f172a;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">
        Sign in to your account
      </a>
    </p>
    <p style="font-style:italic;line-height:1.6;border-top:1px solid #e2e8f0;padding-top:16px;color:#334155">
      “Casting all your care upon him; for he careth for you.”<br>
      <span style="font-style:normal;color:#64748b">1 Peter 5:7 (KJV)</span>
    </p>
    <p style="color:#64748b;font-size:13px">Blessings,<br>${escapeHtml(churchName)}</p>
  </div>`;

  return { subject, text, html };
};

module.exports = welcomeEmail;