const bcrypt = require("bcrypt");

const {
  getPasswordHashById,
  updatePassword,
} = require("../models/userPasswordModel");

const { sendEmail } = require("./emailService");
const passwordChangedEmail = require("../templates/emails/passwordChangedEmail");

const SALT_ROUNDS = 10;

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await getPasswordHashById(userId);

  if (!user) {
    const error = new Error("Account not found.");
    error.statusCode = 404;
    throw error;
  }

  const matches = await bcrypt.compare(currentPassword, user.password);

  if (!matches) {
    const error = new Error("Your current password is incorrect.");
    error.statusCode = 400;
    throw error;
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await updatePassword(userId, hashed);

  // Security notice: background only, never blocks the change.
  const content = passwordChangedEmail({ firstName: user.first_name });

  sendEmail({
    to: user.email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  }).catch((error) => {
    console.error("Failed to send password changed email:", error.message);
  });
};

module.exports = {
  changePassword,
};