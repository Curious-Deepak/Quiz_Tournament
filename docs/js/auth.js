protectPage();

function protectPage() {

    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath.includes("login.html");

    const adminPages = [
        "adminDashboard.html",
        "manageUser.html",
        "manageQuiz.html",
        "createQuiz.html",
        "addQuestions.html",
        "checkLeaderboard.html"
    ];

    const userPages = [
        "index.html",
        "profile.html",
        "quiz.html",
        "leaderboard.html",
        "t&c.html",
        "closedQuiz.html",
        "result.html"
    ];

    // Login Page 
    if (isAuthPage) {

        if (token) {

            try {

                const payload = JSON.parse(atob(token.split(".")[1]));

                const role = payload.role;

                if (role === "ADMIN") {
                    window.location.replace("adminDashboard.html");
                    return;

                } else {
                    window.location.replace("index.html");
                    return;
                }

            }
            catch (e) {
                localStorage.clear();
            }
        }
        return;
    }

    // Protected Page 
    if (!token) {
        window.location.replace("login.html");
        return;
    }

    try {

        const payload = JSON.parse(atob(token.split(".")[1]));

        const role = payload.role;

        if (role === "USER") {
            for (let page of adminPages) {
                if (currentPath.includes(page)) {
                    window.location.replace("index.html");
                    return;
                }
            }
        }

        if (role === "ADMIN") {
            for (let page of userPages) {
                if (currentPath.includes(page)) {
                    window.location.replace("login.html");
                    return;
                }
            }
        }

    }
    catch (error) {
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

