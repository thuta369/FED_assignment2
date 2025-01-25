// Sample array with data for the chats
const chatData = [
    { username: 'Username 1', product: 'Product Listing 1', messages: ['Hello!', 'How can I help?'] },
    { username: 'Username 2', product: 'Product Listing 2', messages: ['Is this product still available?', 'Yes, it is!'] },
    { username: 'Username 3', product: 'Product Listing 3', messages: ['Interested in your product', 'Great! Let me know if you have questions.'] },
    { username: 'Username 4', product: 'Product Listing 4', messages: ['Is this the best price?', 'It is, yes!'] },
    { username: 'Username 5', product: 'Product Listing 5', messages: ['Can I get more details?', 'Sure, ask away!'] },
    // Add more chat objects here
];

// Function to create and add chat items to the list
function loadChats() {
    const chatList = document.getElementById('chat-items');
    
    chatData.forEach((chat, index) => {
        const chatItem = document.createElement('li');
        chatItem.classList.add('chat-item');
        chatItem.setAttribute('onclick', `openChat(${index})`); // Pass index to open chat

        const profilePic = document.createElement('figure');
        profilePic.classList.add('profile-pic');

        const chatInfo = document.createElement('article');
        chatInfo.classList.add('chat-info');
        
        const username = document.createElement('p');
        username.classList.add('chat-username');
        username.textContent = chat.username;

        const product = document.createElement('p');
        product.classList.add('chat-product');
        product.textContent = chat.product;

        chatInfo.appendChild(username);
        chatInfo.appendChild(product);

        chatItem.appendChild(profilePic);
        chatItem.appendChild(chatInfo);

        chatList.appendChild(chatItem);
    });
}

// Function to open a chat by index
function openChat(chatIndex) {
    const chat = chatData[chatIndex]; // Get the chat data based on the index

    // Update chat window with the selected chat's information
    document.getElementById('chat-username').textContent = chat.username;
    document.getElementById('chat-product').textContent = chat.product;

    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = ''; // Clear any previous messages

    // Loop through the messages and display them
    chat.messages.forEach(message => {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
    });

    // Optionally, scroll to the bottom of the chat messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Call the function to load chats when the page is loaded
document.addEventListener('DOMContentLoaded', loadChats);


// FOR IMAGE PLACEHOLDER IN THE LISTING 
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagePlaceholder = document.querySelector('.image-placeholder');
            imagePlaceholder.style.backgroundImage = `url(${e.target.result})`;
            imagePlaceholder.style.backgroundSize = 'cover';
            imagePlaceholder.style.backgroundPosition = 'center';
            imagePlaceholder.innerHTML = ''; // Remove the "Click to upload an image" text
        };
        reader.readAsDataURL(file);
    }
}

