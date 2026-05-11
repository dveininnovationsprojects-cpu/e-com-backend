const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Reusable function to set HttpOnly Cookie
// Reusable function to set HttpOnly Cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,    // Prevent XSS attacks
        secure: true,      // 👈 MUKKOYOM: Live-la (HTTPS) work aaga 'true' kandippa irukanum
        sameSite: 'none'   // 👈 MUKKOYOM: Netlify (Domain A) to Render (Domain B) connect panna 'none' thaan venum
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });
        
        // Puthu Cookie Logic
        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Puthu Cookie Logic
            sendTokenResponse(user, 200, res);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout Function - Clears the cookie
exports.logoutUser = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
        httpOnly: true
    });
    res.status(200).json({ success: true, message: 'User logged out successfully' });
};
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (user) {
            // Basic details
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.username = req.body.username || user.username;
            user.gender = req.body.gender || user.gender;
            
            // 🟢 PUDHU ADDRESS FIELDS SAVE LOGIC
            // undefined aah illana (yani form-la irundhu data vandha) update pannu
            if(req.body.buildingNo !== undefined) user.buildingNo = req.body.buildingNo;
            if(req.body.street !== undefined) user.street = req.body.street;
            if(req.body.city !== undefined) user.city = req.body.city;
            if(req.body.district !== undefined) user.district = req.body.district;
            if(req.body.state !== undefined) user.state = req.body.state;
            if(req.body.country !== undefined) user.country = req.body.country;
            if(req.body.pinCode !== undefined) user.pinCode = req.body.pinCode;

            // Email and password logic (apdiye irukatum)
            if (req.body.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
                user.email = req.body.email;
            }

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();
            
            // Send back the full updated user object
            res.json(updatedUser); 
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Password thavira mathatha anuppum
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to Auto-Create Default Admin
exports.createDefaultAdmin = async () => {
    try {
        const adminEmail = 'admin@gmail.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin@123', salt);

            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin' // Role pakka-va admin nu set agidum
            });
            console.log('✅ Default Admin account automatically created!');
        } else {
            console.log('⚡ Admin account already exists.');
        }
    } catch (error) {
        console.error('❌ Error creating default admin:', error.message);
    }
};