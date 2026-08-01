# Job Portal (MERN without React)

## Project Overview

The Job Portal is a full-stack web application that connects job seekers with recruiters. Job seekers can create profiles, upload resumes, search and apply for jobs, while recruiters can post jobs, manage listings, and review applications.

This project is built using Node.js, Express.js, MongoDB, EJS, Bootstrap, and JavaScript following the MVC architecture.

---

# Tech Stack

## Frontend

* HTML5
* CSS3
* Bootstrap 5
* JavaScript
* EJS

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication

* Passport.js (Local Strategy) or JWT
* Express Session
* bcrypt

## File Upload

* Multer
* Cloudinary (Optional)

## Other Packages

* dotenv
* connect-flash
* method-override
* express-validator
* cookie-parser
* express-session
* passport
* passport-local
* mongoose

---

# User Roles

## 1. Job Seeker

A job seeker can:

* Register
* Login
* Logout
* Edit Profile
* Upload Resume
* Search Jobs
* Filter Jobs
* View Job Details
* Apply for Jobs
* Save Jobs
* View Applied Jobs
* Update Profile
* Change Password

---

## 2. Recruiter

A recruiter can:

* Register
* Login
* Create Company Profile
* Post Jobs
* Edit Jobs
* Delete Jobs
* View Applicants
* Accept or Reject Applications
* Manage Posted Jobs

---

# Authentication Module

Features:

* Signup
* Login
* Logout
* Password Hashing
* Session Authentication
* Protected Routes
* Authorization Middleware

---

# User Profile

Fields:

* Name
* Email
* Phone
* Address
* City
* State
* Country
* Skills
* Education
* Experience
* About
* Profile Picture
* Resume

User should be able to:

* Edit Profile
* Upload Resume
* Replace Resume
* Delete Resume

---

# Recruiter Profile

Fields:

* Company Name
* HR Name
* Email
* Phone
* Website
* Company Description
* Company Logo
* Location

---

# Job Module

Each Job should contain:

* Job Title
* Company Name
* Company Logo
* Category
* Description
* Responsibilities
* Requirements
* Skills Required
* Salary
* Experience Required
* Job Type
* Work Mode
* Vacancy
* Location
* Last Date
* Posted Date
* Recruiter ID

---

# Home Page

Sections:

* Hero Banner
* Search Bar
* Featured Jobs
* Latest Jobs
* Categories
* Companies
* Statistics
* Footer

---

# Search Functionality

Search by:

* Job Title
* Company
* Skills
* Location

---

# Filters

* Salary
* Experience
* Job Type
* Work Mode
* Category
* Location

---

# Job Details Page

Display:

* Company Logo
* Company Name
* Job Description
* Responsibilities
* Required Skills
* Salary
* Experience
* Location
* Job Type
* Apply Button

---

# Apply Job

When a user applies:

Store

* User ID
* Job ID
* Resume
* Apply Date
* Status

Possible Status

* Applied
* Under Review
* Interview Scheduled
* Selected
* Rejected

---

# Saved Jobs

Users can:

* Save Job
* Remove Saved Job
* View Saved Jobs

---

# Recruiter Dashboard

Dashboard should display

* Total Jobs Posted
* Active Jobs
* Closed Jobs
* Total Applications
* Recent Applicants

---

# Job Management

Recruiter can

* Add Job
* Edit Job
* Delete Job
* Close Job
* Reopen Job

---

# Application Management

Recruiter can

View

* Applicant Name
* Resume
* Skills
* Education
* Experience
* Applied Date

Actions

* Accept
* Reject
* Mark Under Review

---

# Admin (Optional)

Admin can

* Manage Users
* Manage Recruiters
* Delete Fake Jobs
* Delete Spam Accounts
* View Statistics

---

# Validation

Frontend Validation

Backend Validation

Examples

* Required Fields
* Email Validation
* Password Length
* Phone Number Validation

---

# Error Pages

* 404
* 403
* 500

---

# Flash Messages

Examples

* Login Successful
* Profile Updated
* Job Posted
* Job Deleted
* Application Submitted
* Invalid Credentials

---

# Database Collections

## Users

* name
* email
* password
* phone
* role
* profileImage
* resume
* skills
* education
* experience
* about

---

## Recruiters

* companyName
* email
* logo
* website
* phone
* description
* location

---

## Jobs

* title
* description
* salary
* experience
* category
* skills
* recruiter
* location
* workMode
* jobType
* vacancies
* lastDate

---

## Applications

* applicant
* job
* recruiter
* status
* resume
* appliedDate

---

## Saved Jobs

* user
* job

---

# Routes

## Authentication

* GET /signup
* POST /signup
* GET /login
* POST /login
* GET /logout

---

## User

* GET /profile
* PUT /profile
* POST /resume
* DELETE /resume

---

## Jobs

* GET /jobs
* GET /jobs/:id
* GET /jobs/new
* POST /jobs
* GET /jobs/:id/edit
* PUT /jobs/:id
* DELETE /jobs/:id

---

## Applications

* POST /jobs/:id/apply
* GET /applications
* PATCH /applications/:id/status

---

## Saved Jobs

* POST /save/:jobId
* DELETE /save/:jobId

---

# Folder Structure

```
Job-Portal/

│
├── models/
├── routes/
├── controllers/
├── middleware/
├── config/
├── utils/
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│
├── views/
│   ├── layouts/
│   ├── partials/
│   ├── auth/
│   ├── jobs/
│   ├── users/
│   ├── recruiter/
│
├── uploads/
├── app.js
├── package.json
├── .env
└── README.md
```

---

# Future Enhancements

* Email Verification
* Forgot Password
* OTP Login
* Google Authentication
* Company Reviews
* Notifications
* Real-time Chat
* Interview Scheduling
* Job Recommendation System
* AI Resume Matching
* Admin Analytics Dashboard
* Pagination
* Infinite Scroll
* Dark Mode
* REST API Documentation
* Docker Deployment
* CI/CD Pipeline
* Unit Testing
* Deployment on Render/Railway

---