const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api.ping()
    .then((result) => {
        console.log("Cloudinary connection:", result);
    })
    .catch((error) => {
        console.error("Cloudinary connection error:", error);
    });

module.exports = cloudinary;