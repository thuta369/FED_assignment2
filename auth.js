import { registerUser, loginUser } from "./API.js";

// Handle User Registration
document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const phone = document.getElementById("signup-phone").value;
    const password = document.getElementById("signup-password").value;

    const result = await registerUser(name, email, phone, password);

    if (result.message === "User registered successfully") {
        alert("Registration successful! Please log in.");
        window.location.href = "login.html";
    } else {
        alert(result.message);
    }
});

// Handle User Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const result = await loginUser(email, password);

    if (result.token) {
        localStorage.setItem("token", result.token); // Save token in local storage
        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } else {
        alert(result.message);
    }
});
