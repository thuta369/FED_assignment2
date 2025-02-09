// Smooth FAQ Toggle
function toggleFAQ(id) {
    let faq = document.getElementById("faq" + id);
    if (faq.style.display === "block") {
        faq.style.opacity = "0";
        setTimeout(() => faq.style.display = "none", 300);
    } else {
        faq.style.display = "block";
        faq.style.opacity = "0";
        setTimeout(() => faq.style.opacity = "1", 10);
    }
}

// Open and Close Chatbox with Animation
function toggleChat() {
    let chatbox = document.getElementById("chatbox");
    chatbox.classList.toggle("open");
}

// Handle Enter Key for Sending Message
function handleEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Send User Message and AI Response
function sendMessage() {
    let input = document.getElementById("chatbox-input");
    let message = input.value.trim();
    if (message === "") return;

    let chatbox = document.getElementById("chatbox-messages");

    // Display User Message
    let userMessage = document.createElement("div");
    userMessage.className = "message user-message";
    userMessage.textContent = message;
    chatbox.appendChild(userMessage);
    chatbox.scrollTop = chatbox.scrollHeight;

    // Show Typing Indicator
    let typingIndicator = document.createElement("div");
    typingIndicator.className = "message ai-message";
    typingIndicator.textContent = "Typing...";
    chatbox.appendChild(typingIndicator);
    chatbox.scrollTop = chatbox.scrollHeight;

    // Generate AI Response after a Delay
    setTimeout(() => {
        typingIndicator.remove();
        let aiMessage = document.createElement("div");
        aiMessage.className = "message ai-message";
        aiMessage.textContent = generateAIResponse(message);
        chatbox.appendChild(aiMessage);
        chatbox.scrollTop = chatbox.scrollHeight;
    }, 1000);

    input.value = "";
}

// AI Response Generator with Smarter Replies
function generateAIResponse(message) {
    message = message.toLowerCase();

    if (message.includes("get started")) {
        return "To get started, create an account and explore our platform. Let me know if you need any help!";
    }
    if (message.includes("payment methods")) {
        return "We accept credit cards, PayPal, and bank transfers.";
    }
    if (message.includes("reset password")) {
        return "You can reset your password by clicking 'Forgot Password' on the login page.";
    }
    if (message.includes("contact support")) {
        return "Our support team is available 24/7 via live chat or email.";
    }
    if (message.includes("refund") || message.includes("return")) {
        return "If you need a refund or return, please visit our refund policy page or contact our support team.";
    }
    if (message.includes("shipping") || message.includes("delivery")) {
        return "Shipping times vary by location. You can track your order under 'My Orders' in your account.";
    }
    if (message.includes("order status")) {
        return "You can check your order status by logging into your account and going to 'My Orders'. Let me know if you need further assistance.";
    }

    // Random Fallback Responses
    let fallbackResponses = [
        "I'm here to help! Can you provide more details?",
        "That’s a great question! Let me find the best answer for you.",
        "I’m not sure about that, but you can visit our Help Center for more information.",
        "Could you clarify your question so I can assist better?",
        "I may not have the exact answer, but our support team is always available!"
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}
