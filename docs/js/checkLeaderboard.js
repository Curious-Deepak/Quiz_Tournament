const leaderboardBody = document.getElementById("leaderboardBody");
const searchInput = document.getElementById("searchInput");

let allData = [];

function loadLeaderboard() {

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/adminLeaderboard", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })

        .then((response) => {

            if (!response.ok) {
                throw new Error("Failed to fetch leaderboard data");
            }

            return response.json();
        })

        .then((data) => {

            allData = data;
            renderLeaderboard(allData);
        })

        .catch((error) => {

            console.error(error);

            leaderboardBody.innerHTML = `
                <div style="
                    text-align: center;
                    color: red;
                    font-weight: bold;
                    margin-top: 20px;
                    font-size: 18px;
                ">
                    Failed to load leaderboard
                </div>
            `;
        });
}

function renderLeaderboard(data) {

    leaderboardBody.innerHTML = "";

    if (data.length === 0) {

        leaderboardBody.innerHTML = `
            <div style="
                text-align: center;
                color: red;
                font-weight: bold;
                margin-top: 20px;
                font-size: 18px;
            ">
                No record found
            </div>
        `;

        return;
    }

    // sort by quiz points
    data.sort((a, b) => {

        const quizCompare =
            a.quizTitle.localeCompare(b.quizTitle);

        if (quizCompare !== 0) return quizCompare;

        return b.points - a.points;
    });

    let currentQuiz = "";
    let rank = 1;

    data.forEach((result) => {

        if (currentQuiz !== result.quizTitle) {

            currentQuiz = result.quizTitle;
            rank = 1;

            const titleDiv = document.createElement("div");
            titleDiv.className = "quiz-heading";
            titleDiv.innerText = currentQuiz;

            leaderboardBody.appendChild(titleDiv);
        }

        const row = document.createElement("div");
        row.className = "leaderboard-row";

        row.innerHTML = `
            <div>${rank++}</div>
            <div>${result.playerName}</div>
            <div>${result.quizTitle}</div>
            <div>${result.points}</div>
            <div>${result.accuracy}%</div>
        `;

        leaderboardBody.appendChild(row);
    });
}

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase().trim();

    const filtered = allData.filter(item =>
        item.playerName.toLowerCase().includes(keyword) ||
        item.quizTitle.toLowerCase().includes(keyword)
    );

    renderLeaderboard(filtered);
});

function goHome() {
    window.location.href = "adminDashboard.html";
}

loadLeaderboard();

