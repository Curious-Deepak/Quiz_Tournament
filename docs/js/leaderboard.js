// Leaderboard 
async function loadLeaderboard(filter = "overall") {
    try {
        const res = await fetch(`http://localhost:8080/leaderboard?filter=${filter}`);
        const data = await res.json();

        renderLeaderboard(data);

    } catch (err) {
        console.error("Error loading leaderboard:", err);
    }
}

window.onload = () => loadLeaderboard("overall");


function renderLeaderboard(data) {

    const topContainer = document.querySelector(".leaderboard");
    const listContainer = document.querySelector(".ranking-list");

    if (!topContainer || !listContainer) {
        console.error("Data for containers not found !");
        return;
    }

    if (!data || data.length === 0) {
        listContainer.innerHTML = "<p>No data available</p>";
        return;
    }

    // TOP 3
    const top3 = data.slice(0, 3);

    const podium = [
        top3[1] || null,
        top3[0] || null,
        top3[2] || null
    ];

    topContainer.innerHTML = podium.map((user, index) => {

        if (!user) return "";

        const medal = index === 0 ? "silver" : index === 1 ? "gold" : "bronze";
        const rankClass = index === 0 ? "rank-2" : index === 1 ? "rank-1" : "rank-3";
        const position = index === 0 ? "II" : index === 1 ? "I" : "III";

        return `
        <div class="rank ${rankClass}">
            <div class="${medal}">${getInitials(user.playerName)}</div>
            <p class="name">${user.playerName}</p>
            <p class="score">${user.points} PTS</p>
            ${index === 1 ? `<span><i class="bi bi-star-fill topper"></i></span>` : ""}
            <span class="position">${position}</span>
        </div>
    `;
    }).join("");

    document.querySelectorAll(".gold, .silver, .bronze").forEach(el => {
        const name = el.closest(".rank").querySelector(".name").innerText;
        el.style.backgroundColor = getColorFromName(name);
    });

    // REST LIST
    const rest = data.slice(3);

    let html = `
        <div class="list-header">
            <span class="col-id"># SR</span>
            <span class="col-player">Player</span>
            <span class="col-qcount">Quiz Count</span>
            <span class="col-stats">
                <i class="bi bi-info-circle-fill info"></i> Accuracy
            </span>
            <span class="col-points">Points</span>
        </div>
    `;

    rest.forEach(user => {
        html += `
            <div class="list-item">
                <span class="rank-num">${user.rank}.</span>
                <div class="player-info">
                    <div class="avatar"></div>
                    <span class="player-name">${user.playerName}</span>
                </div>
                <span class="q-stats">${user.qcount}</span>
                <span class="stats">${user.accuracy}%</span>
                <span class="points">${user.points} PTS</span>
            </div>
        `;
    });

    listContainer.innerHTML = html;

    applyAvatars();
    animateScores();

}

// TAB SWITCH
const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
    });
});


// Popup for info btn 
document.addEventListener("click", function (e) {
    if (e.target.closest(".info")) {
        document.getElementById("popup").style.display = "flex";
    }
});

document.querySelector(".close-btn").addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
});

document.getElementById("popup").addEventListener("click", function (e) {
    if (e.target === this) {
        this.style.display = "none";
    }
});


// Score Count Animation
function animateScores() {
    const scores = document.querySelectorAll(".score, .points");

    scores.forEach(score => {
        let text = score.innerText.replace(/\D/g, "");
        let target = parseInt(text);

        if (isNaN(target)) return;

        let count = 0;

        let interval = setInterval(() => {
            count += Math.ceil(target / 30);

            if (count >= target) {
                score.innerText = target + " PTS";
                clearInterval(interval);
            } else {
                score.innerText = count + " PTS";
            }
        }, 30);
    });
}

// Random colors 
function getInitials(name) {
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();
}

function getColorFromName(name) {
    const colors = [
        "#FF6B6B", "#4ECDC4", "#FFD93D",
        "#6C5CE7", "#00B894", "#E17055",
        "#0984E3", "#FDCB6E", "#00CEC9"
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}

function applyAvatars() {
    const rows = document.querySelectorAll(".list-item");

    rows.forEach(row => {
        const nameEl = row.querySelector(".player-name");
        const avatar = row.querySelector(".avatar");

        if (!nameEl || !avatar) return;

        const name = nameEl.textContent.trim();

        avatar.textContent = getInitials(name);
        avatar.style.backgroundColor = getColorFromName(name);
    });
}
