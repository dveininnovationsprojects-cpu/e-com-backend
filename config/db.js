const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Options-a thookiyachi, direct-a URI mattum tharom
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected Pakka-va: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ DB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;