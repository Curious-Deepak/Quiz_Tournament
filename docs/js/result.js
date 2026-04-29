// Search Handling
document.addEventListener("DOMContentLoaded", () => {
    loadClosedQuizzes();

    document.getElementById("searchInput").addEventListener("input", searchQuiz);
});

async function loadClosedQuizzes() {
    try {
        const res = await fetch("http://localhost:8080/quiz/all");
        const data = await res.json();

        const container = document.getElementById("quizContainer");
        container.innerHTML = "";

        if (!data || data.length === 0) {
            document.getElementById("noResult").style.display = "block";
            return;
        }

        data.forEach(quiz => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${quiz.imageUrl}">

                <div class="card-content">
                    <div class="card-title">${quiz.title}</div>

                    <div class="card-duration">
                        Duration : ${quiz.startDate} To ${quiz.endDate}
                    </div>

                    <button class="result-btn" onclick="viewResult(${quiz.quizId})">
                        <i class="bi bi-trophy-fill"></i> View Result
                    </button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading quizzes:", error);
    }
}

function viewResult(quizId) {
    window.location.href = `result-detail.html?quizId=${quizId}`;
}

function searchQuiz() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".card");
    const noResult = document.getElementById("noResult");

    let found = false;

    cards.forEach(card => {
        const title = card.querySelector(".card-title").innerText.toLowerCase();

        if (title.includes(input)) {
            card.style.display = "block";
            found = true;
        } else {
            card.style.display = "none";
        }
    });

    noResult.style.display = found ? "none" : "block";
}
