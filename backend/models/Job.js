const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title:           { type: String, required: true },
    company:         { type: String, required: true },
    logo:            { type: String, default: 'images/jobicon.png' },
    category:        { type: String, required: true, lowercase: true },
    description:     { type: String, required: true },
    responsibilities:{ type: String, default: '' },
    requirements:    { type: String, default: '' },
    skills:          [String],
    salary:          { type: String, default: '' },
    experience:      { type: String, default: '' },
    type:            { type: String, default: 'Full-time' },   // jobType
    workMode:        { type: String, default: 'On-site' },
    vacancies:       { type: Number, default: 1 },
    location:        { type: String, required: true },
    lastDate:        { type: Date },
    recruiter:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive:        { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
