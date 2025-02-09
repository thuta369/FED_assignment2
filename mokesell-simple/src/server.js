const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const chatRoutes = require('./routes/chat');
const orderRoutes = require('./routes/orders');
const voucherRoutes = require('./routes/vouchers');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Import database configuration
const db = require('./config/database');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vouchers', voucherRoutes);

// Health check route
app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ 
            status: 'ok', 
            message: 'Server is running',
            dbTime: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'Database connection failed'
        });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Handle HTML5 history routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
});