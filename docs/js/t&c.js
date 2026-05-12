protectPage();

const params = new URLSearchParams(window.location.search);
const quizId = params.get("quizId");


window.onload = async function () {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:8080/quiz/${quizId}`,
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        // Token Expired / Unauthorized
        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.replace("login.html");

            return;
        }

        const quiz = await response.json();

        // Quiz Title
        document.getElementById("quiz-title").textContent =
            quiz.title;

        // Quiz Dates
        document.getElementById("start-date").textContent =
            "Start : " + quiz.startDate;

        document.getElementById("end-date").textContent =
            "End : " + quiz.endDate;

        // Total Questions
        document.getElementById("question-count").textContent =
            quiz.totalQuestions;

        // Quiz Duration
        document.getElementById("quiz-duration").textContent =
            quiz.duration + " Sec";

        // Quiz Image
        if (quiz.imageUrl) {

            document.getElementById("quiz-image").src =
                quiz.imageUrl;
        }

        // Play Button
        document.getElementById("play-btn")
            .addEventListener("click", function () {
                window.location.replace(`quiz.html?quizId=${quiz.quizId}`);
            });

    } catch (error) {

        console.log("Error loading quiz !", error);
    }

};


