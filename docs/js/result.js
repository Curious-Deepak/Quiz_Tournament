let quizId = null;
let userId = 1;

window.onload = async function () {

    const params = new URLSearchParams(window.location.search);
    quizId = params.get("quizId");

    if (!quizId) return;

    const container = document.getElementById("result-container");
    container.innerHTML = `
        <div class="result-card">
            <p>Loading result...</p>
        </div>
    `;

    await loadQuizTitle();
    await loadResult();
    connectWebSocket();
};

function connectWebSocket() {

    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {

        console.log("WebSocket Connected");

        stompClient.subscribe(`/live/result/${quizId}/${userId}`, function (message) {

            const data = JSON.parse(message.body);

            renderResultPage(data);
        });

    }, function (error) {
        console.error("WebSocket error :", error);
    });
}

async function loadQuizTitle() {
    try {
        const res = await fetch(`http://localhost:8080/quiz/${quizId}`);
        const quiz = await res.json();

        document.getElementById("quiz-title").innerText = quiz.title;

    } catch (err) {
        console.error("Quiz title error:", err);
    }
}

async function loadResult(retryCount = 3) {

    const container = document.getElementById("result-container");

    try {
        const res = await fetch(`http://localhost:8080/result/status?quizId=${quizId}&userId=${userId}`);

        if (!res.ok) throw new Error("Failed to fetch result");

        const data = await res.json();

        if (data.submitted && data.result) {
            renderResultPage(data.result);
            return;
        }

        if (retryCount > 0) {
            setTimeout(() => {
                loadResult(retryCount - 1);
            }, 1000);
        } else {
            container.innerHTML = `
                <div class="result-card">
                    <p>Result not available yet. Please try again.</p>
                </div>
            `;
        }

    } catch (err) {
        console.error("Result fetch error :", err);

        const container = document.getElementById("result-container");
        container.innerHTML = `
        <div class="result-card">
            <p>Error loading result. Please try again.</p>
        </div>
    `;
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
