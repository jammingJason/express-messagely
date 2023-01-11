/** User class for message.ly */
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require('../config');
const jwt = require('jsonwebtoken');
const ExpressError = require('../expressError');
const db = require('../db');
/** User of the site. */

class User {
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    // hash password
    const hashPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    // save to db

    let now = Date().split('-');
    const result = await db.query(
      `INSERT INTO users 
  (username, password, first_name, last_name, phone, join_at) 
    VALUES ($1, $2, $3, $4, $5, '${now[0]}') RETURNING username, password, first_name, last_name`,
      [username, hashPw, first_name, last_name, phone]
    );
    return result;
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username, password FROM users 
        WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        // console.log('LOGGED IN');
        const token = jwt.sign({ username }, SECRET_KEY);
        // console.log('This is the token: ' + token);
        await User.updateLoginTimestamp(username);
        return { token: token };
      }
    }
    throw new ExpressError(
      'Cannot find that username.  Please try again.',
      400
    );
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const now = Date().split('-');

    await db.query(
      `UPDATE users SET last_login_at=$1 
    WHERE username=$2`,
      [now[0], username]
    );
    return true;
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const results = await db.query(
      `SELECT username, first_name, last_name, phone FROM users`
    );
    // console.log(results.rows[0]);
    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name,phone, join_at, last_login_at 
    FROM users WHERE username = $1`,
      [username]
    );
    return result.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const results = await db.query(
      `SELECT m.body, m.to_username, m.from_username 
    FROM messages AS m
    WHERE from_username = $1`,
      [username]
    );
    return results.rows;
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const results = await db.query(
      `SELECT m.body, m.to_username, m.from_username 
    FROM messages AS m
    WHERE to_username = $1`,
      [username]
    );
    return results.rows;
  }
}

module.exports = User;
