const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/users/profile
router.put('/profile', requireAuth, async (req, res) => {
    try {
        const allowed = ['fullName', 'phone', 'address', 'city', 'state', 'country',
            'skills', 'education', 'experience', 'about', 'profileImage',
            'companyName', 'website', 'companyDescription', 'location'];

        const updates = {};
        allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

        const user = await User.findByIdAndUpdate(req.session.user.id, updates, { new: true }).select('-password');
        req.session.user = { id: user._id, fullName: user.fullName, email: user.email, role: user.role };
        res.json({ message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/users/resume — store resume filename/path
router.post('/resume', requireAuth, async (req, res) => {
    try {
        const { resume } = req.body;
        if (!resume) return res.status(400).json({ error: 'Resume path required' });
        const user = await User.findByIdAndUpdate(req.session.user.id, { resume }, { new: true }).select('-password');
        res.json({ message: 'Resume updated', resume: user.resume });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/users/resume
router.delete('/resume', requireAuth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.session.user.id, { resume: '' });
        res.json({ message: 'Resume deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/users/password
router.patch('/password', requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword)
            return res.status(400).json({ error: 'Both passwords required' });
        if (newPassword.length < 6)
            return res.status(400).json({ error: 'New password must be at least 6 characters' });

        const user = await User.findById(req.session.user.id);
        if (!(await user.comparePassword(currentPassword)))
            return res.status(401).json({ error: 'Current password is incorrect' });

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
