const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = `
            SELECT p.*, u.name as seller_name 
            FROM products p 
            JOIN users u ON p.seller_id = u.id 
            WHERE 1=1
        `;
        const values = [];

        if (category) {
            values.push(category);
            query += ` AND p.category = $${values.length}`;
        }

        if (search) {
            values.push(`%${search}%`);
            query += ` AND (p.name ILIKE $${values.length} OR p.description ILIKE $${values.length})`;
        }

        query += ' ORDER BY p.created_at DESC';

        const result = await db.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

// Create new product
router.post('/', auth, async (req, res) => {
    try {
        const { name, price, description, category, image_url } = req.body;
        const result = await db.query(
            `INSERT INTO products (name, price, description, category, seller_id, image_url)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name, price, description, category, req.userId, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Error creating product' });
    }
});

// Get seller's products
router.get('/my-listings', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC',
            [req.userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching seller products:', error);
        res.status(500).json({ error: 'Error fetching your listings' });
    }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM products WHERE id = $1 AND seller_id = $2 RETURNING *',
            [req.params.id, req.userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found or not authorized' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
});

module.exports = router;