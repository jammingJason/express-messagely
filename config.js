/** Common config for message.ly */

// read .env files and make environmental variables

require('dotenv').config();

const DB_URI = process.env.NODE_ENV === 'test' ? 'messagely_test' : 'messagely';
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PW = process.env.DB_PW;
const SECRET_KEY = process.env.SECRET_KEY || 'secret';
let user_token;
const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  DB_USER,
  DB_PW,
  DB_HOST,
  DB_PORT,
  user_token,
};
