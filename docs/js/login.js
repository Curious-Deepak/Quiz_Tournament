// LOGIN
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value,
        rememberMe: document.querySelector("input[name='remember']").checked
    };

    const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.token) {
        localStorage.setItem("token", result.token);
        window.location.href = "index.html";
    } else {
        alert(result.message);
    }
});


// SIGNUP
document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("signupEmail").value,
        password: document.getElementById("signupPassword").value
    };

    const res = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.text();
    alert(result);
});


// Switch
function showSignup() {
    document.getElementById("container").classList.add("signup");
}

function showLogin() {
    document.getElementById("container").classList.remove("signup");
}

window.showSignup = showSignup;
window.showLogin = showLogin;

// Eye open-close 
document.addEventListener("DOMContentLoaded", () => {

    const toggles = document.querySelectorAll(".togglePassword");

    toggles.forEach(icon => {

        icon.addEventListener("click", () => {

            const inputId = icon.getAttribute("data-target");
            const passwordInput = document.getElementById(inputId);

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.classList.remove("bi-eye-slash");
                icon.classList.add("bi-eye");
            } else {
                passwordInput.type = "password";
                icon.classList.remove("bi-eye");
                icon.classList.add("bi-eye-slash");
            }

        });

    });

});

