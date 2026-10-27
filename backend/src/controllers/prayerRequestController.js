const prayerRequestService = require("../services/prayerRequestService");
const emailService = require("../services/emailService");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d\s()-]{5,30}$/;

function cleanLine(value) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim()
    : "";
}

function cleanMessage(value) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim()
    : "";
}

exports.createPrayerRequest = async (req, res) => {
  const body = req.body || {};

   // Spam trap: real visitors never see or fill this field.
  if (typeof body.contact_extra === "string" && body.contact_extra.trim() !== "") {
    console.warn("Prayer request blocked by spam trap.");
    return res.status(201).json({
      success: true,
      message: "Your prayer request has been received.",
    });
  }

  const name = cleanLine(body.name);
  const email = cleanLine(body.email).toLowerCase();
  const phone = cleanLine(body.phone);
  const message = cleanMessage(body.message);

  const errors = {};
  if (name.length < 2 || name.length > 100) {
    errors.name = "Enter your name (2 to 100 characters).";
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 150) {
    errors.email = "Enter a valid email address.";
  }
  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid phone number or leave it empty.";
  }
  if (message.length < 10 || message.length > 2000) {
    errors.message = "Write your request in 10 to 2000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Please correct the highlighted fields.",
      errors,
    });
  }

  let id;
  try {
    id = await prayerRequestService.createPrayerRequest({
      name,
      email,
      phone,
      message,
    });
  } catch (error) {
    console.error("Prayer request save failed:", error.code || error.message);
    return res.status(500).json({
      success: false,
      message: "We couldn't save your request. Please try again shortly.",
    });
  }

  // The request is saved. Answer the visitor now; the email is sent in the background.
  res.status(201).json({
    success: true,
    message: "Your prayer request has been received.",
  });

  emailService
    .sendPrayerRequestNotification({ id, name, email, phone, message })
    .then(() => prayerRequestService.markNotification(id, true))
    .catch(async (error) => {
      console.error(`Prayer request #${id} email failed:`, error.message);
      try {
        await prayerRequestService.markNotification(id, false);
      } catch (updateError) {
        console.error(
          `Prayer request #${id} status update failed:`,
          updateError.code
        );
      }
    });
};