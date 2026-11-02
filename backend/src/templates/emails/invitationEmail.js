function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const invitationEmail = ({
  firstName,
  inviterName,
  setupUrl,
  hours,
  reminder = false,
}) => {
  const churchName = process.env.CHURCH_NAME || "our church";
  const name = escapeHtml(firstName || "friend");

  const subject = reminder
    ? `Reminder: finish setting up your ${churchName} account`
    : `You're invited to ${churchName}`;

  const intro = reminder
    ? `We noticed you haven't set up your ${churchName} member account yet. Use the button below to choose your password and sign in.`
    : `${inviterName || "The church office"} created a member account for you at ${churchName}. Use the button below to choose your own password and sign in.`;

  const text = [
    `Hello ${firstName || "friend"},`,
    "",
    intro,
    "",
    setupUrl,
    "",
    `This link works once and expires in ${hours} hours.`,
    "If you weren't expecting this email, you can ignore it. Nothing will change.",
  ].join("\n");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1e293b">
    <h2 style="margin:0 0 12px;color:#0f172a">${
      reminder ? "Finish setting up your account" : "You're invited"
    }</h2>
    <p style="line-height:1.6">Hello ${name},</p>
    <p style="line-height:1.6">${escapeHtml(intro)}</p>
    <p style="margin:28px 0">
      <a href="${escapeHtml(setupUrl)}"
         style="background:#0f172a;color:#ffffff;padding:13px 26px;border-radius:999px;text-decoration:none;font-weight:600;display:inline-block">
        Set my password
      </a>
    </p>
    <p style="color:#64748b;font-size:13px;line-height:1.6">
      This link works once and expires in ${hours} hours.
      If the button doesn't work, copy this address into your browser:<br>
      <span style="word-break:break-all">${escapeHtml(setupUrl)}</span>
    </p>
    <p style="color:#94a3b8;font-size:12px;line-height:1.6;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:24px">
      If you weren't expecting this email, you can ignore it. Nothing will change.
    </p>
  </div>`;

  return { subject, text, html };
};

module.exports = invitationEmail;