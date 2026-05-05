protectPage();

function protectPage() {

    if (localStorage.getItem("token") === null) {
        window.location.replace("login.html");
    }
}

// Nav Protection 
function handleNavProtection() {

    const applyProtection = () => {

        const protectedLinks = document.querySelectorAll(".protected");

        protectedLinks.forEach(link => {

            link.addEventListener("click", function (e) {

                if (localStorage.getItem("token") === null) {
                    e.preventDefault();
                    window.location.replace("login.html");
                }

            });

        });
    };

    // DOM is ready check
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyProtection);
    } else {
        applyProtection();
    }

}

// Check Login Status
function isLoggedIn() {
    return localStorage.getItem("token") !== null;
}

