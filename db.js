/** Database connection for messagely. */

const { Client } = require('pg');
const { DB_URI, DB_HOST, DB_PORT, DB_PW, DB_USER } = require('./config');

let dbName;

// If we're running in test "mode", use our test db
// Make sure to create both databases!

const db = new Client({
  user: DB_USER,
  password: DB_PW,
  database: DB_URI,
  host: DB_HOST,
  port: DB_PORT,
});

db.connect();

module.exports = db;
