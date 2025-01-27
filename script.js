const adContainer = document.querySelector('.ad-container');
const dots = document.querySelectorAll('.dot');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

let currentAdIndex = 0;
const totalAds = dots.length;

function showAd(index) {
    const transformValue = `translateX(-${index * 100}%)`;
    adContainer.style.transform = transformValue;

    // Update active dot
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

function autoScrollAds() {
    currentAdIndex = (currentAdIndex + 1) % totalAds;
    showAd(currentAdIndex);
}

const autoScrollInterval = setInterval(autoScrollAds, 3000);

// Manual Navigation: Dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(autoScrollInterval);
        currentAdIndex = index;
        showAd(index);
    });
});

// Manual Navigation: Arrows
leftArrow.addEventListener('click', () => {
    clearInterval(autoScrollInterval);
    currentAdIndex = (currentAdIndex - 1 + totalAds) % totalAds;
    showAd(currentAdIndex);
});

rightArrow.addEventListener('click', () => {
    clearInterval(autoScrollInterval);
    currentAdIndex = (currentAdIndex + 1) % totalAds;
    showAd(currentAdIndex);
});


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


// FOR CARTS ADDING REMOVING UPDATING
// Sample cart data (This should come from a backend or local storage)
let cartItems = [
    { id: 1, name: "Item 1", price: 19.99, quantity: 2 },
    { id: 2, name: "Item 2", price: 29.99, quantity: 1 },
    { id: 3, name: "Item 3", price: 9.99, quantity: 3 },
];

// Function to render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    
    cartItemsContainer.innerHTML = ""; // Clear existing items
    let total = 0;

    cartItems.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                ${item.quantity}
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button onclick="removeItem(${item.id})">Remove</button></td>
        `;

        cartItemsContainer.appendChild(row);
        total += item.price * item.quantity;
    });

    // Update the total amount
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Function to update quantity of an item
function updateQuantity(itemId, change) {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            item.quantity = 1; // Prevent quantity from going below 1
        }
        renderCart(); // Re-render the cart after update
    }
}

// Function to remove an item from the cart
function removeItem(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    renderCart(); // Re-render the cart after removal
}

// Initial render of the cart
renderCart();

// Checkout button functionality
document.querySelector(".checkout-btn").addEventListener("click", function() {
    if (cartItems.length > 0) {
        alert("Proceeding to checkout...");
        // You can redirect to checkout page or handle checkout logic here
    } else {
        alert("Your cart is empty!");
    }
});



