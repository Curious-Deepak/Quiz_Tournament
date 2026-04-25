// Search Handling
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchInput").addEventListener("input", searchQuiz);
});

function viewResult(btn) {
    const title = btn.closest('.card').querySelector('.card-title').innerText;
    alert("Opening result for : " + title);
}

function searchQuiz() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".card");
    const noResult = document.getElementById("noResult");

    let found = false;

    cards.forEach(card => {
        const title = card.querySelector(".card-title").innerText.toLowerCase();

        if (title.includes(input)) {
            card.style.display = "block";
            found = true;
        } else {
            card.style.display = "none";
        }
    });

    noResult.style.display = found ? "none" : "block";
}