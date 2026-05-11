const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const { createDefaultAdmin } = require('./controllers/authController');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const supportRoutes = require('./routes/supportRoutes');

dotenv.config();

// Connect Database & Create Admin
connectDB().then(() => {
    createDefaultAdmin(); 
});

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// =========================================================================
// 🌐 CORS CONFIGURATION (Enhanced for POST/PUT/DELETE & Cookies)
// =========================================================================
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://saraswathytraders.com',
    'https://www.saraswathytraders.com',
    'https://eclectic-wisp-215f1c.netlify.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || origin.includes('192.168.')) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS from origin:", origin); 
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // 👈 Cookies (JWT) anuppa ithu compulsory
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // 👈 Ella methods-um allow panrom
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'] // 👈 Headers allow panrom
}));

// Express-ku mukkoyamaana pre-flight request handle panna options
app.options('*', cors()); 

// =========================================================================
// 🚀 API ROUTES
// =========================================================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Fertilizer E-commerce API is running pakka-va on Render!');
});

// =========================================================================
// ⚡ SERVER START
// =========================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});