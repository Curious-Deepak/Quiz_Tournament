// Login Check
function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

async function handlePlay(quizId) {

  if (!isLoggedIn()) {
    window.location.replace("login.html");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8080/result/status?quizId=${quizId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (data.submitted) {
      window.location.replace(`result.html?quizId=${quizId}`);
    } else {
      window.location.replace(`t&c.html?quizId=${quizId}`);
    }

  } catch (error) {
    console.error("Error checking quiz status !!", error);
  }
  
}


function createPlayButton(quizId) {

  const loggedIn = isLoggedIn();
  const btnText = "Play";

  const btnAction = loggedIn
    ? `handlePlay(${quizId})`
    : `window.location.replace('login.html')`;

  return `
    <button onclick="${btnAction}" class="btn btn-secondary">
    ${btnText}
    </button>
  `;

}


async function loadQuizzes() {

  try {

    const [latestRes, ongoingRes] = await Promise.all([
      fetch("http://localhost:8080/quiz/latest"),
      fetch("http://localhost:8080/quiz/ongoing")
    ]);

    const latestData = await latestRes.json();
    const ongoingData = await ongoingRes.json();

    renderLatestQuizzes(latestData);
    renderOngoingQuizzes(ongoingData);

  } catch (err) {
    console.error("Error fetching quizzes !", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuizzes();
  connectWebSocket();
});

// Latest Quiz Card
function createLatestQuizCard(q) {
  return `
    <div class="quiz-card latest-card">
      
      <div class="quiz-image">
        <img src="${q.imageUrl}" alt="${q.title}">
      </div>

      <div class="quiz-content">
        <h2>${q.title}</h2>
        <p>${q.description}</p>

        <div class="quiz-info">
          <span class="highlight">${q.totalQuestions}</span> Questions
          <span class="limelight">${q.duration}</span> Sec
        </div>

        <div class="quiz-extra">
          <span><i class="bi bi-file-earmark-text cert-icon"></i> E-Certificate</span>
          <span class="tnc-link"
          onclick="window.location.replace('t&c.html?quizId=${q.quizId}')">
          <i class="bi bi-info-circle info-icon"></i> T&C
        </span>
        </div>

        <p class="author">Organizer : ${q.author}</p>
      </div>

      <div class="quiz-side">
        <div class="participants">${q.participants} participants</div>

        <div class="dates">
          <p><strong>Start :</strong> ${q.startDate}</p>
          <p><strong>End :</strong> ${q.endDate}</p>
        </div>

        ${createPlayButton(q.quizId)}
      </div>

    </div>
  `;
}


// Ongoing Quiz Card
function createOngoingQuizCard(q) {
  return `
    <div class="quiz-card ongoing-card">
      
      <div class="card-image">
        <img src="${q.imageUrl}" alt="${q.title}">
      </div>

      <div class="card-body">
        <h3>${q.title}</h3>

        <div class="participants">${q.participants} participants</div>

        <p class="desc">${q.description}</p>

        <div class="dates">
          <p>${q.startDate}</p>
          <p><strong>To</strong></p>
          <p>${q.endDate}</p>
        </div>

        <div class="meta">
          <span class="highlight">${q.totalQuestions}</span> Questions
          <span class="limelight">${q.duration}</span> Sec
        </div>

        ${createPlayButton(q.quizId)}

        <p class="author">Organizer : ${q.author}</p>
      </div>

    </div>
  `;
}


// Render Latest Quizzes
function renderLatestQuizzes(data) {
  const container = document.getElementById("latestList");
  container.innerHTML = data.map(q => createLatestQuizCard(q)).join("");
}

function renderOngoingQuizzes(data) {
  const container = document.getElementById("ongoingList");
  container.innerHTML = data.map(q => createOngoingQuizCard(q)).join("");
}

// Websocket 
let stompClient = null;
function connectWebSocket() {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, function () {
    console.log("Connected to WebSocket");

    //listen to LIVE updates
    stompClient.subscribe("/live/quizzes", function (message) {
      console.log("Live update received");

      const data = JSON.parse(message.body);

      renderLatest(data.latest);
      renderOngoing(data.ongoing);
    });

  }, function (error) {
    console.error("WebSocket error :", error);
  });
}

