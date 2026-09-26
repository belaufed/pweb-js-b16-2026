// ================================================
// ORANG 1 — Auth Guard & Navbar
// Kontrak tim: key localStorage = firstName
// ================================================

const firstName = localStorage.getItem("firstName");

// auth guard: redirect ke login.html jika belum login
if (!firstName) {
    window.location.href = "login.html";
}

const navbarGreeting = document.getElementById("navbar-greeting");
const btnLogout = document.getElementById("btnLogout");

if (navbarGreeting) {
    navbarGreeting.textContent = "Halo, " + firstName;
}

if (btnLogout) {
    btnLogout.addEventListener("click", function () {
        localStorage.removeItem("firstName");
        window.location.href = "login.html";
    });
}
