const userTableBody = document.getElementById("userTableBody");

const searchInput = document.getElementById("searchInput");

let allUsers = [];

function loadUsers() {

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/admin/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })

        .then((response) => {

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            return response.json();
        })

        .then((data) => {

            allUsers = data;

            displayUsers(allUsers);
        })

        .catch((error) => {

            console.error("Error:", error);

            userTableBody.innerHTML = `
            <div class="text-danger text-center fw-bold mt-3">
                Failed to load users
            </div>
        `;
        });
}

function displayUsers(users) {

    userTableBody.innerHTML = "";

    if (users.length === 0) {

        userTableBody.innerHTML = `
            <div class="text-center fw-bold mt-3">
                No users found
            </div>
        `;

        return;
    }

    users.forEach((user) => {

        const row = document.createElement("div");

        row.className = "users-row";

        row.innerHTML = `

            <div>${user.userId}</div>

            <div>${user.name}</div>

            <div>${user.email}</div>

            <div>${formatDate(user.createdAt)}</div>

            <div>

                <button
                    class="action-btn bg-danger"
                    onclick="deleteUser(${user.userId})"
                >
                    <i class="bi bi-trash-fill"></i>
                </button>

            </div>
        `;

        userTableBody.appendChild(row);
    });
}

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function deleteUser(userId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    fetch(`http://localhost:8080/admin/users/${userId}`, {
        method: "DELETE"
    })

        .then((response) => {

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            alert("User deleted successfully");
            loadUsers();
        })

        .catch((error) => {

            console.error("Error:", error);
            alert("Unable to delete user");
        });
}

searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value.toLowerCase();

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
    );

    displayUsers(filteredUsers);
});

loadUsers();


function goHome() {
    window.location.href = "adminDashboard.html";
}

