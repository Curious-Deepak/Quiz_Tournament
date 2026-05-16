let questionCount = 1;
let selectedQuizId = null;

let maxQuestions = 0;
let currentCount = 0;
let remaining = 0;

window.onload = function () {
    const container = document.getElementById("questionContainer");

    const firstBlock = container.querySelector(".question-block");
    if (firstBlock) {
        setQuestionNumber(firstBlock, questionCount);
    }
};

async function checkQuiz() {

    document.getElementById("remainingText").innerText =
        `Remaining : ${remaining}`;

    const quizId =
        document.getElementById("quizIdInput").value;

    const error =
        document.getElementById("quizError");

    const heading =
        document.getElementById("quizHeading");

    const questionUI =
        document.getElementById("quizForm");

    error.innerText = "";
    heading.innerText = "";
    questionUI.style.display = "none";

    if (!quizId) {
        error.innerText = "Please enter quiz id";
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) return;

    try {
        const response = await fetch(
            `http://localhost:8080/questions/check/${quizId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();
        console.log(data);

        if (!data.success) {
            error.innerText = data.message;
            return;
        }

        selectedQuizId = quizId;

        maxQuestions = Number(data.totalQuestions || 0);
        currentCount = Number(data.currentCount || 0);
        remaining = maxQuestions - currentCount;

        heading.innerText =
            `Add Questions into ${data.quizTitle}`;

        remainingText.innerText =
            `Remaining : ${remaining}`;

        remainingText.style.color =
            remaining > 0 ? "green" : "red";

        questionUI.style.display = "block";

    } catch (error) {
        console.log(error);
        alert("Error checking quiz");
    }
}


function addQuestion() {

    const container = document.getElementById("questionContainer");
    const error = document.getElementById("quizError");

    const existingBlocks =
        document.querySelectorAll(".question-block").length;

    // LIMIT CHECK
    if (currentCount + existingBlocks >= maxQuestions) {

        error.innerText = "Questions limit reached!";
        error.style.color = "red";
        document.getElementById("remainingText").innerText =
            "Questions limit reached!";
        return;
    }

    error.innerText = "";
    questionCount++;

    const block = document.createElement("div");
    block.className = "question-block";

    block.innerHTML = `
        <h5 class="fw-bold mb-3">Question ${questionCount}</h5>

        <input type="text" class="form-control mb-4 question-text" placeholder="Enter question" required>

        <h6 class="form-label fw-bold">Options</h6>
        <input type="text" class="form-control mb-3 opt" placeholder="Option 1" required>
        <input type="text" class="form-control mb-3 opt" placeholder="Option 2" required>
        <input type="text" class="form-control mb-3 opt" placeholder="Option 3" required>
        <input type="text" class="form-control mb-3 opt" placeholder="Option 4" required>

        <h6 class="form-label fw-bold">Correct Option</h6>
        <select class="form-select correct-opt mt-2" required>
            <option value="" selected disabled hidden>Select Correct Option</option>
            <option value="0">Option 1 is Correct</option>
            <option value="1">Option 2 is Correct</option>
            <option value="2">Option 3 is Correct</option>
            <option value="3">Option 4 is Correct</option>
        </select>
    `;

    container.appendChild(block);

    let usedNow = currentCount + document.querySelectorAll(".question-block").length;
    let newRemaining = maxQuestions - usedNow;

    document.getElementById("remainingText").innerText =
        `Remaining : ${newRemaining}`;

    if (newRemaining <= 0) {
        document.getElementById("remainingText").style.color = "red";
    } else {
        document.getElementById("remainingText").style.color = "green";
    }
}



function setQuestionNumber(block, number) {
    const title = document.createElement("h5");
    title.className = "mb-3 fw-bold";
    title.innerText = `Question ${number}`;
    block.prepend(title);
}

async function submitQuestions() {

    if (!selectedQuizId) {
        alert("Please check quiz first");
        return;
    }

    const blocks =
        document.querySelectorAll(".question-block");

    const questions = [];

    blocks.forEach(block => {

        const questionText =
            block.querySelector(".question-text").value;

        const optionInputs =
            block.querySelectorAll(".opt");

        const correctIndex =
            parseInt(block.querySelector(".correct-opt").value);

        const options = [];

        optionInputs.forEach((input, index) => {
            options.push({
                optionText: input.value,
                isCorrect: index === correctIndex
            });
        });

        questions.push({
            quizId: selectedQuizId,
            questionText: questionText,
            options: options
        });
    });

    const newCount = blocks.length;

    if (currentCount + newCount > maxQuestions) {
        alert(
            `Limit exceeded!\nAllowed: ${maxQuestions}\nAlready: ${currentCount}\nTrying to add: ${newCount}`
        );
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("No token found");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:8080/questions/add",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(questions)
            }
        );
        const data = await response.text();
        console.log(data);

        questionCount = 1;
        selectedQuizId = null;
        maxQuestions = 0;
        currentCount = 0;
        window.location.replace("adminDashboard.html");

    } catch (error) {
        console.log(error);
        alert("Error sending questions");
    }
}

document.getElementById("quizForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        submitQuestions();
    });

function goHome() {
    window.location.replace("adminDashboard.html");
}

