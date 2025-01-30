document.addEventListener("DOMContentLoaded", function () {
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatbox = document.getElementById("chatbox");
    const closeChat = document.getElementById("close-chat");
    const chatInput = document.getElementById("chat-input");
    const chatContent = document.getElementById("chat-content");

    // Toggle chatbox visibility
    chatbotBtn.addEventListener("click", () => {
        chatbox.classList.toggle("hidden");
    });

    closeChat.addEventListener("click", () => {
        chatbox.classList.add("hidden");
    });

    // AI Chatbot Responses
    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && chatInput.value.trim() !== "") {
            const userMsg = chatInput.value.trim();
            displayMessage("You", userMsg, "user");

            setTimeout(() => {
                const botReply = getBotResponse(userMsg);
                displayMessage("CarouBuddy", botReply, "bot");
            }, 1000);

            chatInput.value = "";
        }
    });

    function displayMessage(sender, message, type) {
        const msgElement = document.createElement("p");
        msgElement.textContent = message;
        msgElement.classList.add(type);
        chatContent.appendChild(msgElement);
        chatContent.scrollTop = chatContent.scrollHeight;
    }

    function getBotResponse(userInput) {
        userInput = userInput.toLowerCase();

        const responses = {
            "hello": "Hi there! How can I assist you?",
            "report user": "To report a user, go to their profile and click 'Report'.",
            "order status": "Please check your order tracking in 'My Purchases'.",
            "withdraw money": "Ensure your account is verified for withdrawals.",
            "default": "I'm sorry, I don't understand. Can you rephrase?",
        };

        for (let key in responses) {
            if (userInput.includes(key)) {
                return responses[key];
            }
        }
        return responses["default"];
    }
});
