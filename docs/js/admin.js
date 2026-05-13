window.onload = function () {

    protectPage();
    loadDashboardStats();
    loadActiveQuizzes();
    adminLogout();
    handleNavProtection()

};


// Dashboard Cards
async function loadDashboardStats() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch('http://localhost:8080/admin/dashboard', {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        document.getElementById("totalUsers").innerText = data.totalUsers;
        document.getElementById("totalQuizzes").innerText = data.totalQuizzes;
        document.getElementById("closedQuizzes").innerText = data.closedQuizzes;
        document.getElementById("leaderboardEntries").innerText = data.leaderboardEntries;

    } catch (error) {
        console.log(error);
    }
}



// Recent Quiz Table
async function loadActiveQuizzes() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch('http://localhost:8080/admin/active-quizzes', {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const quizzes = await response.json();

        const tbody = document.getElementById("quizTableBody");

        tbody.innerHTML = "";

        quizzes.forEach(quiz => {

            tbody.innerHTML += `
                <div class="grid-row">
                <div>${quiz.quizId}</div>
                <div>${quiz.title}</div>
                <div>${quiz.author}</div>
                <div>${new Date(
                quiz.endDate.split("-")[2],
                quiz.endDate.split("-")[1] - 1,
                quiz.endDate.split("-")[0]
            ).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
                }</div>
            </div> `;
        });

    } catch (error) {
        console.log(error);
    }

}

function adminLogout() {

    const logoutBtn = document.getElementById("logoutBtn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", function () {

        if (logoutBtn) {
            localStorage.removeItem("token");
            window.location.replace("login.html");
        }

    });
}

