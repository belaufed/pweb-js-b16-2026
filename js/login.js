// ================================================
// ORANG 1 — Halaman Login
// Tips teknis: login divalidasi dengan mencocokkan
// username dan password dari hasil fetch /users
// ================================================

const formLogin = document.getElementById("formLogin");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const loginStatus = document.getElementById("loginStatus");

formLogin.addEventListener("submit", function (event) {
    event.preventDefault();
    prosesLogin();
});

async function prosesLogin() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === "" || password === "") {
        loginStatus.textContent = "Username dan password wajib diisi.";
        return;
    }

    // loading state
    loginStatus.textContent = "Sedang memproses...";
    btnLogin.disabled = true;

    try {
        const response = await fetch("https://dummyjson.com/users?limit=0");
        const data = await response.json();
        const daftarUser = data.users;

        // cocokkan username dan password dari hasil fetch /users
        const hasilCocok = daftarUser.filter(function (user) {
            return user.username === username && user.password === password;
        });

        const userDitemukan = hasilCocok.length > 0 ? hasilCocok[0] : null;

        if (userDitemukan) {
            // simpan firstName ke localStorage, lalu auto redirect ke katalog
            localStorage.setItem("firstName", userDitemukan.firstName);
            window.location.href = "index.html";
        } else {
            loginStatus.textContent = "Username atau password salah.";
            btnLogin.disabled = false;
        }

    } catch (error) {
        console.log("Gagal login", error);
        loginStatus.textContent = "Terjadi kesalahan, coba lagi.";
        btnLogin.disabled = false;
    }
}
