const {
  TOKEN_TYPES,
  TOKEN_EXPIRATION,
  createAccountToken,
} = require("./accountTokenService");

const { sendEmail } = require("./emailService");
const invitationEmail = require("../templates/emails/invitationEmail");
const model = require("../models/memberAccessModel");
const env = require("../config/env");

/*
 * Creates a fresh invitation link (any older unused link stops working)
 * and emails it. Throws if the email could not be sent.
 */
const deliverInvitation = async ({
  userId,
  firstName,
  email,
  inviterId,
  reminder = false,
}) => {
  const inviterName = inviterId ? await model.getUserName(inviterId) : "";

  const invitation = await createAccountToken(userId, TOKEN_TYPES.INVITATION);

  const setupUrl = `${env.FRONTEND_URL}/set-password?token=${encodeURIComponent(
    invitation.token
  )}`;

  const content = invitationEmail({
    firstName,
    inviterName,
    setupUrl,
    hours: Math.round(TOKEN_EXPIRATION[TOKEN_TYPES.INVITATION] / 60),
    reminder,
  });

  await sendEmail({
    to: email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  await model.markInvited(userId);

  return { expiresAt: invitation.expiresAt };
};

module.exports = {
  deliverInvitation,
};