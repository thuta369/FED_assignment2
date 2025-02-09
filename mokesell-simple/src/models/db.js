// src/models/db.js
const db = require('../config/database');

const User = {
    async create({ name, email, password, phone }) {
        const query = {
            text: 'INSERT INTO users(name, email, password, phone) VALUES($1, $2, $3, $4) RETURNING id, name, email, phone',
            values: [name, email, password, phone],
        };
        try {
            const result = await db.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async findByEmail(email) {
        const query = {
            text: 'SELECT * FROM users WHERE email = $1',
            values: [email],
        };
        try {
            const result = await db.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
};

const Product = {
    async create({ name, price, description, category, seller_id, image_url }) {
        const query = {
            text: 'INSERT INTO products(name, price, description, category, seller_id, image_url) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            values: [name, price, description, category, seller_id, image_url],
        };
        try {
            const result = await db.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async findAll({ limit = 10, offset = 0, category = null }) {
        let query = {
            text: 'SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.seller_id = u.id',
            values: [],
        };
        
        if (category) {
            query.text += ' WHERE category = $1';
            query.values.push(category);
        }
        
        query.text += ' ORDER BY created_at DESC LIMIT $' + (query.values.length + 1) + ' OFFSET $' + (query.values.length + 2);
        query.values.push(limit, offset);

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    async findBySeller(seller_id) {
        const query = {
            text: 'SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC',
            values: [seller_id],
        };
        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
};

const Order = {
    async create({ user_id, total_amount, shipping_address }) {
        const query = {
            text: 'INSERT INTO orders(user_id, total_amount, shipping_address) VALUES($1, $2, $3) RETURNING *',
            values: [user_id, total_amount, shipping_address],
        };
        try {
            const result = await db.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
};

module.exports = {
    User,
    Product,
    Order
};