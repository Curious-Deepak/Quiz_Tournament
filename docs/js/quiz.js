// No Page Reloading
window.onbeforeunload = function (e) {
    if (!isSubmitted) {
        e.preventDefault();
        e.returnValue = '';
    }
};

let quizData = [];
let currentIdx = 0;
let userAnswers = [];
let skippedQuestions = [];
let timeRemaining = 300;
let timerInterval = null;
let isSubmitted = false;


// Quiz from url
function getQuizId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("quizId");
}

window.onload = async function () {
    loadQuizTitle();
    await checkQuizStatus();
};

// One-time Submission 
async function checkQuizStatus() {

    const quizId = getQuizId();
    const userId = 1;

    try {
        const res = await fetch(`http://localhost:8080/result/status?quizId=${quizId}&userId=${userId}`);

        if (!res.ok) throw new Error("Status API failed");
        const data = await res.json();

        if (data.submitted) {
            document.getElementById("quiz-container").style.display = "none";
            document.getElementById("result-container").style.display = "flex";
            showResult(data.result);
        } else {
            fetchQuestions();
        }

    } catch (err) {
        console.error("Status error:", err);
        //Start
        fetchQuestions();
    }
}

async function loadQuizTitle() {
    const quizId = getQuizId();

    const res = await fetch(`http://localhost:8080/quiz/${quizId}`);
    const quiz = await res.json();

    document.getElementById("quiz-title").innerText = quiz.title || "Loading Title ...";
}

// Fetch Questions
async function fetchQuestions() {
    try {
        const quizId = getQuizId();

        console.log("Quiz ID:", quizId);

        if (!quizId) {
            alert("Quiz ID missing in URL");
            return;
        }

        const res = await fetch(`http://localhost:8080/questions/quiz/${quizId}`);
        const data = await res.json();

        console.log("API DATA:", data);

        // Empty Quiz  
        if (!data || data.length === 0) {
            isSubmitted = true;

            const questionText = document.getElementById("question-text");
            const optionsContainer = document.getElementById("options-container");

            questionText.innerText = "This quiz is currently unavailable.";

            optionsContainer.innerHTML = `<div class = "error-container">
                <p>Please try another quiz or come back later.</p>
                <button onclick="goToHome()" class="error-btn">Go to Home</button>
                </div>
                `;

            document.getElementById("next-btn")?.setAttribute("disabled", true);
            document.getElementById("btn-skip")?.setAttribute("disabled", true);
            document.getElementById("btn-back")?.setAttribute("disabled", true);

            setTimeout(() => {
                window.onbeforeunload = null;
                window.location.replace("index.html");
            }, 3000);
            return;

        }

        quizData = data.map(q => ({
            questionId: q.questionId,
            question: q.questionText,
            options: q.options.map(opt => opt.optionText),
            optionIds: q.options.map(opt => opt.optionId),
            correct: null
        }));

        userAnswers = new Array(quizData.length).fill(null);
        skippedQuestions = new Array(quizData.length).fill(false);

        init();

    } catch (error) {
        console.error("Error:", error);
    }
}

// INIT UI
function init() {
    const grid = document.getElementById('number-grid');
    grid.innerHTML = "";

    document.getElementById('total-count').innerText = quizData.length;

    quizData.forEach((_, i) => {
        const div = document.createElement('div');
        div.innerText = i + 1;
        div.id = `nav-${i}`;
        div.onclick = () => jumpToQuestion(i);
        grid.appendChild(div);
    });

    loadQuizTitle();
    loadQuestion(0);
    loadTimer();
}


// Load Questions
function loadQuestion(index) {
    currentIdx = index;
    const q = quizData[index];

    document.getElementById('current-q-num').innerText = index + 1;
    document.getElementById('question-text').innerText = q.question;

    const optionsBox = document.getElementById('options-container');
    optionsBox.innerHTML = "";

    const optionHTML = q.options.map((opt, i) => {
        const isChecked = userAnswers[index] === i ? 'checked' : '';
        return `
        <label>
            <input type="radio" name="option" value="${i}" ${isChecked}
            onchange="selectOption(${i})">
            ${opt}
        </label>
    `;
    }).join("");

    optionsBox.innerHTML = optionHTML;

    updateNavGrid();

    const nextBtn = document.getElementById("next-btn");

    if (index === quizData.length - 1) {
        nextBtn.innerText = "Finish Quiz";
        nextBtn.classList.add("finish-btn");
    } else {
        nextBtn.innerText = "Next";
        nextBtn.classList.remove("finish-btn");
    }
}


// Select Options
function selectOption(optionIndex) {
    userAnswers[currentIdx] = optionIndex;
    skippedQuestions[currentIdx] = false;
    updateNavGrid();
}


// Question Navigator
function jumpToQuestion(i) {
    loadQuestion(i);
}

function nextQuestion() {
    if (currentIdx === quizData.length - 1) {
        const nextBtn = document.getElementById("next-btn");
        if (!nextBtn.disabled) {
            finishQuiz();
        }
        return;
    }
    loadQuestion(currentIdx + 1);
}

function prevQuestion() {
    if (currentIdx > 0) {
        loadQuestion(currentIdx - 1);
    }
}


// Skip
function skipQuestion() {
    if (userAnswers[currentIdx] === null) {
        skippedQuestions[currentIdx] = true;
    }
    nextQuestion();
}


// Grid update 
function updateNavGrid() {
    quizData.forEach((_, i) => {
        const el = document.getElementById(`nav-${i}`);
        el.classList.remove('answered', 'skipped', 'active');

        if (i === currentIdx) el.classList.add('active');
        if (userAnswers[i] !== null) el.classList.add('answered');
        else if (skippedQuestions[i]) el.classList.add('skipped');
    });
}

// Fetch Duration 
async function loadTimer() {
    const quizId = getQuizId();

    const res = await fetch(`http://localhost:8080/quiz/${quizId}`);
    const quiz = await res.json();

    timeRemaining = quiz.duration;

    startTimer();
}

// Timer
function startTimer() {
    const timerDisplay = document.getElementById('timer');

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {

        if (timeRemaining <= 0) {
            timeRemaining = 0;
            clearInterval(timerInterval);

            timerDisplay.innerText = "00:00";

            const nextBtn = document.getElementById("next-btn");
            if (!nextBtn.disabled) {
                alert("Time's up!");
                finishQuiz();
            }
            return;
        }

        let mins = Math.floor(timeRemaining / 60);
        let secs = timeRemaining % 60;

        timerDisplay.innerText =
            `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        timeRemaining--;

    }, 1000);
}


// Finish 
async function finishQuiz() {

    if (isSubmitted) return;
    isSubmitted = true;

    const nextBtn = document.getElementById("next-btn");
    nextBtn.disabled = true;

    clearInterval(timerInterval);

    const payload = {
        quizId: getQuizId(),
        userId: 1, //Temporary
        submissions: userAnswers.map((ans, i) => ({
            questionId: quizData[i].questionId,
            selectedOptionId: ans !== null ? quizData[i].optionIds[ans] : null
        }))
    };

    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "flex";
    document.getElementById("result-container").innerHTML = `
    <div class="result-card">
        <p>Calculating result...</p>
    </div>
    `;

    try {
        const res = await fetch("http://localhost:8080/result/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error("Failed to submit quiz");
        }

        const resultData = await res.json();

        showResult(resultData);

    } catch (error) {
        console.error("Submit error:", error);

        document.getElementById("result-container").innerHTML = `
        <div class="result-card">
            <p>Failed to submit quiz. Please try again.</p>
        </div>
    `;
    }
}


// Result Card 
function showResult(data) {

    // Message 
    let message = "KEEP GOING";

    if (data.accuracy >= 80) message = "EXCELLENT";
    else if (data.accuracy >= 50) message = "GOOD JOB";
    else if (data.accuracy >= 20) message = "NEED IMPROVEMENT";
    else if (data.accuracy === 0) message = "TRY AGAIN AFTER PRACTICE";
    else message = "PRACTICE MORE";

    const resultContainer = document.getElementById("result-container");

    resultContainer.innerHTML = `
        <div class="result-card">

            <div class="trophy">
                <i class="bi bi-trophy-fill"></i>
            </div>

            <h1 class="points">${data.points}</h1>
            <p class="points-label">POINTS EARNED</p>

            <h2 class="message">
                <i class="bi bi-lightning-charge-fill"></i> ${message}
            </h2>

            <div class="stats">
                <div>
                    <h3>${data.correct}</h3>
                    <p><i class="bi bi-check-circle-fill correct"></i> CORRECT</p>
                </div>
                <div>
                    <h3>${data.wrong}</h3>
                    <p><i class="bi bi-x-circle-fill wrong"></i> WRONG</p>
                </div>
                <div>
                    <h3>${data.accuracy}%</h3>
                    <p><i class="bi bi-graph-up accuracy"></i> ACCURACY</p>
                </div>
            </div>

            <div class="result-buttons">
                <button class="btn leaderboard" onclick="goToLeaderboard()">
                    <i class="bi bi-bar-chart-fill"></i> LEADERBOARD
                </button>

                <button class="btn play" onclick="goToHome()">
                    <i class="bi bi-play-fill"></i> PLAY QUIZ
                </button>
            </div>

        </div>
    `;
    resultContainer.style.display = "flex";
}


// Navigation 
function goToLeaderboard() {
    isSubmitted = true;
    window.onbeforeunload = null;
    window.location.replace("leaderboard.html");
}

function goToHome() {
    isSubmitted = true;
    window.onbeforeunload = null;
    window.location.replace("index.html");
}

