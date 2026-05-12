const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};