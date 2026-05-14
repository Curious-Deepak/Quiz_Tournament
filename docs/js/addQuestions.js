let questionCount = 1;

window.onload = function () {
    const container = document.getElementById("questionContainer");

    const firstBlock = container.querySelector(".question-block");
    if (firstBlock) {
        setQuestionNumber(firstBlock, questionCount);
    }
};

function addQuestion() {
    const container = document.getElementById("questionContainer");

    questionCount++;

    const block = document.createElement("div");
    block.className = "question-block";

    block.innerHTML = `
        <h5 class="fw-bold mb-3"> Question ${questionCount}</h5>

        <input type="text" class="form-control mb-4" placeholder="Enter question">

        <h6 class="form-label fw-bold">Options</h6>
        <input type="text" class="form-control mb-3" placeholder="Option 1">
        <input type="text" class="form-control mb-3" placeholder="Option 2">
        <input type="text" class="form-control mb-3" placeholder="Option 3">
        <input type="text" class="form-control mb-3" placeholder="Option 4">
    `;

    container.appendChild(block);
}

function setQuestionNumber(block, number) {
    const title = document.createElement("h5");
    title.className = "mb-3 fw-bold";
    title.innerText = `Question ${number}`;
    block.prepend(title);
}

