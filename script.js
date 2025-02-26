// Global Variables
let currentChatId = null;
let cart = [];

// Modal Functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Authentication Functions
async function register(event) {
    event.preventDefault();
    const data = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value
    };

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            hideModal('registerModal');
            updateAuthUI(true);
            showNotification('Registration successful!', 'success');
            
            // Show prize wheel after successful registration
            showModal('prizeModal');
            showPrizeWheel();
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Registration failed', 'error');
    }
}

async function login(event) {
    event.preventDefault();
    const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            hideModal('loginModal');
            updateAuthUI(true);
            loadProducts();
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Login failed', 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    cart = [];
    updateCartCount();
    updateAuthUI(false);
}

// Notification Function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        border-radius: 5px;
        z-index: 1100;
        animation: fadeIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Product Functions
async function createProduct(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Please login first', 'error');
        return;
    }

    const data = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        image_url: document.getElementById('productImage').value || 'https://via.placeholder.com/250'
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            hideModal('sellModal');
            document.getElementById('sellForm').reset();
            loadProducts();
            showNotification('Product listed successfully!', 'success');
        } else {
            const error = await response.json();
            showNotification(error.message || 'Error creating listing', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error creating listing', 'error');
    }
}

async function loadProducts() {
    try {
        const searchQuery = document.getElementById('searchInput').value;
        let url = '/api/products';
        
        if (searchQuery) {
            url += `?search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error loading products', 'error');
    }
}

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    products.forEach(product => {
        const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
        const productForCart = {
            id: product.id,
            name: product.name,
            price: price,
            image_url: product.image_url,
            seller_id: product.seller_id
        };
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image_url || 'https://via.placeholder.com/250'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${price.toFixed(2)}</p>
            <p class="category">${product.category}</p>
            <div class="product-buttons">
                ${currentUser.id !== product.seller_id ? `
                    <button class="btn btn-primary" onclick='addToCart(${JSON.stringify(productForCart).replace(/'/g, "&#39;")})'>Add to Cart</button>
                    <button class="btn btn-secondary" onclick="contactSeller(${product.id}, ${product.seller_id}, '${product.name}', '${product.seller_name}')">Contact Seller</button>
                ` : '<p>Your Listing</p>'}
            </div>
        `;
        grid.appendChild(card);
    });
}

// Update the contactSeller function
async function contactSeller(productId, sellerId, productName, sellerName) {
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Please login to contact the seller', 'error');
        showModal('loginModal');
        return;
    }

    try {
        const response = await fetch('/api/chat/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: parseInt(productId),
                sellerId: parseInt(sellerId)
            })
        });

        if (!response.ok) {
            throw new Error('Error starting chat');
        }

        const chat = await response.json();
        currentChatId = chat.id;
        document.getElementById('chatWithUser').textContent = `${sellerName} about ${productName}`;
        showModal('chatModal');
        loadMessages(chat.id);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error starting chat', 'error');
    }
}

async function loadMessages(chatId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/chat/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error loading messages');
        }

        const messages = await response.json();
        displayMessages(messages);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error loading messages', 'error');
    }
}

function displayMessages(messages) {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    const userId = JSON.parse(localStorage.getItem('user')).id;

    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender_id === userId ? 'sent' : 'received'}`;
        messageDiv.textContent = message.content;
        container.appendChild(messageDiv);
    });

    container.scrollTop = container.scrollHeight;
}

async function sendMessage(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value.trim();

    if (!content) return;

    try {
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                chatId: currentChatId,
                content: content
            })
        });

        if (!response.ok) {
            throw new Error('Error sending message');
        }

        messageInput.value = '';
        await loadMessages(currentChatId);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error sending message', 'error');
    }
}

// Cart Functions
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    showNotification('Item added to cart!', 'success');
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function showCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image_url || 'https://via.placeholder.com/80'}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(itemDiv);
    });

    document.getElementById('cartTotal').textContent = total.toFixed(2);
    showModal('cartModal');
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartCount();
        showCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    showCart();
}

async function checkout() {
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Please login to checkout', 'error');
        hideModal('cartModal');
        showModal('loginModal');
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    try {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: cart,
                total_amount: total
            })
        });

        if (response.ok) {
            showNotification('Order placed successfully!', 'success');
            cart = [];
            updateCartCount();
            hideModal('cartModal');
        } else {
            const error = await response.json();
            showNotification(error.message || 'Error placing order', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error processing checkout', 'error');
    }
}

// UI Updates
function updateAuthUI(isLoggedIn) {
    document.getElementById('auth-buttons').classList.toggle('hidden', isLoggedIn);
    document.getElementById('user-buttons').classList.toggle('hidden', !isLoggedIn);
}

// Category Filter
function filterProducts(category = '') {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = category;
    }
    loadProducts();
}

function filterByCategory(category) {
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput ? searchInput.value : '';
    
    let url = '/api/products?';
    if (category) {
        url += `category=${encodeURIComponent(category)}&`;
    }
    if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error loading products', 'error');
        });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    updateAuthUI(!!token);
    loadProducts();
    updateCartCount();
});

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Prize Wheel Functions
function showPrizeWheel() {
    const canvas = document.getElementById('prizeWheel');
    const ctx = canvas.getContext('2d');
    const segments = 8;
    const prizes = [
        { label: '$5 Voucher', value: 5 },
        { label: '$10 Voucher', value: 10 },
        { label: '$15 Voucher', value: 15 },
        { label: '$20 Voucher', value: 20 },
        { label: '$25 Voucher', value: 25 },
        { label: '$30 Voucher', value: 30 },
        { label: '$40 Voucher', value: 40 },
        { label: '$50 Voucher', value: 50 }
    ];

    // Draw wheel
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    for (let i = 0; i < segments; i++) {
        const startAngle = (i * 2 * Math.PI) / segments;
        const endAngle = ((i + 1) * 2 * Math.PI) / segments;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? '#ffd75e' : '#ffffff';
        ctx.fill();
        ctx.stroke();

        // Add text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + (2 * Math.PI / segments) / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(prizes[i].label, radius - 20, 5);
        ctx.restore();
    }

    document.getElementById('spinButton').onclick = () => {
        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = true;
        const spins = 5;
        const randomPrize = Math.floor(Math.random() * segments);
        const totalRotation = (spins * 360) + (randomPrize * (360 / segments));
        
        // Calculate final position
        const finalAngle = totalRotation % 360;
        const segmentSize = 360 / segments;
        const landingSegment = Math.floor((360 - finalAngle) / segmentSize);
        const prize = prizes[landingSegment % segments];
        
        canvas.style.transform = `rotate(${totalRotation}deg)`;

        setTimeout(() => {
            showPrizeWon(prize);
        }, 4000);
    };
}

async function showPrizeWon(prize) {
    hideModal('prizeModal');
    const token = localStorage.getItem('token');

    try {
        // Save voucher to database
        const response = await fetch('/api/vouchers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                amount: prize.value,
                expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save voucher');
        }

        showNotification(`Congratulations! You've won a ${prize.label}!`, 'success');
    } catch (error) {
        console.error('Error saving voucher:', error);
        showNotification('Error saving your prize. Please try again.', 'error');
    }
}

// Carousel Functions
let currentSlide = 0;
let slideInterval;

function initializeCarousel() {
    const carousel = document.querySelector('.carousel-slide');
    const images = carousel.querySelectorAll('img');
    const dotsContainer = document.querySelector('.carousel-dots');

    // Create dots
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

    // Start auto-sliding
    startSlideShow();
}

function moveSlide(direction) {
    const carousel = document.querySelector('.carousel-slide');
    const images = carousel.querySelectorAll('img');
    
    stopSlideShow();
    
    currentSlide += direction;
    if (currentSlide >= images.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = images.length - 1;
    
    updateCarousel();
    startSlideShow();
}

function goToSlide(index) {
    stopSlideShow();
    currentSlide = index;
    updateCarousel();
    startSlideShow();
}

function updateCarousel() {
    const carousel = document.querySelector('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startSlideShow() {
    slideInterval = setInterval(() => moveSlide(1), 5000); // Change slide every 5 seconds
}

function stopSlideShow() {
    clearInterval(slideInterval);
}

// Initialize carousel when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
    // ... existing DOMContentLoaded code ...
});