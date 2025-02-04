const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html"; // Redirect if not logged in
} else {
    document.getElementById("welcome-message").innerText = "Welcome to Your Dashboard!";
}
