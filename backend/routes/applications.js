const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { requireAuth } = require('../middleware/auth');

// GET /api/applications — recruiter sees all applications for their jobs
router.get('/', requireAuth, async (req, res) => {
    try {
        const apps = await Application.find({ recruiter: req.session.user.id })
            .populate('applicant', 'fullName email phone skills education experience resume about')
            .populate('job', 'title company');
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/applications/:id/status — recruiter updates status
router.patch('/:id/status', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Applied', 'Under Review', 'Interview Scheduled', 'Selected', 'Rejected'];
        if (!validStatuses.includes(status))
            return res.status(400).json({ error: 'Invalid status' });

        const app = await Application.findOneAndUpdate(
            { _id: req.params.id, recruiter: req.session.user.id },
            { status },
            { new: true }
        );
        if (!app) return res.status(404).json({ error: 'Application not found or unauthorized' });
        res.json({ message: 'Status updated', application: app });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
