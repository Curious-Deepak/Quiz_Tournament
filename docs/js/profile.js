function getAuthHeaders() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }

    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };
}

window.onload = async () => {

    await loadProfile();
    initializeAvatarSystem();
    loadActivities("active");
    setActiveTab("active");

    // Tab Switching
    document.getElementById("active-tab").addEventListener("click", () => {
        loadActivities("active");
        setActiveTab("active");
    });

    document.getElementById("past-tab").addEventListener("click", () => {
        loadActivities("past");
        setActiveTab("past");
    });

};


async function loadProfile() {
    try {
        const res = await fetch("http://localhost:8080/profile", {
            headers: getAuthHeaders()
        });
        const data = await res.json();

        document.getElementById("user-name").innerText = data.fullName || "N/A";
        document.getElementById("user-email").innerText = data.email || "Not available";

        document.getElementById("total-points").innerText = data.totalPoints || 0;
        document.getElementById("total-quizzes").innerText = data.totalQuizzes || 0;
        document.getElementById("badge-level").innerText = data.badgeLevel || "Beginner";

        return data;

    } catch (err) {
        console.error("Profile load error:", err);
    }
}


async function loadActivities(type = "past") {

    try {

        setActiveTab(type);

        const res = await fetch(`http://localhost:8080/profile/activities?type=${type}`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();

        renderActivities(data);

    } catch (err) {
        console.error("Activity load error :", err);
    }

}

function renderActivities(data) {

    const container = document.getElementById("activity-container");

    if (!data || data.length === 0) {
        container.innerHTML = "";
        return;
    }

    let html = "";

    data.forEach((item, index) => {

        html += `
        <div class="activity-row">
            <span>${index + 1}. ${item.quizName}</span>
            <span>${formatDate(item.participatedOn)}</span>
            <span>${item.accuracy}%</span>
        </div>
        `;
    });

    container.innerHTML = html;
}

function formatDate(dateStr) {
    if (!dateStr) return "N/A";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

}

function setActiveTab(type) {

    const activeTab = document.getElementById("active-tab");
    const pastTab = document.getElementById("past-tab");

    activeTab.classList.remove("active-link");
    pastTab.classList.remove("active-link");

    if (type === "active") {
        activeTab.classList.add("active-link");
    } else {
        pastTab.classList.add("active-link");
    }
}


// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.replace("login.html");
}

// Avatar Selection 
function initializeAvatarSystem() {

    const editIcon = document.querySelector(".edit-icon");
    const popup = document.getElementById("avatarPopup");
    const closePopup = document.getElementById("closePopup");
    const avatarOptions = document.querySelectorAll(".avatar-option");
    const userImg = document.querySelector(".user-img");
    const userEmail = document.getElementById("user-email").innerText;

    const avatarKey = "userAvatar_" + userEmail;
    const savedAvatar = localStorage.getItem(avatarKey);

    if (savedAvatar) {
        userImg.src = savedAvatar;
    }

    editIcon.addEventListener("click", () => {
        popup.classList.add("active");
    });

    closePopup.addEventListener("click", () => {
        popup.classList.remove("active");
    });

    popup.addEventListener("click", (e) => {

        if (e.target === popup) {
            popup.classList.remove("active");
        }

    });

    avatarOptions.forEach((avatar) => {
        avatar.addEventListener("click", () => {
            const selectedAvatar = avatar.getAttribute("src");
            userImg.src = selectedAvatar;
            localStorage.setItem(avatarKey, selectedAvatar);
            popup.classList.remove("active");
        });

    });

}

