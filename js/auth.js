// Auth Manager — API-backed
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.updateNavigation();
    }

    async register(userData) {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        this.currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        this.updateNavigation();
        return data.user;
    }

    async login(email, password) {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        this.currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        this.updateNavigation();
        return data.user;
    }

    async logout() {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateNavigation();
        window.location.href = 'index.html';
    }

    isLoggedIn() { return this.currentUser !== null; }
    getCurrentUser() { return this.currentUser; }
    getSavedJobs()  { return this.currentUser?.savedJobs  || []; }
    getAppliedJobs(){ return this.currentUser?.appliedJobs || []; }

    async saveJob(jobId) {
        if (!this.isLoggedIn()) throw new Error('Please login to save jobs');
        const res = await fetch(`/api/jobs/${jobId}/save`, { method: 'POST', credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not save job');
    }

    async applyForJob(jobId, applicationData) {
        if (!this.isLoggedIn()) throw new Error('Please login to apply for jobs');
        const res = await fetch(`/api/jobs/${jobId}/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(applicationData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not submit application');
        return data;
    }

    updateNavigation() {
        setTimeout(() => {
            const isLoggedIn  = this.isLoggedIn();
            const user        = this.currentUser;
            const isRecruiter = user?.role === 'recruiter';

            // Login / Sign Up links → swap to name + logout when logged in
            document.querySelectorAll('a[href="login.html"]').forEach(link => {
                if (isLoggedIn) {
                    link.textContent = user.fullName.split(' ')[0];
                    link.href = 'dashboard.html';
                    link.style.color = '#28a745';
                } else {
                    link.textContent = 'Login';
                    link.href = 'login.html';
                    link.style.color = '#F03737';
                    link.onclick = null;
                }
            });

            document.querySelectorAll('a[href="register.html"]').forEach(link => {
                if (isLoggedIn) {
                    link.textContent = 'Logout';
                    link.href = '#';
                    link.style.color = '#dc3545';
                    link.onclick = (e) => { e.preventDefault(); this.logout(); };
                } else {
                    link.textContent = 'Sign Up';
                    link.href = 'register.html';
                    link.style.color = '#F03737';
                    link.onclick = null;
                }
            });

            // Post a Job button — only for recruiters
            document.querySelectorAll('#postJobBtn, a[href="post-job.html"].btn').forEach(btn => {
                if (isLoggedIn && isRecruiter) {
                    btn.classList.remove('d-none');
                } else {
                    btn.classList.add('d-none');
                }
            });
        }, 100);
    }
}

const authManager = new AuthManager();
window.authManager = authManager;

function showNotification(message, type = 'info') {
    const classes = { success: 'alert-success', error: 'alert-danger', warning: 'alert-warning', info: 'alert-info' };
    const div = document.createElement('div');
    div.className = `alert ${classes[type]} alert-dismissible fade show position-fixed`;
    div.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    div.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(div);
    setTimeout(() => div.parentNode && div.remove(), 5000);
}
