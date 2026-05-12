const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'fertilizer_products',
        allowedFormats: ['jpg', 'png', 'jpeg', 'webp']
    }
});

const upload = multer({ storage: storage });

module.exports = upload;