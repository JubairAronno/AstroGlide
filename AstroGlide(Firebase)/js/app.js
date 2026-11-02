const navLinks = document.querySelectorAll("nav a");

window.showPage = function (name) {
  navLinks.forEach(a => a.classList.toggle("active", a.dataset.page === name));
  document.querySelectorAll("[data-page]").forEach(p => {
    p.style.display =
      p.dataset.page === name ? (name === "home" ? "grid" : "block") : "none";
  });
  window.scrollTo(0, 0);
};

navLinks.forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    if (a.dataset.page === "quiz") {
      checkAuth(user => {
        if (!user) {
          alert("Login required to access quiz");
          showPage("home");
        } else {
          showPage("quiz");
        }
      });
    } else {
      showPage(a.dataset.page);
    }
  });
});

window.showLoggedInState = function (user) {
  const right = document.querySelector(".cta").parentElement;
  right.innerHTML = `
    <span style="color:var(--accent-a);font-weight:700">Welcome, ${user}</span>
    <button class="cta" onclick="doLogout()">Logout</button>
  `;
};
