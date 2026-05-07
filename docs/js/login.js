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

    let result;

    try {
        result = await res.json();
    } catch (e) {
        showLoginError(" Server error ! ");
        return;
    }

    if (res.ok && result.token) {
        localStorage.setItem("token", result.token);
        window.location.replace("index.html");
    } else {
        showLoginError(result.message || " Invalid email or password ");

        document.getElementById("loginEmail").value = "";
        document.getElementById("loginPassword").value = "";

        document.getElementById("loginEmail").style.border = "1px solid red";
        document.getElementById("loginPassword").style.border = "1px solid red";
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

    let result;

    try {
        result = await res.json();
    } catch (e) {
        showLoginError("Server error");
        return;
    }

    if (res.ok) {
        window.location.replace("login.html");
    } else {
        showSignupError(result.message || "Signup failed");

        document.getElementById("signupPassword").value = "";
    }
});


// Switch
function showSignup() {
    document.getElementById("container").classList.add("signup");
    document.getElementById("loginForm").reset();

    document.getElementById("loginError").innerText = "";
}

function showLogin() {
    document.getElementById("container").classList.remove("signup");
    document.getElementById("signupForm").reset();

    document.getElementById("signupError").innerText = "";
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


// Error 
function showLoginError(msg) {
    document.getElementById("loginError").innerText = msg;
}

function showSignupError(msg) {
    document.getElementById("signupError").innerText = msg;
}

