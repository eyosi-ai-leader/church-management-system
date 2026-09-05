const cloudinary = require("../config/cloudinary");

const uploadImage = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      folder = "chms/member-profiles",
      publicId,
    } = options;

    const uploadOptions = {
      folder,
      resource_type: "image",
      overwrite: false,
      invalidate: true,
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const uploadStream =
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
            resourceType: result.resource_type,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        }
      );

    uploadStream.end(fileBuffer);
  });
};

const deleteImage = async (publicId) => {
  if (!publicId) {
    return null;
  }

  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "image",
      invalidate: true,
    }
  );
};

module.exports = {
  uploadImage,
  deleteImage,
};