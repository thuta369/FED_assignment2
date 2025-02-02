document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const togglePassword = document.querySelector(".toggle-password");
    const passwordStrengthBar = document.querySelector(".strength-progress");
    const strengthValue = document.getElementById("strength-value");
    const signupForm = document.getElementById("signupForm");
    const locationInput = document.getElementById("location");
    const detectLocationBtn = document.querySelector(".detect-location");

    // Toggle Password Visibility
    togglePassword.addEventListener("click", () => {
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    });

    // Password Strength Checker
    passwordInput.addEventListener("input", () => {
        const value = passwordInput.value;
        let strength = 0;

        if (value.length >= 8) strength++;
        if (/\d/.test(value)) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[!@#$%^&*]/.test(value)) strength++;

        const strengthLevels = ["Weak", "Fair", "Good", "Strong"];
        passwordStrengthBar.style.width = `${strength * 25}%`;
        strengthValue.textContent = strengthLevels[strength - 1] || "Weak";
        passwordStrengthBar.className = `strength-progress ${strengthLevels[strength - 1].toLowerCase()}`;
    });

    // Detect User Location
    detectLocationBtn.addEventListener("click", async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                const data = await response.json();
                locationInput.value = data.display_name || "Location not found";
            }, () => {
                alert("Could not detect location. Please enter manually.");
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });

    // Form Submission (Simulated API Call)
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            fullName: document.getElementById("fullName").value,
            email: document.getElementById("email").value,
            password: passwordInput.value,
            location: locationInput.value,
            phone: document.getElementById("phone").value,
            termsAccepted: document.getElementById("terms").checked
        };

        console.log("Submitting form data:", formData);
        alert("Form submitted successfully!");
    });
});
