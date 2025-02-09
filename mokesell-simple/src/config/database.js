// src/config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true,
        sslmode: 'require'
    }
});

// Test the connection
const testConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('Database connected successfully:', result.rows[0]);
    } catch (err) {
        console.error('Database connection error:', err.message);
    }
};

testConnection();

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};