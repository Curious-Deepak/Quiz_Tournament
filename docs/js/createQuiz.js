document.addEventListener("DOMContentLoaded", () => {

    const quizForm = document.getElementById("quizForm");

    quizForm.addEventListener("submit", createQuiz);

});

async function createQuiz(event) {

    event.preventDefault();

    document.getElementById("questionError").innerText = "";
    document.getElementById("durationError").innerText = "";
    document.getElementById("startDateError").innerText = "";
    document.getElementById("endDateError").innerText = "";
    document.getElementById("imageError").innerText = "";

    // TOKEN
    const token = localStorage.getItem("token");

    // GET INPUT VALUES
    const title =
        document.getElementById("title").value;

    const author =
        document.getElementById("author").value;

    const description =
        document.getElementById("description").value;

    const noOfQuestions =
        parseInt(document.getElementById("noOfQuestions").value);

    const duration =
        document.getElementById("duration").value;

    const startDate =
        document.getElementById("startDate").value;

    const endDate =
        document.getElementById("endDate").value;

    const imageFile =
        document.getElementById("imgUrl").files[0];

    // VALIDATION

    // Questions validation
    if (noOfQuestions < 10) {
        document.getElementById("questionError")
            .innerText =
            "Questions cannot be less than 10";
        return;
    }

    // Duration validation
    if (duration < 120) {
        document.getElementById("durationError")
            .innerText =
            "Duration cannot be less than 120 seconds";
        return;
    }

    // Date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Start date validation
    if (start < today) {
        document.getElementById("startDateError")
            .innerText =
            "Start date cannot be before today";
        return;
    }

    // End date validation
    if (end < start) {
        document.getElementById("endDateError")
            .innerText =
            "End date cannot be before start date";
        return;
    }

    // Image validation
    if (imageFile === undefined) {
        document.getElementById("imageError")
            .innerText =
            "Please select image";
        return;
    }

    // CREATE FORMDATA
    const formData = new FormData();

    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("noOfQuestions", noOfQuestions);
    formData.append("duration", duration);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("image", imageFile);

    // SEND DATA TO BACKEND
    try {

        const response = await fetch(
            "http://localhost:8080/quiz/create",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            }
        );

        const result = await response.text();

        if (response.ok) {
            window.location.replace("addQuestions.html");
            console.log(result);
            document.getElementById("quizForm").reset();
        }

        else {
            if (result.includes("Questions")) {
                document.getElementById("questionError")
                    .innerText = result;
            }
            else if (result.includes("Duration")) {
                document.getElementById("durationError")
                    .innerText = result;
            }
            else if (result.includes("Start")) {
                document.getElementById("startDateError")
                    .innerText = result;
            }
            else if (result.includes("End")) {
                document.getElementById("endDateError")
                    .innerText = result;
            }
            else {
                console.log(result);
            }
        }

    }
    catch (error) {
        console.log(error);
    }
}


function goHome() {
    window.location.replace("adminDashboard.html");
}
