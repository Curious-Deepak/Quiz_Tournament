function showSignup() {
    document.getElementById("container").classList.add("signup");
}

function showLogin() {
    document.getElementById("container").classList.remove("signup");
}

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