const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const { createDefaultAdmin } = require('./controllers/authController'); // Itha puthusa add pannirukom!

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const supportRoutes = require('./routes/supportRoutes');

dotenv.config();

// Initialize DB and Create Admin (Ithu thaan mukkiyam!)
connectDB().then(() => {
    createDefaultAdmin(); 
});

const app = express();

app.use(cookieParser());
// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // React frontend ku
    credentials: true
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Fertilizer E-commerce API is running pakka-va!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));