// Sample data for chats
const chats = [
    {
        id: 1,
        username: "Sarah Parker",
        profilePic: "https://i.pravatar.cc/150?img=1",
        item: "Vintage Camera",
        price: "$299",
        messages: []
    },
    {
        id: 2,
        username: "Mike Johnson",
        profilePic: "https://i.pravatar.cc/150?img=2",
        item: "Mountain Bike",
        price: "$450",
        messages: []
    },
    {
        id: 3,
        username: "Emma Wilson",
        profilePic: "https://i.pravatar.cc/150?img=3",
        item: "Guitar",
        price: "$199",
        messages: []
    }
];

let currentChat = null;

// Initialize chat list
function initializeChatList() {
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';

    chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.onclick = () => selectChat(chat);
        
        chatItem.innerHTML = `
            <img src="${chat.profilePic}" alt="${chat.username}">
            <div class="chat-item-info">
                <div class="chat-item-header">
                    <span class="username">${chat.username}</span>
                    <span class="price">${chat.price}</span>
                </div>
                <div class="item-name">${chat.item}</div>
            </div>
        `;
        
        chatList.appendChild(chatItem);
    });
}

// Select a chat
function selectChat(chat) {
    currentChat = chat;
    
    // Update header
    const chatHeader = document.getElementById('chatHeader');
    chatHeader.innerHTML = `
        <img src="${chat.profilePic}" alt="${chat.username}">
        <div class="chat-item-info">
            <div class="chat-item-header">
                <span class="username">${chat.username}</span>
                <span class="price">${chat.price}</span>
            </div>
            <div class="item-name">${chat.item}</div>
        </div>
    `;
    
    // Clear messages
    document.getElementById('messages').innerHTML = '';
    
    // Display existing messages
    displayMessages();
    
    // Update active chat in the list
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
        if (item.querySelector('.username').textContent === chat.username) {
            item.classList.add('active');
        }
    });
}

// Send a message
function sendMessage() {
    if (!currentChat) return;
    
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        currentChat.messages.push({
            text: message,
            sent: true,
            timestamp: new Date()
        });
        
        // Clear input
        input.value = '';
        
        // Display messages
        displayMessages();
        
        // Simulate reply after 1 second
        setTimeout(() => {
            const replies = [
                "Thanks for your message!",
                "Yes, the item is still available.",
                "Would you like to make an offer?",
                "I can meet tomorrow if that works for you.",
                "The price is negotiable."
            ];
            
            currentChat.messages.push({
                text: replies[Math.floor(Math.random() * replies.length)],
                sent: false,
                timestamp: new Date()
            });
            
            displayMessages();
        }, 1000);
    }
}

// Display messages
function displayMessages() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';
    
    currentChat.messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sent ? 'sent' : 'received'}`;
        messageDiv.textContent = message.text;
        messagesContainer.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Initialize the chat interface
initializeChatList();

// Add enter key listener for sending messages
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});