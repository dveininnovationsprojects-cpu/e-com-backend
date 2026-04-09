const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Ithu namma puthusa create panna config file

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'fertilizer_products', // Cloudinary-la intha folder kulla images save aagum
        allowedFormats: ['jpg', 'png', 'jpeg', 'webp']
    }
});

const upload = multer({ storage: storage });

module.exports = upload;