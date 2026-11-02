// Page Navigation
const navLinks = document.querySelectorAll('nav a');
const pages = {
    home: document.getElementById('home-page'),
    explore: document.getElementById('explore-page'),
    fun: document.getElementById('fun-page'),
    quiz: document.getElementById('quiz-page')
};

function showPage(name) {
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.page === name));
    Object.keys(pages).forEach(k => {
        pages[k].style.display = (k === name ? (k === 'home' ? 'grid' : 'block') : 'none');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        showPage(a.dataset.page);
    });
});

// Modal Handling
const modalBack = document.getElementById('modalBack');
const modalContent = document.getElementById('modalContent');
const openLogin = document.getElementById('open-login');
const closeModal = document.getElementById('closeModal');

openLogin.addEventListener('click', () => openModal('login'));
closeModal.addEventListener('click', () => closeModalFn());
modalBack.addEventListener('click', (e) => { if (e.target === modalBack) closeModalFn(); });

function openModal(mode) {
    modalBack.style.display = 'flex';
    renderModal(mode);
}

function closeModalFn() {
    modalBack.style.display = 'none';
}

function renderModal(mode) {
    if (mode === 'login') {
        modalContent.innerHTML = `
            <h3 id="modalTitle">Login to ASTROGLIDE</h3>
            <div class="field"><label>Username</label><input id="loginUser" placeholder="username"></div>
            <div class="field"><label>Password</label><input id="loginPass" type="password" placeholder="password"></div>
            <div style="display:flex;gap:8px;justify-content:flex-end">
                <button class="btn btn-ghost" onclick="closeModalFn()">Cancel</button>
                <button class="btn btn-primary" onclick="doLogin()">Login</button>
            </div>
            <div style="margin-top:12px;font-size:13px;color:var(--muted)">No account? <a href="#" onclick="renderModal('register');return false">Register</a></div>
        `;
    } else {
        modalContent.innerHTML = `
            <h3 id="modalTitle">Create an account</h3>
            <div class="field"><label>Username</label><input id="regUser" placeholder="choose username"></div>
            <div class="field"><label>Password</label><input id="regPass" type="password" placeholder="choose strong password"></div>
            <div class="field"><label>Confirm</label><input id="regPass2" type="password" placeholder="confirm password"></div>
            <div style="display:flex;gap:8px;justify-content:flex-end">
                <button class="btn btn-ghost" onclick="closeModalFn()">Cancel</button>
                <button class="btn btn-primary" onclick="doRegister()">Register</button>
            </div>
            <div style="margin-top:12px;font-size:13px;color:var(--muted)">Already have one? <a href="#" onclick="renderModal('login');return false">Login</a></div>
        `;
    }
}

// Authentication
function doRegister() {
    const u = document.getElementById('regUser').value.trim();
    const p = document.getElementById('regPass').value;
    const p2 = document.getElementById('regPass2').value;
    if (!u || !p) {
        alert('Provide username & password');
        return;
    }
    if (p !== p2) {
        alert('Passwords do not match');
        return;
    }
    if (p.length < 6) {
        alert('Use at least 6 characters');
        return;
    }
    const map = JSON.parse(localStorage.getItem('ag_users') || '{}');
    if (map[u]) {
        alert('Username already taken');
        return;
    }
    map[u] = { pass: btoa(p), created: Date.now() };
    localStorage.setItem('ag_users', JSON.stringify(map));
    alert('Registered — you can now login');
    renderModal('login');
}

function doLogin() {
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value;
    const map = JSON.parse(localStorage.getItem('ag_users') || '{}');
    if (map[u] && atob(map[u].pass) === p) {
        localStorage.setItem('ag_session', JSON.stringify({ user: u }));
        closeModalFn();
        alert('Logged in as ' + u);
        showLoggedInState(u);
    } else {
        alert('Invalid credentials');
    }
}

function showLoggedInState(user) {
    const header = document.querySelector('header');
    const right = header.querySelector('.cta').parentElement;
    right.innerHTML = '<div style="color:var(--accent-a);font-weight:700">Welcome, ' + escapeHtml(user) + '</div> <button class="cta" id="logoutBtn">Logout</button>';
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('ag_session');
        location.reload();
    });
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

const sess = JSON.parse(localStorage.getItem('ag_session') || 'null');
if (sess && sess.user) showLoggedInState(sess.user);

// Navigation Actions
document.getElementById('guest-option').addEventListener('click', () => {
    showPage('explore');
});

document.getElementById('register-option').addEventListener('click', () => {
    openModal('register');
});

document.getElementById('login-option').addEventListener('click', () => {
    openModal('login');
});

document.getElementById('scrollDown').addEventListener('click', () => showPage('explore'));

// Quiz Functionality
document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function() {
        const isCorrect = this.getAttribute('data-correct') === 'true';
        const feedback = this.parentElement.nextElementSibling;
        
        // Reset all options in this question
        this.parentElement.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('correct', 'incorrect');
        });
        
        // Mark correct/incorrect
        if (isCorrect) {
            this.classList.add('correct');
            feedback.textContent = 'Correct! Well done.';
            feedback.className = 'quiz-feedback correct-feedback';
        } else {
            this.classList.add('incorrect');
            // Find and highlight the correct answer
            this.parentElement.querySelector('.quiz-option[data-correct="true"]').classList.add('correct');
            feedback.textContent = 'Not quite. Try another question!';
            feedback.className = 'quiz-feedback incorrect-feedback';
        }
        
        feedback.style.display = 'block';
    });
});

// Background Elements
const starsLayer = document.getElementById('starsLayer');
const streakLayer = document.getElementById('streakLayer');
const particlesLayer = document.getElementById('particlesLayer');

function makeStars(count = 60) {
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = 1 + Math.random() * 3;
        s.style.left = left + 'vw';
        s.style.top = top + 'vh';
        s.style.width = size + 'px';
        s.style.height = size + 'px';
        s.style.opacity = Math.random() * 0.9 + 0.1;
        s.style.animationDuration = (2 + Math.random() * 3) + 's';
        s.style.animationDelay = Math.random() * 5 + 's';
        starsLayer.appendChild(s);
    }
}

function makeStreaks(count = 12) {
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'streak';
        const left = Math.random() * 100;
        const top = Math.random() * -10;
        const dur = 4 + Math.random() * 6;
        s.style.left = left + 'vw';
        s.style.top = top + 'vh';
        s.style.height = (80 + Math.random() * 220) + 'px';
        s.style.opacity = 0.06 + Math.random() * 0.6;
        s.style.animationDuration = dur + 's';
        s.style.animationDelay = Math.random() * -10 + 's';
        streakLayer.appendChild(s);
    }
}

function makeParticles(count = 15) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = 2 + Math.random() * 4;
        p.style.left = left + 'vw';
        p.style.top = top + 'vh';
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.opacity = 0.1 + Math.random() * 0.3;
        p.style.animationDuration = (15 + Math.random() * 15) + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        particlesLayer.appendChild(p);
    }
}

// Constellation for Quiz page
function createConstellation() {
    const constellation = document.getElementById('constellation');
    const dots = [];
    const lines = [];
    
    // Create constellation dots
    for (let i = 0; i < 15; i++) {
        const dot = document.createElement('div');
        dot.className = 'constellation-dot';
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        dot.style.left = left + '%';
        dot.style.top = top + '%';
        dot.style.animationDelay = Math.random() * 3 + 's';
        constellation.appendChild(dot);
        dots.push({x: left, y: top});
    }
    
    // Create constellation lines between nearby dots
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 20) { // Only connect nearby dots
                const line = document.createElement('div');
                line.className = 'constellation-line';
                const length = distance;
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                
                line.style.width = length + '%';
                line.style.left = dots[i].x + '%';
                line.style.top = dots[i].y + '%';
                line.style.transform = `rotate(${angle}deg)`;
                line.style.animationDelay = Math.random() * 8 + 's';
                
                constellation.appendChild(line);
            }
        }
    }
}

makeStars(90);
makeStreaks(18);
makeParticles(20);
createConstellation();

// Interactive Cards
document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('click', () => {
        c.animate([
            { transform: 'translateY(0)' },
            { transform: 'translateY(-6px)' },
            { transform: 'translateY(0)' }
        ], { duration: 450 });
    });
});

// Keyboard Accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModalFn();
});

// Prevent Form Submission
document.addEventListener('submit', e => e.preventDefault());