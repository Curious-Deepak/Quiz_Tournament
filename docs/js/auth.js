protectPage();

function protectPage() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.replace("login.html");
        return;
    }

    try {

        const payload = JSON.parse(atob(token.split('.')[1]));

        const currentTime = Date.now() / 1000;

        if (payload.exp < currentTime) {

            localStorage.removeItem("token");

            alert("Session expired. Please login again.");
            window.location.replace("login.html");
        }

    } catch (error) {

        localStorage.removeItem("token");
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

