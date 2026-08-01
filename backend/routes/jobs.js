const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/jobs — search & filter
router.get('/', async (req, res) => {
    try {
        const { query, location, category, type, workMode, minSalary, experience } = req.query;
        const filter = { isActive: true };

        if (query) {
            const q = new RegExp(query, 'i');
            filter.$or = [{ title: q }, { company: q }, { skills: q }, { category: q }];
        }
        if (location)  filter.location = new RegExp(location, 'i');
        if (category)  filter.category = category.toLowerCase();
        if (type)      filter.type = new RegExp(type, 'i');
        if (workMode)  filter.workMode = new RegExp(workMode, 'i');
        if (experience) filter.experience = new RegExp(experience, 'i');

        const jobs = await Job.find(filter).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/jobs/user/saved — must be before /:id
router.get('/user/saved', requireAuth, async (req, res) => {
    try {
        const saved = await SavedJob.find({ user: req.session.user.id }).populate('job');
        res.json(saved.map(s => s.job));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/jobs/user/applied
router.get('/user/applied', requireAuth, async (req, res) => {
    try {
        const apps = await Application.find({ applicant: req.session.user.id }).populate('job');
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('recruiter', 'fullName companyName email');
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/jobs — recruiter posts a job
router.post('/', requireAuth, async (req, res) => {
    try {
        const job = await Job.create({ ...req.body, recruiter: req.session.user.id, company: req.body.company || req.session.user.companyName });
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/jobs/:id — recruiter edits job
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, recruiter: req.session.user.id },
            req.body,
            { new: true }
        );
        if (!job) return res.status(404).json({ error: 'Job not found or unauthorized' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/jobs/:id
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, recruiter: req.session.user.id });
        if (!job) return res.status(404).json({ error: 'Job not found or unauthorized' });
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/jobs/:id/save
router.post('/:id/save', requireAuth, async (req, res) => {
    try {
        await SavedJob.create({ user: req.session.user.id, job: req.params.id });
        res.json({ message: 'Job saved' });
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ error: 'Job already saved' });
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/jobs/:id/save
router.delete('/:id/save', requireAuth, async (req, res) => {
    try {
        await SavedJob.findOneAndDelete({ user: req.session.user.id, job: req.params.id });
        res.json({ message: 'Job removed from saved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/jobs/:id/apply
router.post('/:id/apply', requireAuth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        const application = await Application.create({
            applicant: req.session.user.id,
            job: req.params.id,
            recruiter: job.recruiter,
            resume: req.body.resume || '',
            coverLetter: req.body.coverLetter || '',
        });
        res.status(201).json({ message: 'Application submitted', application });
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ error: 'Already applied for this job' });
        res.status(500).json({ error: err.message });
    }
});

// GET /api/jobs/:id/applicants — recruiter views applicants
router.get('/:id/applicants', requireAuth, async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, recruiter: req.session.user.id });
        if (!job) return res.status(403).json({ error: 'Unauthorized' });

        const applicants = await Application.find({ job: req.params.id })
            .populate('applicant', 'fullName email phone skills education experience resume');
        res.json(applicants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
