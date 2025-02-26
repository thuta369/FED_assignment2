document.querySelector(".search-bar").addEventListener("input", function () {
    let searchQuery = this.value.toLowerCase();
    let chatItems = document.querySelectorAll(".chat-item");

    chatItems.forEach(chat => {
        let chatName = chat.querySelector("strong").innerText.toLowerCase();
        if (chatName.includes(searchQuery)) {
            chat.style.display = "flex"; // Show matching chat
        } else {
            chat.style.display = "none"; // Hide non-matching chats
        }
    });
});

// Store chat conversations dynamically
let chatConversations = {
    "Sarah Chen": [
        { sender: "Sarah", text: "Is this still available?" },
        { sender: "You", text: "Yes, it is! When would you like to meet?" },
        { sender: "Sarah", text: "I can come tomorrow at noon." }
    ],
    "Mike Johnson": [
        { sender: "Mike", text: "Great! I can meet tomorrow." },
        { sender: "You", text: "Sounds good! Where?" },
        { sender: "Mike", text: "How about at the mall?" }
    ],
    "Emma Wilson": [
        { sender: "Emma", text: "Can you do $50?" },
        { sender: "You", text: "I can do $55, final price." },
        { sender: "Emma", text: "Deal! When can we meet?" }
    ],
    "John Carter": [
        { sender: "John", text: "Does it come with the charger?" },
        { sender: "You", text: "Yes, it includes the charger and box." },
        { sender: "John", text: "Nice! I'll take it." }
    ]
};

// Keep track of active chat
let activeChat = "";

// Redirect to home page
function goToHome() {
    window.location.href = "index.html";
}

// Open a chat and load messages
function openChat(user, profilePic, itemName, itemPrice) {
    activeChat = user;

    // Update chat title
    document.getElementById("chat-title").innerText = user;

    // Update profile picture
    document.getElementById("chat-pic").src = profilePic;

    // Only show item name and price (remove image)
    document.getElementById("item-info").innerHTML = `${itemName} - ${itemPrice}`;

    // Clear and load chat messages
    let chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = "";
    
    if (!chatConversations[user]) {
        chatConversations[user] = [];
    }

    chatConversations[user].forEach(msg => appendMessage(msg.sender, msg.text));

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Append message dynamically to chat window
function appendMessage(sender, text) {
    let chatMessages = document.getElementById("chat-messages");
    let message = document.createElement("p");
    message.className = `message ${sender === "You" ? "sent" : "received"}`;
    message.innerText = text;
    chatMessages.appendChild(message);
}

// Improved Auto-Reply Responses
const autoReplies = {
    "Sarah Chen": [
        "Okay! I'll confirm the time later.",
        "Can I pick it up in the evening instead?",
        "Is there any discount if I buy two?",
        "Sounds good! Can you hold it for me until tomorrow?"
    ],
    "Mike Johnson": [
        "Mall sounds perfect. See you then!",
        "Would you prefer cash or bank transfer?",
        "Let me know if you're running late!",
        "Is there a parking spot near the meeting place?"
    ],
    "Emma Wilson": [
        "Great! Can we meet at 4 PM?",
        "Can you hold it for me until the weekend?",
        "I'll need to check with my partner first!",
        "Can you send me more pictures of the item?"
    ],
    "John Carter": [
        "Awesome! I'll buy it today.",
        "Does it come with any warranty?",
        "Is there a return policy if there's an issue?",
        "Would you consider a trade for another item?"
    ]
};

// Function to send a message
function sendMessage() {
    if (!activeChat) return;

    let input = document.getElementById("messageInput");
    let messageText = input.value.trim();
    if (messageText === "") return;

    // Store sent message
    chatConversations[activeChat].push({ sender: "You", text: messageText });

    // Append to chat window
    appendMessage("You", messageText);

    input.value = "";
    let chatMessages = document.getElementById("chat-messages");
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate a reply after 1 second
    setTimeout(() => {
        if (autoReplies[activeChat]) {
            let randomReply = autoReplies[activeChat][Math.floor(Math.random() * autoReplies[activeChat].length)];

            // Store received message
            chatConversations[activeChat].push({ sender: activeChat, text: randomReply });

            // Append received message
            appendMessage(activeChat, randomReply);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 1000);
}

// Allow sending messages by pressing Enter
document.getElementById("messageInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default new line behavior
        sendMessage();
    }
});
