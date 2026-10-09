// require("dotenv").config();

// const env = {
//   PORT: process.env.PORT || 5000,
//   NODE_ENV: process.env.NODE_ENV || "development",

//   DB_HOST: process.env.DB_HOST,
//   DB_PORT: process.env.DB_PORT,
//   DB_USER: process.env.DB_USER,
//   DB_PASSWORD: process.env.DB_PASSWORD,
//   DB_NAME: process.env.DB_NAME,

//   JWT_SECRET: process.env.JWT_SECRET,
//   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

//   CLOUDINARY_CLOUD_NAME:
//     process.env.CLOUDINARY_CLOUD_NAME,

//   CLOUDINARY_API_KEY:
//     process.env.CLOUDINARY_API_KEY,

//   CLOUDINARY_API_SECRET:
//     process.env.CLOUDINARY_API_SECRET,
// };

// module.exports = env;


require("dotenv").config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Email
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,

   // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL,
};

module.exports = env;

