/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const db = require('../db');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR, SECRET_KEY, user_token } = require('../config');
const jwt = require('jsonwebtoken');
const {
  ensureLoggedIn,
  authenticateJWT,
  ensureAdmin,
} = require('../middleware/auth');
const newUser = require('../models/user');

router.post('/register', async function (req, res, next) {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    // console.log(username, password);
    if (!username || !password) {
      throw new ExpressError('Username and Password required!', 400);
    }
    const result = await newUser.register({
      username,
      password,
      first_name,
      last_name,
      phone,
    });

    return res.json(result.rows[0]);
  } catch (error) {
    // console.log(error);
    if (error.code === '23505') {
      return next(
        new ExpressError('That username is taken.  Please chose another.', 400)
      );
    }
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    console.log('Inside the login route');
    const { username, password } = req.body;
    if (!password || !username) {
      throw new ExpressError('You must use a username and password.');
    }
    // const hashPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const results = await newUser.authenticate(username, password);

    return res.json(results);
  } catch (error) {
    return next(error);
  }
});

router.get('/test', (req, res, next) => {
  res.send('Testing');
});
module.exports = router;
