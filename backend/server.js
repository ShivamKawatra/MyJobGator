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

// Connect to MongoDB and auto-seed if empty
let dbConnected = false;
async function ensureDB() {
    if (dbConnected) return;
    await connectDB();
    dbConnected = true;
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
}

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET || 'jobgator_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Ensure DB is connected on every request (required for Vercel serverless)
app.use(async (req, res, next) => {
    await ensureDB();
    next();
});

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

// Seed endpoint (dev only)
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

// Local dev
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`JobGator running at http://localhost:${PORT}`));
}

module.exports = app;
