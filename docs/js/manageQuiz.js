let allQuizzes = [];

document.addEventListener("DOMContentLoaded", () => {
    loadQuizzes();

    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", function () {
        handleSearch(this.value);
    });
});

function loadQuizzes() {
    fetch("http://localhost:8080/quiz/all")
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch quizzes");
            return res.json();
        })
        .then(data => {
            allQuizzes = data;
            renderTable(data);
        })
        .catch(err => console.log(err));
}

function renderTable(quizzes) {

    const container = document.getElementById("manageQuizBody");
    container.innerHTML = "";

    // No Searched Quiz Found 
    if (!quizzes || quizzes.length === 0) {
        container.innerHTML = `
            <div style="
                text-align: center;
                color: red;
                font-weight: bold;
                padding: 20px;
                font-size: 18px;
            ">
                No quiz found
            </div>
        `;
        return;
    }

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

    document.getElementById("editQuizId").value = quiz.quizId;
    document.getElementById("editTitle").value = quiz.title;

    const parts = quiz.endDate.split("-");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    document.getElementById("editEndDate").value = formattedDate;
    document.getElementById("editDuration").value = quiz.duration;
    document.getElementById("editAuthor").value = quiz.author;

    const modal = new bootstrap.Modal(
        document.getElementById("editQuizModal")
    );

    modal.show();
}

function saveQuizUpdate() {

    const updatedQuiz = {
        quizId: document.getElementById("editQuizId").value,
        title: document.getElementById("editTitle").value,
        endDate: document.getElementById("editEndDate").value,
        duration: document.getElementById("editDuration").value,
        author: document.getElementById("editAuthor").value
    };

    fetch("http://localhost:8080/admin/quiz/update", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
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
            document.activeElement.blur();
            bootstrap.Modal.getInstance(modalEl).hide();
        })
        .catch(err => console.log(err));
}

function handleSearch(keyword) {

    keyword = keyword.toLowerCase().trim();

    if (keyword === "") {
        renderTable(allQuizzes);
        return;
    }

    const filtered = allQuizzes.filter(q => {

        return (
            (q.title && q.title.toLowerCase().includes(keyword)) ||
            (q.author && q.author.toLowerCase().includes(keyword)) ||
            (String(q.quizId).includes(keyword))
        );
    });

    renderTable(filtered);
}

function goHome() {
    window.location.href = "adminDashboard.html";
}

