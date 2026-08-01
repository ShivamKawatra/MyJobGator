const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName:     { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    password:     { type: String, required: true },
    phone:        { type: String, default: '' },
    role:         { type: String, enum: ['seeker', 'recruiter'], default: 'seeker' },
    profileImage: { type: String, default: '', maxlength: 2097152 }, // ~2MB base64
    resume:       { type: String, default: '' },
    skills:       [String],
    education:    [{ degree: String, institution: String, year: String }],
    experience:   [{ title: String, company: String, years: String }],
    about:        { type: String, default: '' },
    address:      { type: String, default: '' },
    city:         { type: String, default: '' },
    state:        { type: String, default: '' },
    country:      { type: String, default: '' },
    // Recruiter fields
    companyName:  { type: String, default: '' },
    website:      { type: String, default: '' },
    companyDescription: { type: String, default: '' },
    companyLogo:  { type: String, default: '' },
    location:     { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
