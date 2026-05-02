window.onbeforeunload = function () {
    sessionStorage.removeItem("quizResult");
};


let quizId = null;
let userId = 1;
let isSubmitted = true;

window.onload = async function () {

    const params = new URLSearchParams(window.location.search);
    quizId = params.get("quizId");

    if (!quizId) return;

    await loadQuizTitle();
    await loadResult();
};

async function loadQuizTitle() {
    try {
        const res = await fetch(`http://localhost:8080/quiz/${quizId}`);
        const quiz = await res.json();

        document.getElementById("quiz-title").innerText = quiz.title;

    } catch (err) {
        console.error("Quiz title error:", err);
    }
}

async function loadResult() {

    document.getElementById("result-container").innerHTML = `
    <div class="result-card">
        <p>Loading result...</p>
    </div>
    `;

    document.getElementById("certificate-container").innerHTML = `
    <div class="certificate-box">
        <p>Preparing certificate...</p>
    </div>
    `;

    try {
        const res = await fetch(`http://localhost:8080/result/status?quizId=${quizId}&userId=${userId}`);

        if (!res.ok) throw new Error("Failed to fetch result");

        const data = await res.json();

        if (!data.submitted || !data.result) {
            document.getElementById("result-container").innerHTML = `
        <div class="result-card">
            <p>No result found. Please attempt the quiz first.</p>
        </div>
        `;
            return;
        }

        renderResultPage(data.result);

    } catch (err) {
        console.error("Result fetch error:", err);
    }
}

// Result Card 
function renderResultPage(data) {

    if (!data) return;

    let message = "KEEP GOING";

    if (data.accuracy >= 80) message = "EXCELLENT";
    else if (data.accuracy >= 50) message = "GOOD JOB";
    else if (data.accuracy >= 20) message = "NEED IMPROVEMENT";
    else if (data.accuracy === 0) message = "TRY AGAIN AFTER PRACTICE";
    else message = "PRACTICE MORE";

    // Result
    document.getElementById("result-container").innerHTML = `
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
                    <i class="bi bi-bar-chart-fill"></i>LEADERBOARD
                </button>

                <button class="btn play" onclick="goToHome()">
                    <i class="bi bi-play-fill"></i>PLAY QUIZ
                </button>
            </div>

        </div>
    `;

    // RIGHT SIDE CERTIFICATE
    document.getElementById("certificate-container").innerHTML = `
        <div class="certificate-box">

            <div class="icon">
                <i class="bi bi-patch-check-fill"></i>
            </div>

            <div class="ribbon">Congratulations</div>

            <h2>Certificate of Completion</h2>
            <p>This certifies successful completion of the quiz</p>

            <button onclick="downloadCertificate()">
                Download Certificate
            </button>

            <div class="note">
                Keep the record of your learnings and performance
            </div>

            <div class="quote-box">
                <i class="bi bi-quote quote-icon"></i>
                <p class="quote-text">
                If you can't <b>IMAGINE</b> it you can't <b>CREATE</b> it.
                </p>
            </div>

        </div>
    `;

    document.querySelector(".result-box").style.display = "flex";
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

function downloadCertificate() {
    alert("Download feature coming soon");
}
