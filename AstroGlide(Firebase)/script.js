// Canvas Animation for Space Background
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Star particles
const stars = [];
const starCount = 200;

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinkleDirection = 1;
    }
    
    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
        
        // Twinkle effect
        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        if (this.opacity >= 1 || this.opacity <= 0.2) {
            this.twinkleDirection *= -1;
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// Initialize stars
for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
}

// Nebula effect
function drawNebula() {
    const gradient = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.8, 0,
        canvas.width * 0.2, canvas.height * 0.8, canvas.width * 0.5
    );
    gradient.addColorStop(0, 'rgba(94, 107, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(94, 107, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.2, 0,
        canvas.width * 0.8, canvas.height * 0.2, canvas.width * 0.4
    );
    gradient2.addColorStop(0, 'rgba(110, 240, 224, 0.04)');
    gradient2.addColorStop(1, 'rgba(110, 240, 224, 0)');
    
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawNebula();
    
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();

// Mobile Navigation
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', () => {
    mobileNav.style.display = mobileNav.style.display === 'flex' ? 'none' : 'flex';
    mobileMenuBtn.innerHTML = mobileNav.style.display === 'flex' ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile nav when clicking a link
mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.style.display = 'none';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Page Navigation
const navLinks = document.querySelectorAll('nav a, .mobile-nav a');
const pages = {
    home: document.getElementById('home-page'),
    explore: document.getElementById('explore-page'),
    fun: document.getElementById('fun-page'),
    quiz: document.getElementById('quiz-page'),
    achievements: document.getElementById('achievements-page')
};

function showPage(name) {
    // Update navigation
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.page === name));
    
    // Hide mobile nav
    mobileNav.style.display = 'none';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Show/hide pages
    Object.keys(pages).forEach(k => {
        pages[k].style.display = (k === name ? (k === 'home' ? 'grid' : 'block') : 'none');
    });
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show score on quiz page
    if (name === 'quiz') {
        document.getElementById('scoreContainer').style.display = 'block';
        updateQuizProgress();
        loadQuiz();
    } else if (name === 'fun') {
        loadFacts();
    } else {
        document.getElementById('scoreContainer').style.display = 'none';
    }
    
    // Track achievements
    if (name === 'explore') {
        unlockAchievement(1);
    }
}

navLinks.forEach(a => {
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
modalBack.addEventListener('click', (e) => { 
    if (e.target === modalBack) closeModalFn(); 
});

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
            <div class="field"><label><i class="fas fa-user"></i> Username</label><input id="loginUser" placeholder="Enter your username"></div>
            <div class="field"><label><i class="fas fa-lock"></i> Password</label><input id="loginPass" type="password" placeholder="Enter your password"></div>
            <div style="display:flex;gap:8px;justify-content:flex-end">
                <button class="btn btn-ghost" onclick="closeModalFn()">Cancel</button>
                <button class="btn btn-primary" onclick="doLogin()">Login</button>
            </div>
            <div style="margin-top:12px;font-size:13px;color:var(--muted);text-align:center">No account? <a href="#" onclick="renderModal('register');return false" style="color:var(--accent-a)">Create one now</a></div>
        `;
    } else {
        modalContent.innerHTML = `
            <h3 id="modalTitle">Join ASTROGLIDE</h3>
            <div class="field"><label><i class="fas fa-user"></i> Username</label><input id="regUser" placeholder="Choose a username"></div>
            <div class="field"><label><i class="fas fa-lock"></i> Password</label><input id="regPass" type="password" placeholder="Create a strong password"></div>
            <div class="field"><label><i class="fas fa-lock"></i> Confirm Password</label><input id="regPass2" type="password" placeholder="Confirm your password"></div>
            <div style="display:flex;gap:8px;justify-content:flex-end">
                <button class="btn btn-ghost" onclick="closeModalFn()">Cancel</button>
                <button class="btn btn-primary" onclick="doRegister()">Register</button>
            </div>
            <div style="margin-top:12px;font-size:13px;color:var(--muted);text-align:center">Already have an account? <a href="#" onclick="renderModal('login');return false" style="color:var(--accent-a)">Login here</a></div>
        `;
    }
    
    // Focus first input
    setTimeout(() => {
        const firstInput = modalContent.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

// Authentication
function doRegister() {
    const u = document.getElementById('regUser').value.trim();
    const p = document.getElementById('regPass').value;
    const p2 = document.getElementById('regPass2').value;
    
    if (!u || !p) {
        showNotification('Please provide a username and password', 'error');
        return;
    }
    if (p !== p2) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    if (p.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    if (u.length < 3) {
        showNotification('Username must be at least 3 characters long', 'error');
        return;
    }
    
    const map = JSON.parse(localStorage.getItem('ag_users') || '{}');
    if (map[u]) {
        showNotification('Username already taken', 'error');
        return;
    }
    
    // Simulate loading
    const btn = document.querySelector('#modalContent .btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="loader"></div>';
    btn.disabled = true;
    
    setTimeout(() => {
        map[u] = { pass: btoa(p), created: Date.now(), achievements: [] };
        localStorage.setItem('ag_users', JSON.stringify(map));
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        showNotification('Account created successfully!', 'success');
        unlockAchievement(5); // Astronaut achievement
        renderModal('login');
    }, 1000);
}

function doLogin() {
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value;
    
    if (!u || !p) {
        showNotification('Please enter username and password', 'error');
        return;
    }
    
    // Simulate loading
    const btn = document.querySelector('#modalContent .btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="loader"></div>';
    btn.disabled = true;
    
    setTimeout(() => {
        const map = JSON.parse(localStorage.getItem('ag_users') || '{}');
        if (map[u] && atob(map[u].pass) === p) {
            localStorage.setItem('ag_session', JSON.stringify({ user: u }));
            btn.innerHTML = originalText;
            btn.disabled = false;
            closeModalFn();
            showLoggedInState(u);
            showNotification(`Welcome back, ${u}!`, 'success');
        } else {
            btn.innerHTML = originalText;
            btn.disabled = false;
            showNotification('Invalid username or password', 'error');
        }
    }, 800);
}

function showLoggedInState(user) {
    const header = document.querySelector('header');
    const right = header.querySelector('.cta').parentElement;
    right.innerHTML = `
        <div style="color:var(--accent-a);font-weight:700;display:flex;align-items:center;gap:8px">
            <i class="fas fa-user-astronaut"></i> Welcome, ${escapeHtml(user)}
        </div> 
        <button class="cta" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>`;
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('ag_session');
        location.reload();
    });
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

// Check for existing session
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

// Space Facts Data - 50+ Facts
const spaceFacts = [
    {icon: "🌪️", title: "Neptune's Super Winds", content: "On Neptune, winds can reach 2,100 km/h — the fastest in the solar system, powered by internal heat rather than solar energy. These supersonic winds create massive storms that can last for decades."},
    {icon: "🔄", title: "Venus Spins Backward", content: "Venus rotates in the opposite direction to most planets, meaning the sun rises in the west and sets in the east. A day on Venus (243 Earth days) is longer than its year (225 Earth days)."},
    {icon: "🌀", title: "Jupiter's Great Red Spot", content: "This massive storm on Jupiter has been raging for at least 400 years and is large enough to swallow Earth whole. It's actually shrinking but still measures about 16,350 km wide."},
    {icon: "💧", title: "Saturn Would Float", content: "Saturn is the only planet in our solar system that is less dense than water — it would float if you could find a bathtub big enough! This is because it's mostly made of hydrogen and helium."},
    {icon: "🌠", title: "Water in Space", content: "There is a massive water vapor cloud in space that contains 140 trillion times all the water in Earth's oceans. Located 12 billion light-years away, it surrounds a supermassive black hole."},
    {icon: "☀️", title: "The Sun's Energy", content: "Every second, the Sun converts about 600 million tons of hydrogen into helium, releasing energy equivalent to billions of nuclear bombs. This process has been ongoing for 4.6 billion years."},
    {icon: "🌙", title: "Moon's Slow Escape", content: "The Moon is slowly moving away from Earth at a rate of about 3.8 cm per year. In about 50 billion years, it will take 47 days to orbit Earth instead of the current 27.3 days."},
    {icon: "💫", title: "A Day on Mercury", content: "A day on Mercury lasts 59 Earth days, but a year is only 88 days! This means a day on Mercury is longer than its year."},
    {icon: "❄️", title: "Coldest Place in Universe", content: "The coldest known place in the universe is the Boomerang Nebula, located 5,000 light-years away. It's -272°C, just 1°C above absolute zero!"},
    {icon: "🔥", title: "Hottest Planet", content: "Venus is the hottest planet in our solar system with surface temperatures reaching 462°C - hot enough to melt lead! This is due to its thick carbon dioxide atmosphere creating a runaway greenhouse effect."},
    {icon: "🌌", title: "Milky Way Stars", content: "The Milky Way contains between 100-400 billion stars. If you counted one star per second, it would take you between 3,170 to 12,680 years to count them all!"},
    {icon: "⚫", title: "Black Hole Spaghetti", content: "The gravitational pull near a black hole is so strong that it would stretch you into a long, thin strand - a process astronomers call 'spaghettification'."},
    {icon: "💎", title: "Diamond Planet", content: "There's a planet called 55 Cancri e that's believed to be made largely of diamond. It's twice the size of Earth and orbits its star every 18 hours."},
    {icon: "⏰", title: "Time Dilation", content: "Time passes slower near massive objects due to gravitational time dilation. Astronauts on the International Space Station age slightly slower than people on Earth!"},
    {icon: "🌍", title: "Earth's Water", content: "If Earth were the size of a basketball, all the water on Earth would fit into a ping pong ball. Yet this tiny amount supports all known life in the universe."},
    {icon: "🚀", title: "Space Speed Record", content: "The fastest human-made object is NASA's Parker Solar Probe, which reached 692,000 km/h (430,000 mph) as it dove close to the Sun."},
    {icon: "🪐", title: "Saturn's Density", content: "Saturn is so light that if you could place it in a giant bathtub, it would float. Its density is only 0.687 g/cm³, less than water's 1 g/cm³."},
    {icon: "🌟", title: "Star Colors", content: "A star's color indicates its temperature: red stars are coolest (3,000°C), yellow like our Sun are medium (5,500°C), and blue stars are hottest (over 25,000°C)."},
    {icon: "☄️", title: "Comet Tails", content: "Comets have two tails: a dust tail that follows the comet's path and a gas tail that always points away from the Sun, pushed by solar wind."},
    {icon: "🌑", title: "Dark Side of Moon", content: "The 'dark side' of the Moon isn't actually dark - it gets just as much sunlight as the near side. It's called 'dark' because it was unknown until spacecraft photographed it."},
    {icon: "🔭", title: "Hubble's Images", content: "The Hubble Space Telescope can see back in time! Its deepest image shows galaxies as they were 13.2 billion years ago, just 500 million years after the Big Bang."},
    {icon: "🛰️", title: "Space Junk", content: "There are over 128 million pieces of debris smaller than 1 cm orbiting Earth, about 900,000 pieces 1-10 cm, and around 34,000 pieces larger than 10 cm."},
    {icon: "🌡️", title: "Temperature Extremes", content: "Mercury has the most extreme temperature range: from -173°C at night to 427°C during the day - a difference of 600°C!"},
    {icon: "💨", title: "Martian Dust Storms", content: "Mars has planet-wide dust storms that can last for months and cover the entire planet. These storms can reach speeds of 100 km/h (60 mph)."},
    {icon: "🪐", title: "Jupiter's Moons", content: "Jupiter has 95 known moons! The four largest (Io, Europa, Ganymede, and Callisto) are called the Galilean moons after Galileo who discovered them in 1610."},
    {icon: "🌊", title: "Tidal Locking", content: "Our Moon is tidally locked to Earth, meaning we only ever see one side. Many other moons in our solar system are also tidally locked to their planets."},
    {icon: "⚡", title: "Lightning on Jupiter", content: "Jupiter has lightning strikes that are 100 times more powerful than those on Earth. They occur in clouds containing ammonia and water."},
    {icon: "🏔️", title: "Olympus Mons", content: "Mars' Olympus Mons is the largest volcano in the solar system. It's 21.9 km (13.6 mi) high and 600 km (370 mi) wide - nearly the size of Arizona!"},
    {icon: "💎", title: "Neptune's Diamonds", content: "Scientists believe it rains diamonds on Neptune and Uranus! The extreme pressure and temperature could turn methane into diamond crystals that fall toward the core."},
    {icon: "🌅", title: "Sunset on Mars", content: "Sunsets on Mars appear blue! The fine dust in Mars' atmosphere scatters blue light more effectively than other colors during sunrise and sunset."},
    {icon: "🔄", title: "Uranus' Tilt", content: "Uranus rotates on its side at a 98-degree angle. Scientists believe a massive collision early in its history knocked it over."},
    {icon: "🌠", title: "Shooting Stars", content: "Shooting stars are actually tiny meteoroids burning up in Earth's atmosphere. Most are no bigger than a grain of sand!"},
    {icon: "🪐", title: "Ring Systems", content: "All four gas giants (Jupiter, Saturn, Uranus, Neptune) have ring systems, though Saturn's are by far the most spectacular and visible."},
    {icon: "🌡️", title: "Absolute Zero", content: "Absolute zero (-273.15°C) is the theoretical lowest possible temperature where all molecular motion stops. It has never been achieved in a laboratory."},
    {icon: "🛸", title: "Voyager's Message", content: "Voyager 1 carries a Golden Record with sounds and images of Earth, including greetings in 55 languages, in case extraterrestrials find it."},
    {icon: "🌌", title: "Andromeda Galaxy", content: "The Andromeda Galaxy is heading toward the Milky Way at 110 km/s. In about 4.5 billion years, the two galaxies will collide and merge."},
    {icon: "🌍", title: "Earth's Rotation", content: "Earth's rotation is gradually slowing due to tidal interactions with the Moon. Days are getting longer by about 1.7 milliseconds per century."},
    {icon: "🪐", title: "Pluto's Heart", content: "Pluto has a large heart-shaped region called Tombaugh Regio. It's made of nitrogen ice and is about 1,600 km (1,000 mi) across."},
    {icon: "☀️", title: "Solar Flares", content: "Solar flares can release energy equivalent to millions of 100-megaton hydrogen bombs exploding at the same time. The largest recorded was in 1859."},
    {icon: "🌠", title: "Meteor Showers", content: "The Perseid meteor shower occurs each August when Earth passes through debris from Comet Swift-Tuttle. At peak, you can see 60-100 meteors per hour!"},
    {icon: "🛰️", title: "GPS Relativity", content: "GPS satellites have to account for Einstein's theory of relativity. Without these corrections, GPS would be off by about 10 km per day!"},
    {icon: "🌑", title: "Moon's Formation", content: "The Moon likely formed when a Mars-sized object collided with early Earth about 4.5 billion years ago. Debris from the impact coalesced to form our Moon."},
    {icon: "💫", title: "Asteroid Belt", content: "The asteroid belt between Mars and Jupiter isn't densely packed as in movies. Spacecraft pass through it safely with vast distances between asteroids."},
    {icon: "🌡️", title: "Space Temperature", content: "Space itself has no temperature - it's a vacuum. Temperature only exists where there's matter to measure it."},
    {icon: "🪐", title: "Saturn's Hexagon", content: "Saturn has a persistent hexagonal-shaped jet stream at its north pole, each side about 13,800 km long. It's been there for at least 40 years."},
    {icon: "🌠", title: "Supernova Remnants", content: "The Crab Nebula is the remnant of a supernova observed by Chinese astronomers in 1054 AD. At its center is a neutron star that spins 30 times per second."},
    {icon: "🌍", title: "Earth's Magnetic Field", content: "Earth's magnetic field protects us from solar radiation. It's generated by molten iron moving in the outer core, 2,900 km below the surface."},
    {icon: "🪐", title: "Mars' Volcanoes", content: "Mars has the tallest volcano (Olympus Mons) and the largest canyon (Valles Marineris) in the solar system. Valles Marineris is as long as the United States!"},
    {icon: "🌌", title: "Dark Matter", content: "About 27% of the universe is dark matter - material that doesn't emit light but exerts gravitational force. We know it exists but haven't directly detected it."},
    {icon: "🛰️", title: "Space Station Speed", content: "The International Space Station travels at 28,000 km/h (17,500 mph), completing an orbit every 90 minutes. Astronauts see 16 sunrises and sunsets each day!"}
];

// Quiz Data - 15+ Questions
const quizQuestions = [
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Jupiter", "Mars", "Neptune", "Venus"],
        correct: 1
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Jupiter", "Saturn", "Earth", "Neptune"],
        correct: 0
    },
    {
        question: "Which planet has the most moons?",
        options: ["Mars", "Saturn", "Uranus", "Earth"],
        correct: 1
    },
    {
        question: "What is the hottest planet in our solar system?",
        options: ["Mercury", "Venus", "Mars", "Jupiter"],
        correct: 1
    },
    {
        question: "Which planet is known for its prominent ring system?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correct: 1
    },
    {
        question: "What is the smallest planet in our solar system?",
        options: ["Mercury", "Mars", "Venus", "Pluto"],
        correct: 0
    },
    {
        question: "Which planet rotates on its side?",
        options: ["Neptune", "Uranus", "Venus", "Mars"],
        correct: 1
    },
    {
        question: "What is the Great Red Spot on Jupiter?",
        options: ["A volcano", "A giant storm", "A massive mountain", "An ocean"],
        correct: 1
    },
    {
        question: "Which planet is closest to the Sun?",
        options: ["Venus", "Mercury", "Earth", "Mars"],
        correct: 1
    },
    {
        question: "What are Saturn's rings made of?",
        options: ["Solid rock", "Liquid methane", "Ice particles and rock", "Pure diamond"],
        correct: 2
    },
    {
        question: "Which planet has the fastest winds in the solar system?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correct: 3
    },
    {
        question: "What is Olympus Mons?",
        options: ["A crater on the Moon", "A valley on Mars", "A volcano on Mars", "An ocean on Europa"],
        correct: 2
    },
    {
        question: "Which planet has a day longer than its year?",
        options: ["Mercury", "Venus", "Mars", "Jupiter"],
        correct: 1
    },
    {
        question: "What is the Kuiper Belt?",
        options: ["A type of asteroid", "A region beyond Neptune with icy bodies", "Saturn's outermost ring", "Jupiter's magnetic field"],
        correct: 1
    },
    {
        question: "Which moon is known to have a subsurface ocean?",
        options: ["Earth's Moon", "Io", "Europa", "Titan"],
        correct: 2
    },
    {
        question: "What causes tides on Earth?",
        options: ["Earth's rotation", "The Sun's gravity", "The Moon's gravity", "Both the Moon and Sun's gravity"],
        correct: 3
    },
    {
        question: "Which planet was discovered mathematically before it was observed?",
        options: ["Uranus", "Neptune", "Pluto", "Mars"],
        correct: 1
    },
    {
        question: "What is a light-year?",
        options: ["A measure of time", "A measure of distance", "A measure of brightness", "A measure of speed"],
        correct: 1
    },
    {
        question: "Which spacecraft has traveled farthest from Earth?",
        options: ["Voyager 1", "Hubble Space Telescope", "International Space Station", "Mars Rover"],
        correct: 0
    },
    {
        question: "What is the Oort Cloud?",
        options: ["A type of nebula", "A cloud surrounding black holes", "A theoretical spherical cloud of icy objects beyond the Kuiper Belt", "Jupiter's atmosphere"],
        correct: 2
    }
];

// Load Facts
let currentFactPage = 0;
const factsPerPage = 20;

function loadFacts(page = 0) {
    const container = document.getElementById('fun-facts-container');
    const navContainer = document.getElementById('facts-navigation');
    
    if (!container) return;
    
    container.innerHTML = '';
    navContainer.innerHTML = '';
    
    const start = page * factsPerPage;
    const end = start + factsPerPage;
    const pageFacts = spaceFacts.slice(start, end);
    
    pageFacts.forEach((fact, index) => {
        const factNumber = start + index + 1;
        const card = document.createElement('div');
        card.className = 'card fact-card';
        card.innerHTML = `
            <div class="fact-number">${factNumber.toString().padStart(2, '0')}</div>
            <div class="fact-icon">${fact.icon}</div>
            <h3>${fact.title}</h3>
            <p>${fact.content}</p>
        `;
        container.appendChild(card);
    });
    
    // Create navigation
    const totalPages = Math.ceil(spaceFacts.length / factsPerPage);
    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `quiz-nav-btn ${i === page ? 'active' : ''}`;
        btn.textContent = i + 1;
        btn.onclick = () => {
            currentFactPage = i;
            loadFacts(i);
            window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
        };
        navContainer.appendChild(btn);
    }
}

function loadMoreFacts() {
    currentFactPage++;
    if (currentFactPage >= Math.ceil(spaceFacts.length / factsPerPage)) {
        currentFactPage = 0;
    }
    loadFacts(currentFactPage);
    window.scrollTo({ top: document.getElementById('fun-facts-container').offsetTop - 100, behavior: 'smooth' });
}

// Load Quiz
let currentQuizPage = 0;
const quizzesPerPage = 5;
let quizScore = 0;
const maxScore = quizQuestions.length;

function loadQuiz(page = 0) {
    const container = document.getElementById('quiz-container');
    const navContainer = document.getElementById('quiz-navigation');
    
    if (!container) return;
    
    container.innerHTML = '';
    navContainer.innerHTML = '';
    
    const start = page * quizzesPerPage;
    const end = start + quizzesPerPage;
    const pageQuizzes = quizQuestions.slice(start, end);
    
    pageQuizzes.forEach((quiz, index) => {
        const quizNumber = start + index + 1;
        const card = document.createElement('div');
        card.className = 'card quiz-card';
        card.id = `quiz-${quizNumber}`;
        card.innerHTML = `
            <div class="quiz-number">${quizNumber}</div>
            <h3 class="quiz-question">${quiz.question}</h3>
            <div class="quiz-options">
                ${quiz.options.map((option, optIndex) => `
                    <div class="quiz-option" data-correct="${optIndex === quiz.correct ? 'true' : 'false'}">${String.fromCharCode(65 + optIndex)}) ${option}</div>
                `).join('')}
            </div>
            <div class="quiz-feedback" style="display:none"></div>
        `;
        container.appendChild(card);
    });
    
    // Add event listeners to new quiz options
    container.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', handleQuizOptionClick);
    });
    
    // Create navigation
    const totalPages = Math.ceil(quizQuestions.length / quizzesPerPage);
    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `quiz-nav-btn ${i === page ? 'active' : ''}`;
        btn.textContent = i + 1;
        btn.onclick = () => {
            currentQuizPage = i;
            loadQuiz(i);
            window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
        };
        navContainer.appendChild(btn);
    }
    
    updateQuizProgress();
}

function handleQuizOptionClick() {
    const isCorrect = this.getAttribute('data-correct') === 'true';
    const feedback = this.parentElement.nextElementSibling;
    const quizCard = this.closest('.quiz-card');
    
    // Reset all options in this question
    this.parentElement.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
    });
    
    // Mark correct/incorrect
    if (isCorrect) {
        this.classList.add('correct');
        feedback.textContent = 'Correct! Well done.';
        feedback.className = 'quiz-feedback correct-feedback';
        
        // Add to score if not already counted
        if (!quizCard.classList.contains('answered')) {
            quizScore++;
            quizCard.classList.add('answered');
            updateScore();
            updateQuizProgress();
            showNotification('Correct answer! +1 point', 'success');
        }
    } else {
        this.classList.add('incorrect');
        // Find and highlight the correct answer
        this.parentElement.querySelector('.quiz-option[data-correct="true"]').classList.add('correct');
        feedback.textContent = 'Not quite. Try another question!';
        feedback.className = 'quiz-feedback incorrect-feedback';
        showNotification('Incorrect answer. Try again!', 'error');
    }
    
    feedback.style.display = 'block';
    
    // Check for quiz master achievement
    if (quizScore === maxScore) {
        unlockAchievement(4);
    }
}

function updateScore() {
    document.getElementById('scoreValue').textContent = quizScore;
}

function updateQuizProgress() {
    const progress = (quizScore / maxScore) * 100;
    document.getElementById('quizProgress').style.width = `${progress}%`;
}

function checkAllAnswers() {
    document.querySelectorAll('.quiz-option[data-correct="true"]').forEach(opt => {
        opt.classList.add('correct');
    });
    
    // Show all feedback
    document.querySelectorAll('.quiz-feedback').forEach(feedback => {
        feedback.style.display = 'block';
        feedback.textContent = 'Answer checked!';
        feedback.className = 'quiz-feedback correct-feedback';
    });
    
    // Update progress
    quizScore = maxScore;
    updateScore();
    updateQuizProgress();
    unlockAchievement(4); // Quiz Master achievement
    
    showNotification('All answers checked! Perfect score!', 'success');
}

function resetQuiz() {
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
    });
    
    document.querySelectorAll('.quiz-feedback').forEach(feedback => {
        feedback.style.display = 'none';
    });
    
    document.querySelectorAll('.quiz-card').forEach(card => {
        card.classList.remove('answered');
    });
    
    quizScore = 0;
    updateScore();
    updateQuizProgress();
    
    showNotification('Quiz has been reset. Try again!', 'info');
}

// Random Fact Generator
function showRandomFact() {
    const randomIndex = Math.floor(Math.random() * spaceFacts.length);
    const fact = spaceFacts[randomIndex];
    
    // Create notification
    showNotification(`✨ Space Fact: ${fact.title} - ${fact.content.substring(0, 100)}...`, 'info');
    
    // Track for achievement
    const factsRead = parseInt(localStorage.getItem('factsRead') || '0') + 1;
    localStorage.setItem('factsRead', factsRead);
    
    if (factsRead >= 10) {
        unlockAchievement(3); // Fact Finder achievement
    }
}

// Achievement System
function unlockAchievement(id) {
    const badge = document.getElementById(`achievement-${id}`);
    if (badge && badge.classList.contains('locked')) {
        badge.classList.remove('locked');
        badge.style.animation = 'pulse 0.5s 3';
        
        // Show achievement unlocked notification
        const achievementNames = {
            1: "First Explorer",
            2: "Space Scholar",
            3: "Fact Finder",
            4: "Quiz Master",
            5: "Astronaut"
        };
        
        showNotification(`🏆 Achievement Unlocked: ${achievementNames[id]}!`, 'success');
        
        // Add visual effect
        badge.style.boxShadow = '0 0 30px rgba(110, 240, 224, 0.5)';
        setTimeout(() => {
            badge.style.boxShadow = '';
        }, 2000);
        
        // Save to user profile if logged in
        const sess = JSON.parse(localStorage.getItem('ag_session') || 'null');
        if (sess && sess.user) {
            const users = JSON.parse(localStorage.getItem('ag_users') || '{}');
            if (users[sess.user]) {
                if (!users[sess.user].achievements) {
                    users[sess.user].achievements = [];
                }
                if (!users[sess.user].achievements.includes(id)) {
                    users[sess.user].achievements.push(id);
                    localStorage.setItem('ag_users', JSON.stringify(users));
                }
            }
        }
        
        // Also save to local storage for guests
        const guestAchievements = JSON.parse(localStorage.getItem('guest_achievements') || '[]');
        if (!guestAchievements.includes(id)) {
            guestAchievements.push(id);
            localStorage.setItem('guest_achievements', JSON.stringify(guestAchievements));
        }
    }
}

// Load achievements on page load
function loadAchievements() {
    const sess = JSON.parse(localStorage.getItem('ag_session') || 'null');
    let achievements = [];
    
    if (sess && sess.user) {
        const users = JSON.parse(localStorage.getItem('ag_users') || '{}');
        if (users[sess.user] && users[sess.user].achievements) {
            achievements = users[sess.user].achievements;
        }
    } else {
        achievements = JSON.parse(localStorage.getItem('guest_achievements') || '[]');
    }
    
    achievements.forEach(id => {
        const badge = document.getElementById(`achievement-${id}`);
        if (badge) {
            badge.classList.remove('locked');
        }
    });
    
    // Check for Space Scholar achievement (5 quizzes completed)
    const quizCount = parseInt(localStorage.getItem('quizAttempts') || '0');
    if (quizCount >= 5) {
        unlockAchievement(2);
    }
    
    // Check for Fact Finder achievement
    const factsRead = parseInt(localStorage.getItem('factsRead') || '0');
    if (factsRead >= 10) {
        unlockAchievement(3);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 15px 20px;
        border-radius: 12px;
        background: ${type === 'success' ? 'rgba(110, 240, 224, 0.15)' : 
                   type === 'error' ? 'rgba(255, 100, 100, 0.15)' : 
                   'rgba(94, 107, 255, 0.15)'};
        border: 1px solid ${type === 'success' ? 'rgba(110, 240, 224, 0.3)' : 
                   type === 'error' ? 'rgba(255, 100, 100, 0.3)' : 
                   'rgba(94, 107, 255, 0.3)'};
        color: white;
        font-weight: 600;
        z-index: 1000;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    notification.innerHTML = `
        <span style="font-size: 18px">${icon}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

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
    if (e.key === 'Escape') {
        closeModalFn();
        mobileNav.style.display = 'none';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
    if (e.key === '?' && e.shiftKey) showRandomFact();
});

// Track quiz attempts
function trackQuizAttempt() {
    const attempts = parseInt(localStorage.getItem('quizAttempts') || '0') + 1;
    localStorage.setItem('quizAttempts', attempts);
    
    if (attempts >= 5) {
        unlockAchievement(2); // Space Scholar achievement
    }
}

// Planet card interactions
document.querySelectorAll('[data-planet]').forEach(card => {
    card.addEventListener('click', function() {
        const planet = this.getAttribute('data-planet');
        const planetNames = {
            mercury: "Mercury",
            venus: "Venus",
            earth: "Earth",
            mars: "Mars",
            jupiter: "Jupiter",
            saturn: "Saturn",
            uranus: "Uranus",
            neptune: "Neptune",
            pluto: "Pluto"
        };
        
        showNotification(`Exploring ${planetNames[planet]}...`, 'info');
    });
});

// Initialize on load
window.addEventListener('load', () => {
    loadAchievements();
    showNotification('Welcome to ASTROGLIDE! Explore the complete solar system with us.', 'info');
    
    // Add click sound effect for buttons
    const buttons = document.querySelectorAll('button, .card, .option-card, .quiz-option');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
                audio.volume = 0.1;
                audio.play().catch(() => {});
            } catch(e) {}
        });
    });
});

// Prevent Form Submission
document.addEventListener('submit', e => e.preventDefault());