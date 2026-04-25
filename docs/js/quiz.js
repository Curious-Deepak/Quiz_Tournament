let quizData = [];
let currentIdx = 0;
let userAnswers = [];
let skippedQuestions = [];
let timeRemaining = 300;
let timerInterval = null;


// Quiz from url
function getQuizId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("quizId");
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


        const res = await fetch(`http://localhost:8080/play/questions/${quizId}`);

        const data = await res.json();

        console.log("API DATA:", data);

        if (!data || data.length === 0) {
            alert("No questions found!");
            return;
        }

        quizData = data.map(q => ({
            question: q.question,
            options: [q.option1, q.option2, q.option3, q.option4],
            correct: q.correctAnswer
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

    loadQuestion(0);
    startTimer();
}


// Load Questions
function loadQuestion(index) {
    currentIdx = index;
    const q = quizData[index];

    document.getElementById('current-q-num').innerText = index + 1;
    document.getElementById('question-text').innerText = q.question;

    const optionsBox = document.getElementById('options-container');
    optionsBox.innerHTML = "";

    q.options.forEach((opt, i) => {
        const isChecked = userAnswers[index] === i ? 'checked' : '';
        optionsBox.innerHTML += `
            <label>
                <input type="radio" name="option" value="${i}" ${isChecked}
                onchange="selectOption(${i})">
                ${opt}
            </label>
        `;
    });

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
        finishQuiz();
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


// Timer
function startTimer() {
    const timerDisplay = document.getElementById('timer');

    timerInterval = setInterval(() => {
        let mins = Math.floor(timeRemaining / 60);
        let secs = timeRemaining % 60;

        timerDisplay.innerText =
            `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }

        timeRemaining--;
    }, 1000);
}


// Finish 
function finishQuiz() {
    clearInterval(timerInterval);

    let correct = 0;

    userAnswers.forEach((ans, i) => {
        if (ans === quizData[i].correct) correct++;
    });

    let wrong = quizData.length - correct;
    let accuracy = Math.round((correct / quizData.length) * 100);
    let points = correct * 100 - wrong * 10;

    document.getElementById("quiz-container").style.display = "none";

    const result = document.getElementById("result-container");
    result.style.display = "flex";

    document.getElementById("points").innerText = points;
    document.getElementById("correct").innerText = correct;
    document.getElementById("wrong").innerText = wrong;
    document.getElementById("accuracy").innerText = accuracy + "%";
}


// Navigation 
function goToLeaderboard() {
    window.location.href = "leaderboard.html";
}

function goToHome() {
    window.location.href = "index.html";
}


//  Start 
fetchQuestions();