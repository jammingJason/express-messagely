/** Database connection for messagely. */

const { Client } = require('pg');
const { DB_URI, DB_HOST, DB_PORT, DB_PW, DB_USER } = require('./config');

let dbName;

// If we're running in test "mode", use our test db
// Make sure to create both databases!
// if (process.env.NODE_ENV === 'test') {
//   dbName = 'lunchly_test';
// } else {
//   dbName = 'lunchly';
// }
const db = new Client(DB_URI, DB_HOST, DB_PORT, DB_PW, DB_USER);
// const db = new Client({
//   user: 'mysuper',
//   password: '1234',
//   database: dbName,
//   host: 'localhost',
//   port: 5432,
// });

db.connect();

module.exports = db;
