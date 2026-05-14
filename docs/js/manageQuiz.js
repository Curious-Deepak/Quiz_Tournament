document.addEventListener("DOMContentLoaded", () => {
    loadQuizzes();
});

function loadQuizzes() {
    fetch("http://localhost:8080/quiz/all")
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch quizzes");
            return res.json();
        })
        .then(data => renderTable(data))
        .catch(err => console.log(err));
}

function renderTable(quizzes) {

    const container = document.getElementById("manageQuizBody");
    container.innerHTML = "";

    quizzes.forEach(q => {

        const row = document.createElement("div");
        row.className = "manage-row";

        row.innerHTML = `
            <div>${q.quizId ?? ""}</div>
            <div>${q.title ?? ""}</div>
            <div>${q.author ?? ""}</div>
            <div>
                ${new Date(q.endDate.split("-").reverse().join("-"))
                .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                })}
            </div>

            <div>
                <button class="action-btn edit-btn">
                    <i class="bi bi-pencil-square"></i>
                </button>
            </div>
        `;

        const editBtn = row.querySelector(".edit-btn");
        editBtn.addEventListener("click", () => {
            openEditModal(q);
        });

        container.appendChild(row);
    });
}

function openEditModal(quiz) {

    document.getElementById("editQuizId").value = quiz.quiz_id;
    document.getElementById("editTitle").value = quiz.title;
    document.getElementById("editEndDate").value = quiz.end_date;
    document.getElementById("editDuration").value = quiz.duration;

    const modal = new bootstrap.Modal(
        document.getElementById("editQuizModal")
    );

    modal.show();
}

function saveQuizUpdate() {

    const updatedQuiz = {
        quiz_id: document.getElementById("editQuizId").value,
        title: document.getElementById("editTitle").value,
        end_date: document.getElementById("editEndDate").value,
        duration: document.getElementById("editDuration").value
    };

    fetch("http://localhost:8080/quiz/updatePartial", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedQuiz)
    })
        .then(res => {
            if (!res.ok) throw new Error("Update failed");
            return res.json();
        })
        .then(() => {
            loadQuizzes();

            const modalEl = document.getElementById("editQuizModal");
            bootstrap.Modal.getInstance(modalEl).hide();
        })
        .catch(err => console.log(err));
}

function goHome() {
    window.location.href = "adminDashboard.html";
}

