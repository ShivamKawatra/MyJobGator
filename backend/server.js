require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes        = require('./routes/auth');
const jobRoutes         = require('./routes/jobs');
const userRoutes        = require('./routes/users');
const applicationRoutes = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB and auto-seed if empty
connectDB().then(async () => {
    try {
        const Job = require('./models/Job');
        const count = await Job.countDocuments();
        if (count === 0) {
            const { jobDatabase } = require('./data/seed');
            await Job.insertMany(jobDatabase);
            console.log(`Auto-seeded ${jobDatabase.length} sample jobs`);
        }
    } catch (e) {
        console.error('Seed error:', e.message);
    }
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'jobgator_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/auth',         authRoutes);
app.use('/api/jobs',         jobRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/applications', applicationRoutes);

// Recruiter dashboard stats
app.get('/api/dashboard', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
    try {
        const Job         = require('./models/Job');
        const Application = require('./models/Application');
        const recruiterId = req.session.user.id;

        const [totalJobs, activeJobs, closedJobs, totalApplications] = await Promise.all([
            Job.countDocuments({ recruiter: recruiterId }),
            Job.countDocuments({ recruiter: recruiterId, isActive: true }),
            Job.countDocuments({ recruiter: recruiterId, isActive: false }),
            Application.countDocuments({ recruiter: recruiterId }),
        ]);

        const myJobs = await Job.find({ recruiter: recruiterId }).sort({ createdAt: -1 });

        res.json({ totalJobs, activeJobs, closedJobs, totalApplications, myJobs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seed sample jobs (GET /api/seed — dev only)
app.get('/api/seed', async (req, res) => {
    try {
        const Job = require('./models/Job');
        const count = await Job.countDocuments();
        if (count > 0) return res.json({ message: `DB already has ${count} jobs, skipping seed.` });

        const { jobDatabase } = require('./data/seed');
        await Job.insertMany(jobDatabase);
        res.json({ message: `Seeded ${jobDatabase.length} jobs` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fallback: serve index.html for non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`JobGator server running at http://localhost:${PORT}`);
});
