const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Create new voucher
router.post('/', auth, async (req, res) => {
    try {
        const { amount, expiry_date } = req.body;
        
        const result = await db.query(
            'INSERT INTO vouchers (user_id, amount, expiry_date) VALUES ($1, $2, $3) RETURNING *',
            [req.userId, amount, expiry_date]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating voucher:', error);
        res.status(500).json({ error: 'Error creating voucher' });
    }
});

// Get user's vouchers
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM vouchers WHERE user_id = $1 AND used = false AND expiry_date > NOW() ORDER BY created_at DESC',
            [req.userId]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        res.status(500).json({ error: 'Error fetching vouchers' });
    }
});

// Use a voucher
router.post('/:id/use', auth, async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        
        // Check if voucher exists and is unused
        const voucherResult = await client.query(
            'SELECT * FROM vouchers WHERE id = $1 AND user_id = $2 AND used = false AND expiry_date > NOW() FOR UPDATE',
            [req.params.id, req.userId]
        );
        
        if (voucherResult.rows.length === 0) {
            throw new Error('Voucher not found or already used');
        }

        const voucher = voucherResult.rows[0];
        
        // Mark voucher as used
        await client.query(
            'UPDATE vouchers SET used = true WHERE id = $1',
            [voucher.id]
        );

        await client.query('COMMIT');
        res.json({ message: 'Voucher used successfully', amount: voucher.amount });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error using voucher:', error);
        res.status(500).json({ error: error.message || 'Error using voucher' });
    } finally {
        client.release();
    }
});

module.exports = router;