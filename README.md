# My Job Gator 🐊

A full-stack job portal connecting job seekers with recruiters. Built with Node.js, Express, MongoDB, and vanilla HTML/CSS/Bootstrap — no frontend framework required.

🔗 **Live Demo**: [my-job-gator.vercel.app](https://my-job-gator.vercel.app) *(after deployment)*

---

## Features

### Job Seeker
- Register / Login with role-based auth
- Search and filter jobs by title, keyword, location
- View full job details
- Apply for jobs with one click
- Save / unsave jobs
- Dashboard: view applied jobs (with status), saved jobs
- Profile: personal info, skills, education, experience, resume upload, profile picture

### Recruiter
- Register / Login as recruiter
- Post new jobs with full details (title, category, type, salary, skills, deadline)
- Dashboard: stats (total/active/closed jobs, applications), manage posted jobs, view applicants, update application status, saved jobs
- Profile: company info, logo, website, description

### General
- Role-aware navigation (Post a Job button only for recruiters)
- Profile picture upload (base64, stored in MongoDB)
- Auto-seeded with 30 sample jobs on first run
- Session-based authentication (stored in MongoDB via connect-mongo)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, Bootstrap 5, Vanilla JS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | express-session, bcryptjs, connect-mongo |
| Deployment | Vercel |

---

## Project Structure

```
Job-Portal/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── data/seed.js          # 30 sample jobs (auto-seeded)
│   ├── middleware/auth.js    # requireAuth, requireRole
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── SavedJob.js
│   ├── routes/
│   │   ├── auth.js           # /api/auth/*
│   │   ├── jobs.js           # /api/jobs/*
│   │   ├── users.js          # /api/users/*
│   │   └── applications.js   # /api/applications/*
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── css/
├── images/
├── js/
│   └── auth.js               # API-backed AuthManager
├── index.html
├── job.html
├── job-details.html
├── dashboard.html
├── profile.html
├── post-job.html
├── login.html
├── register.html
├── vercel.json
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/ShivamKawatra/My-Job-Gator.git
cd My-Job-Gator/backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set your MONGO_URI and SESSION_SECRET

# 4. Start the server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

> On first run, 30 sample jobs are auto-seeded into MongoDB.

---

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/jobgator
SESSION_SECRET=your_strong_random_secret
PORT=3000
NODE_ENV=development
```

For production (MongoDB Atlas):
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/jobgator
SESSION_SECRET=your_strong_random_secret
PORT=3000
NODE_ENV=production
```

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
3. Set these environment variables in the Vercel dashboard:
   - `MONGO_URI` → your MongoDB Atlas connection string
   - `SESSION_SECRET` → any long random string
   - `NODE_ENV` → `production`
4. Click **Deploy** — `vercel.json` handles all routing automatically

> Make sure your MongoDB Atlas cluster allows connections from `0.0.0.0/0` (all IPs) since Vercel uses dynamic IPs.

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (seeker or recruiter) |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (supports `?query=&location=&category=`) |
| GET | `/api/jobs/:id` | Job details |
| POST | `/api/jobs` | Post a job (recruiter) |
| PUT | `/api/jobs/:id` | Edit job (recruiter) |
| DELETE | `/api/jobs/:id` | Delete job (recruiter) |
| POST | `/api/jobs/:id/save` | Save job |
| DELETE | `/api/jobs/:id/save` | Unsave job |
| POST | `/api/jobs/:id/apply` | Apply for job |
| GET | `/api/jobs/user/applied` | My applications |
| GET | `/api/jobs/user/saved` | My saved jobs |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile (incl. profileImage) |
| POST | `/api/users/resume` | Upload resume |
| DELETE | `/api/users/resume` | Delete resume |
| PATCH | `/api/users/password` | Change password |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Recruiter's applications |
| PATCH | `/api/applications/:id/status` | Update application status |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Recruiter stats + posted jobs |

---

## Application Status Flow

```
Applied → Under Review → Interview Scheduled → Selected / Rejected
```

---

## Future Enhancements

- Email notifications on application status change
- Forgot password / OTP login
- Google OAuth
- Pagination on job listings
- Resume parser with AI matching
- Admin panel
- Dark mode
