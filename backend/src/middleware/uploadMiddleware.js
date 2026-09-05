const multer = require("multer");

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return callback(
      new Error(
        "Only JPG, PNG, and WEBP images are allowed."
      )
    );
  }

  callback(null, true);
};

const uploadProfileImage = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

module.exports = {
  uploadProfileImage,
};