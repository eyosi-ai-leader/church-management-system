function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const singleLine = (value) =>
  String(value || "").replace(/[\r\n]+/g, " ").trim();

const announcementEmail = ({
  firstName,
  subject,
  message,
  senderName,
  senderRole,
  churchName,
  settingsUrl,
  isTest = false,
}) => {
  const safeSubject = singleLine(subject);
  const greeting = `Hello ${firstName || "friend"},`;
  const signature = `${senderName}${senderRole ? `, ${senderRole}` : ""}`;

  const text = [
    isTest ? "[TEST] This is a preview. Only you received it." : null,
    greeting,
    "",
    message,
    "",
    `- ${signature}`,
    churchName,
    "",
    "-----",
    `You receive this because you are a member of ${churchName}.`,
    `To stop announcement emails, open Settings in your member account: ${settingsUrl}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1e293b">
    ${
      isTest
        ? `<p style="background:#fef3c7;color:#92400e;padding:10px 14px;border-radius:8px;font-size:13px">This is a test preview. Only you received it.</p>`
        : ""
    }
    <h2 style="margin:0 0 16px;color:#0f172a">${escapeHtml(safeSubject)}</h2>
    <p style="line-height:1.6">${escapeHtml(greeting)}</p>
    <div style="white-space:pre-wrap;line-height:1.7">${escapeHtml(message)}</div>
    <p style="margin-top:24px;line-height:1.5">
      ${escapeHtml(signature)}<br>
      <span style="color:#64748b">${escapeHtml(churchName)}</span>
    </p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 16px">
    <p style="color:#94a3b8;font-size:12px;line-height:1.6">
      You receive this because you are a member of ${escapeHtml(churchName)}.
      To stop announcement emails, turn them off in
      <a href="${escapeHtml(settingsUrl)}" style="color:#64748b">Settings</a>.
    </p>
  </div>`;

  return { subject: safeSubject, text, html };
};

module.exports = announcementEmail;