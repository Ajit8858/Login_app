const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/User');
require('dotenv').config();
const authenticateToken = require('../authMiddleware');

// 📦 Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('📨 Register request received:', { name, email });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('⚠️ User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password });
        await user.save();
        console.log('✅ New user registered:', email);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('❌ Error registering user:', err.message);
        res.status(500).json({ message: 'Error registering user', error: err });
    }
});

// 🔐 Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('📨 Login request received:', email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('⚠️ No user found with email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('⚠️ Incorrect password for user:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('✅ Login successful:', email);

        res.json({ token });
    } catch (err) {
        console.error('❌ Login failed:', err.message);
        res.status(500).json({ message: 'Login failed', error: err });
    }
});

module.exports = router;
