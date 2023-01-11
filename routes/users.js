const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const db = require('../db');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require('../config');
const jwt = require('jsonwebtoken');
const {
  ensureLoggedIn,
  authenticateJWT,
  ensureCorrectUser,
} = require('../middleware/auth');
const newUser = require('../models/user');

router.get('/', ensureLoggedIn, async (req, res, next) => {
  try {
    // const results = await db.query('SELECT * FROM users');
    return res.json(await newUser.all());
  } catch (error) {
    next(error);
  }
});

router.get('/:username', ensureCorrectUser, async (req, res, next) => {
  try {
    const anotherUser = await newUser.get(req.params.username);
    // console.log(anotherUser);
    if (anotherUser.length === 0) {
      throw new ExpressError(
        `The user with the username of '${req.params.username}' can't be found.`,
        404
      );
    }
    return res.json(anotherUser);
  } catch (error) {
    next(error);
  }
});

router.get('/:username/from', ensureCorrectUser, async (req, res, next) => {
  try {
    const results = await newUser.messagesFrom(req.params.username);
    if (results.length === 0) {
      throw new ExpressError(
        `The user with the username of '${req.params.username}' can't be found.`,
        404
      );
    }
    return res.json(results);
  } catch (error) {
    next(error);
  }
});
router.get('/:username/to', ensureCorrectUser, async (req, res, next) => {
  try {
    const results = await newUser.messagesTo(req.params.username);

    if (results.length === 0) {
      throw new ExpressError(
        `The user with the username of '${req.params.username}' can't be found.`,
        404
      );
    }
    return res.json(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
