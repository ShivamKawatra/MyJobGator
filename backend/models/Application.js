const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    applicant:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job:         { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    recruiter:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resume:      { type: String, default: '' },
    coverLetter: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Applied', 'Under Review', 'Interview Scheduled', 'Selected', 'Rejected'],
        default: 'Applied'
    },
    appliedDate: { type: Date, default: Date.now },
}, { timestamps: true });

// One application per user per job
applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
