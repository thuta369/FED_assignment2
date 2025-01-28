// Simulate chat data
const chatData = [
    {
        username: "Alice",
        product: "Vintage Watch",
        status: "Online 10 mins ago",
        price: "$500" ,
        messages: [
            { sender: "Alice", message: "Hey, is the watch still available?" },
            { sender: "You", message: "Yes, it's still available!" }
        ]
    },
    {
        username: "Bob",
        product: "Old Camera",
        price: "$150",
        status: "Offline 2 hours ago",
        messages: [
            { sender: "Bob", message: "Can you send more pictures?" },
            { sender: "You", message: "Sure! I will send them shortly." }
        ]
    }
];

// Variables for dynamically updating chat content
const chatList = document.getElementById('chat-items');
const chatMessagesSection = document.getElementById('chat-messages');
const chatUsername = document.getElementById('chat-username');
const chatProduct = document.getElementById('chat-product');
const chatStatus = document.getElementById('chat-status');
const messageInput = document.getElementById('message-input');

// Function to load the chat list dynamically
function loadChatList() {
    chatList.innerHTML = ''; // Clear the list before loading new items

    chatData.forEach((chat, index) => {
        const chatItem = document.createElement('li');
        chatItem.classList.add('chat-item');
        chatItem.setAttribute('onclick', `openChat(${index})`);

        chatItem.innerHTML = `
            <figure class="profile-pic"></figure>
            <article class="chat-info">
                <p class="chat-username">${chat.username}</p>
                <p class="chat-product">${chat.product}</p>
            </article>
        `;

        chatList.appendChild(chatItem);
    });
}

// Function to open a specific chat
function openChat(chatIndex) {
    const selectedChat = chatData[chatIndex];

    // Update chat header information
    chatUsername.textContent = selectedChat.username;
    chatProduct.textContent = selectedChat.product;
    chatStatus.textContent = selectedChat.status;
    
    // Display the price next to the product name
    const chatProductInfo = document.getElementById('chat-product-info');
    const chatPrice = document.getElementById('chat-price');
    
    // Ensure the price is updated dynamically
    chatPrice.textContent = selectedChat.price;

    // Clear previous messages and load the new ones
    chatMessagesSection.innerHTML = ''; 
    selectedChat.messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(msg.sender === "You" ? 'message-you' : 'message-other');
        messageDiv.textContent = msg.message;
        chatMessagesSection.appendChild(messageDiv);
    });

    // Scroll to the bottom of the chat window
    chatMessagesSection.scrollTop = chatMessagesSection.scrollHeight;
}

// Function to send a new message
function sendMessage() {
    const newMessage = messageInput.value.trim();

    if (newMessage) {
        // Find the currently active chat
        const currentChatIndex = chatData.findIndex(chat => chat.username === chatUsername.textContent);
        const currentChat = chatData[currentChatIndex];

        // Append the new message to the chat data
        currentChat.messages.push({ sender: "You", message: newMessage });

        // Add the new message to the chat window
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-you');
        messageDiv.textContent = newMessage;
        chatMessagesSection.appendChild(messageDiv);

        // Clear the input field
        messageInput.value = '';

        // Scroll to the latest message
        chatMessagesSection.scrollTop = chatMessagesSection.scrollHeight;
    }
}

// Load the chat list when the page loads
window.onload = loadChatList;
