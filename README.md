# 🛒 **MokeSell - Online Marketplace**  

**FED Assignment 2**  
👥 **Developed by:** Thuta & Anderson (Xu Feng)  

---

## 📌 **About MokeSell**  
MokeSell is an **online marketplace** designed for users to **buy and sell second-hand items** across various categories, including:  
🛍️ **Clothes**  
📱 **Electronics**  
🧸 **Toys**  
🎀 **Accessories**  

This platform enables **sellers** to list products for sale and **buyers** to browse, view, and purchase items seamlessly.

---

## 🎨 **Design & User Experience**  
✨ **Figma** was used to design a modern and intuitive UI.  
🎞️ **Lottie animations** enhance engagement in the *"Sell and Buy on MokeSell"* section.  

---

## 🌟 **Key Features**  

### 🛍️ **1. Product Listings**  
✅ **Sellers** can list products for sale.  
✅ **Buyers** can browse and search for items.  
✅ **Search bar** enables quick product discovery.  

### 🎡 **2. Lucky Spin Wheel**  
🎉 First-time users can **spin the wheel** for discount vouchers.  
🎯 Encourages new users to **sign up and engage** with MokeSell.  

### 🔐 **3. Secure Authentication**  
🔑 Secure **sign-up and login** using **Node.js, Express.js, and PostgreSQL**.  
🛡️ **bcrypt password hashing** ensures user security.  
🚪 Includes a **logout function**.  

### 💬 **4. User Chat System**  
📢 Buyers and sellers can **chat** to negotiate deals.  
🔎 **Search for chat users** by name.  
🗂️ **Chat history is stored** for future reference.  

### 📩 **5. Contact Form**  
📞 Users can **submit inquiries or complaints** via a form.  
✅ A **popup confirmation message** appears upon submission.  

### 🤖 **6. Help Center & AI Chatbot**  
📌 **Interactive chatbot** assists users with common questions.  
📚 Includes a **Frequently Asked Questions (FAQ)** section.  

### 🛒 **7. Checkout & Payments**  
🛍️ Add items to the **cart** and proceed to **checkout**.  
💰 Automatically calculates the **total price** of selected items.  
📦 Orders are **stored in the database** for tracking.  

---

## 🛠️ **Backend Technologies Used**  

### 📊 **Database: PostgreSQL**  
✔️ Stores **user authentication, chats, and product listings**.  

### 🖥️ **Backend Framework: Express.js (Node.js)**  
✔️ Manages **API requests and user interactions**.  

### 🔐 **Authentication & Security**  
✔️ Uses **JSON Web Tokens (JWT)** for secure authentication.  
✔️ Implements **bcrypt** for **password hashing**.  

---

## 📡 **API Routes**  

### **Authentication Routes (/api/auth)**  
🔹 **POST /api/auth/register** - Register a new user  
🔹 **POST /api/auth/login** - Login user  

### **Product Routes (/api/products)**  
🔹 **GET /api/products** - Get all products (with optional category and search filters)  
🔹 **POST /api/products** - Create new product (authenticated)  
🔹 **GET /api/products/my-listings** - Get seller's products (authenticated)  
🔹 **DELETE /api/products/:id** - Delete a product (authenticated)  

### **Chat Routes (/api/chat)**  
🔹 **POST /api/chat/start** - Start a new chat (authenticated)  
🔹 **GET /api/chat** - Get all chats for a user (authenticated)  
🔹 **GET /api/chat/:chatId** - Get messages for a specific chat (authenticated)  
🔹 **POST /api/chat/message** - Send a new message (authenticated)  

### **Order Routes (/api/orders)**  
🔹 **POST /api/orders** - Create new order (authenticated)  

### **Voucher Routes (/api/vouchers)**  
🔹 **POST /api/vouchers** - Create new voucher (authenticated)  
🔹 **GET /api/vouchers** - Get user's vouchers (authenticated)  
🔹 **POST /api/vouchers/:id/use** - Use a voucher (authenticated)  

---

## 📹 **Demo & Additional Resources**  
🎥 **Video Walkthrough:** [Google Drive Link](https://drive.google.com/drive/folders/1YeyLz6gSkmfGvlkosGwtwu8FOXLmMqih?usp=drive_link)  
