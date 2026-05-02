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
let quizId = null;
let isSubmitted = false;


// Quiz from url
function getQuizId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("quizId");
}

// Title and Time Fetching 
window.onload = async function () {
    quizId = getQuizId();
    if (!quizId) return;

    const res = await fetch(`http://localhost:8080/quiz/${quizId}`);

    if (!res.ok) return;

    const quiz = await res.json();

    document.getElementById("quiz-title").innerText = quiz.title;
    timeRemaining = quiz.duration;

    const isAlreadySubmitted = await checkQuizStatus();
    if (isAlreadySubmitted) return;

    const hasQuestions = await fetchQuestions();
    if (hasQuestions) {
        startTimer();
    }
};

// One-time Submission 
async function checkQuizStatus() {

    const userId = 1;

    try {

        const res = await fetch(`http://localhost:8080/result/status?quizId=${quizId}&userId=${userId}`);

        if (!res.ok) throw new Error("Status API failed");

        const data = await res.json();

        if (data.submitted) { 
            isSubmitted = true;  
            window.onbeforeunload = null;       
            window.location.replace(`result.html?quizId=${quizId}`);
            return true;
        }
        return false;

    } catch (err) {
        console.error("Status error:", err);
        return false;
    }
}


// Fetch Questions
async function fetchQuestions() {
    try {

        console.log("Quiz ID:", quizId);

        if (!quizId) {
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
            return false;

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
        return true;

    } catch (error) {
        console.error("Error:", error);
        return false;
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

    loadQuestion(0);
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

// Back 
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


// Timer
function startTimer() {
    const timerDisplay = document.getElementById('timer');

    function updateDisplay() {
        let mins = Math.floor(timeRemaining / 60);
        let secs = timeRemaining % 60;

        timerDisplay.innerText =
            `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    updateDisplay();

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        if (timeRemaining <= 0) {
            timeRemaining = 0;
            clearInterval(timerInterval);

            timerDisplay.innerText = "00:00";

            const nextBtn = document.getElementById("next-btn");
            if (!nextBtn.disabled) {
                finishQuiz();
            }
            return;
        }

        timeRemaining--;
        updateDisplay();

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
        quizId: quizId,
        userId: 1, //Temporary
        submissions: userAnswers.map((ans, i) => ({
            questionId: quizData[i].questionId,
            selectedOptionId: ans !== null ? quizData[i].optionIds[ans] : null
        }))
    };

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

        await res.json();

        window.location.replace(`result.html?quizId=${quizId}`);

    } catch (error) {
        console.error("Submit error:", error);

        document.getElementById("result-container").innerHTML = `
        <div class="result-card">
            <p>Failed to submit quiz. Please try again.</p>
        </div>
    `;
    }
}

function goToHome() {
    isSubmitted = true;
    window.onbeforeunload = null;
    window.location.replace("index.html");
}
