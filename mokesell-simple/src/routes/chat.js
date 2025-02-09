const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Start a new chat
router.post('/start', auth, async (req, res) => {
    try {
        const { productId, sellerId } = req.body;
        const buyerId = req.userId;

        // Validate inputs
        if (!productId || !sellerId) {
            return res.status(400).json({ error: 'Product ID and seller ID are required' });
        }

        // Make sure user isn't trying to chat with themselves
        if (buyerId === parseInt(sellerId)) {
            return res.status(400).json({ error: 'Cannot start chat with yourself' });
        }

        // Check if the product exists
        const productCheck = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if chat already exists
        const existingChat = await db.query(
            'SELECT * FROM chats WHERE product_id = $1 AND buyer_id = $2 AND seller_id = $3',
            [productId, buyerId, sellerId]
        );

        if (existingChat.rows.length > 0) {
            return res.json(existingChat.rows[0]);
        }

        // Create new chat
        const newChat = await db.query(
            'INSERT INTO chats (product_id, buyer_id, seller_id) VALUES ($1, $2, $3) RETURNING *',
            [productId, buyerId, sellerId]
        );

        res.status(201).json(newChat.rows[0]);
    } catch (error) {
        console.error('Error in chat/start:', error);
        res.status(500).json({ 
            error: 'Error starting chat',
            details: error.message
        });
    }
});

// Get all chats for a user
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                c.*,
                p.name as product_name,
                u.name as other_user_name
            FROM chats c
            JOIN products p ON c.product_id = p.id
            JOIN users u ON (
                CASE 
                    WHEN c.buyer_id = $1 THEN c.seller_id = u.id
                    ELSE c.buyer_id = u.id
                END
            )
            WHERE c.buyer_id = $1 OR c.seller_id = $1
            ORDER BY c.created_at DESC
        `, [req.userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Error fetching chats' });
    }
});

// Get messages for a specific chat
router.get('/:chatId', auth, async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.userId;

        // Verify user has access to this chat
        const chatAccess = await db.query(
            'SELECT * FROM chats WHERE id = $1 AND (buyer_id = $2 OR seller_id = $2)',
            [chatId, userId]
        );

        if (chatAccess.rows.length === 0) {
            return res.status(403).json({ error: 'Access denied to this chat' });
        }

        const messages = await db.query(`
            SELECT 
                m.*,
                u.name as sender_name
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.chat_id = $1
            ORDER BY m.created_at ASC
        `, [chatId]);

        res.json(messages.rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

// Send a message
router.post('/message', auth, async (req, res) => {
    try {
        const { chatId, content } = req.body;
        const senderId = req.userId;

        if (!chatId || !content) {
            return res.status(400).json({ error: 'Chat ID and content are required' });
        }

        // Verify user has access to this chat
        const chatAccess = await db.query(
            'SELECT * FROM chats WHERE id = $1 AND (buyer_id = $2 OR seller_id = $2)',
            [chatId, senderId]
        );

        if (chatAccess.rows.length === 0) {
            return res.status(403).json({ error: 'Access denied to this chat' });
        }

        const result = await db.query(
            'INSERT INTO messages (chat_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
            [chatId, senderId, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Error sending message' });
    }
});

module.exports = router;