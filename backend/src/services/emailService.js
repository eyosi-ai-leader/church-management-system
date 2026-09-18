
const nodemailer = require("nodemailer");
const env = require("../config/env");

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: Number(env.EMAIL_PORT) === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

/**
 * Verify the SMTP connection.
 *
 * This can be used during development to confirm
 * that the email configuration is working.
 */
const verifyEmailConnection = async () => {
  await transporter.verify();
  return true;
};

/**
 * Send an email.
 */
const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  if (!to) {
    throw new Error("Recipient email is required.");
  }

  const mailOptions = {
    from: env.EMAIL_FROM || env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail,
  verifyEmailConnection,
};

