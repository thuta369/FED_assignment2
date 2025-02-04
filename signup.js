document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const strengthLabel = document.getElementById("password-strength-label");
    const strengthBar = document.getElementById("password-strength-bar");

    // Validation elements
    const charCount = document.getElementById("char-count");
    const numberCheck = document.getElementById("number-check");
    const specialCharCheck = document.getElementById("special-char-check");
    const uppercaseCheck = document.getElementById("uppercase-check");

    passwordInput.addEventListener("input", function () {
        const password = passwordInput.value;
        const strength = checkPasswordStrength(password);

        // Reset classes
        strengthBar.className = "";

        // Apply strength class based on score
        if (strength === "weak") {
            strengthBar.classList.add("weak");
            strengthLabel.textContent = "Weak";
            strengthLabel.style.color = "red";
        } else if (strength === "medium") {
            strengthBar.classList.add("medium");
            strengthLabel.textContent = "Medium";
            strengthLabel.style.color = "orange";
        } else if (strength === "strong") {
            strengthBar.classList.add("strong");
            strengthLabel.textContent = "Strong";
            strengthLabel.style.color = "green";
        }

        // Update validation checklist
        updateValidation(password);
    });

    function checkPasswordStrength(password) {
        let strength = 0;

        if (password.length >= 8) strength++;  // Minimum length check
        if (/[A-Z]/.test(password)) strength++; // Uppercase letter check
        if (/[0-9]/.test(password)) strength++; // Number check
        if (/[\W]/.test(password)) strength++; // Special character check

        if (strength <= 1) return "weak";
        if (strength === 2) return "medium";
        return "strong";
    }

    function updateValidation(password) {
        charCount.classList.toggle("valid", password.length >= 8);
        charCount.classList.toggle("invalid", password.length < 8);

        numberCheck.classList.toggle("valid", /\d/.test(password));
        numberCheck.classList.toggle("invalid", !/\d/.test(password));

        specialCharCheck.classList.toggle("valid", /[\W]/.test(password));
        specialCharCheck.classList.toggle("invalid", !/[\W]/.test(password));

        uppercaseCheck.classList.toggle("valid", /[A-Z]/.test(password));
        uppercaseCheck.classList.toggle("invalid", !/[A-Z]/.test(password));
    }
});
