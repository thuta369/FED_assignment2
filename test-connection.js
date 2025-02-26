// test-connection.js
require('dotenv').config();
const { pool } = require('./src/config/database');

async function testDatabaseConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('Database connection successful!');
        console.log('Current timestamp from DB:', result.rows[0].now);
        client.release();
        pool.end();
    } catch (err) {
        console.error('Error testing database connection:', err);
    }
}

testDatabaseConnection();