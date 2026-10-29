function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const verificationCodeEmail = ({ firstName, code, minutes }) => {
  const churchName = process.env.CHURCH_NAME || "our church";
  const name = escapeHtml(firstName || "friend");

  const subject = `Your verification code: ${code}`;

  const text = [
    `Hello ${firstName || "friend"},`,
    "",
    `Your verification code for ${churchName} is:`,
    "",
    code,
    "",
    `This code expires in ${minutes} minutes.`,
    "If you did not create this account, you can ignore this email.",
  ].join("\n");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1e293b">
    <h2 style="margin:0 0 12px;color:#0f172a">Verify your email</h2>
    <p style="line-height:1.6">Hello ${name}, enter this code to confirm your email for <strong>${escapeHtml(churchName)}</strong>:</p>
    <p style="margin:24px 0;text-align:center">
      <span style="display:inline-block;font-size:32px;font-weight:700;letter-spacing:10px;background:#f1f5f9;padding:14px 22px;border-radius:12px;color:#0f172a">${code}</span>
    </p>
    <p style="color:#64748b;font-size:14px;line-height:1.6">
      This code expires in ${minutes} minutes. If you did not create this account, you can ignore this email.
    </p>
  </div>`;

  return { subject, text, html };
};

module.exports = verificationCodeEmail;