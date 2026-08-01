const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        if (!fullName || !email || !password)
            return res.status(400).json({ error: 'All fields are required' });
        if (password.length < 6)
            return res.status(400).json({ error: 'Password must be at least 6 characters' });

        const exists = await User.findOne({ email });
        if (exists) return res.status(409).json({ error: 'Email already registered' });

        const user = await User.create({ fullName, email, password, role: role || 'seeker', companyName: req.body.companyName || '' });
        const { password: _, ...userData } = user.toObject();

        req.session.user = { id: user._id, fullName: user.fullName, email: user.email, role: user.role };
        res.status(201).json({ message: 'Registration successful', user: userData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'All fields are required' });

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ error: 'Invalid email or password' });

        const { password: _, ...userData } = user.toObject();
        req.session.user = { id: user._id, fullName: user.fullName, email: user.email, role: user.role };
        res.json({ message: 'Login successful', user: userData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
    try {
        const user = await User.findById(req.session.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
