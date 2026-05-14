document.getElementById("quizForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", document.getElementById("title").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("totalQuestions", document.getElementById("noOfQuestions").value);
    formData.append("duration", document.getElementById("duration").value);
    formData.append("startDate", document.getElementById("startDate").value);
    formData.append("endDate", document.getElementById("endDate").value);
    formData.append("author", document.getElementById("author").value);

    // MUST match backend name exactly: "image"
    formData.append("image", document.getElementById("imgUrl").files[0]);

    const res = await fetch("http://localhost:8080/admin/quiz/test", {
        method: "POST",
        body: formData   // NO headers
    });

    const data = await res.text();
    console.log(data);
});


function formatDate(inputDate) {
    const [year, month, day] = inputDate.split("-");
    return `${day}-${month}-${year}`;
}


function goHome(){
    window.location.replace("adminDashboard.html");
}
