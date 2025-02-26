const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { items, total_amount } = req.body;
        
        // Create order
        const orderResult = await client.query(
            'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
            [req.userId, total_amount, 'pending']
        );
        
        const order = orderResult.rows[0];

        // Create order items
        for (const item of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [order.id, item.id, item.quantity, item.price]
            );
        }

        await client.query('COMMIT');
        res.status(201).json(order);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error creating order' });
    } finally {
        client.release();
    }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
    try {
        const ordersResult = await db.query(`
            SELECT 
                o.*,
                json_agg(json_build_object(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'name', p.name
                )) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [req.userId]);

        res.json(ordersResult.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

module.exports = router;