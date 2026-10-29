function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const passwordResetEmail = ({ firstName, code, minutes }) => {
  const churchName = process.env.CHURCH_NAME || "our church";
  const name = escapeHtml(firstName || "friend");

  const subject = `Your password reset code: ${code}`;

  const text = [
    `Hello ${firstName || "friend"},`,
    "",
    `We received a request to reset your ${churchName} password.`,
    "Your reset code is:",
    "",
    code,
    "",
    `This code expires in ${minutes} minutes.`,
    "If you did not request this, you can ignore this email. Your password will not change.",
  ].join("\n");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1e293b">
    <h2 style="margin:0 0 12px;color:#0f172a">Reset your password</h2>
    <p style="line-height:1.6">Hello ${name}, we received a request to reset your <strong>${escapeHtml(churchName)}</strong> password. Enter this code to continue:</p>
    <p style="margin:24px 0;text-align:center">
      <span style="display:inline-block;font-size:32px;font-weight:700;letter-spacing:10px;background:#f1f5f9;padding:14px 22px;border-radius:12px;color:#0f172a">${code}</span>
    </p>
    <p style="color:#64748b;font-size:14px;line-height:1.6">
      This code expires in ${minutes} minutes. If you did not request this, you can ignore this email and your password will stay the same.
    </p>
  </div>`;

  return { subject, text, html };
};

module.exports = passwordResetEmail;