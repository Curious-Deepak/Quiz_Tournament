// TAB SWITCH
const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
    });
});


// Popup for info btn 
const popup = document.getElementById("popup");
const infoBtn = document.querySelector(".info");
const closeBtn = document.querySelector(".close-btn");

infoBtn.addEventListener("click", () => {
    popup.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});

popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});


// SCORE COUNT ANIMATION
const scores = document.querySelectorAll(".score, .points");

scores.forEach(score => {
    let text = score.innerText;
    let target = parseInt(text);
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

document.addEventListener("DOMContentLoaded", applyAvatars);