const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadImage = (file, folder) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error("Image file is required"));
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    publicId: result.public_id,
                    url: result.secure_url,
                    format: result.format,
                    bytes: result.bytes,
                });
            }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};

const deleteImage = async (publicId) => {
    if (!publicId) {
        return;
    }

    await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
    });
};

module.exports = {
    uploadImage,
    deleteImage,
};