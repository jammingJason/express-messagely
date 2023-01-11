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
const messages = require('../models/message');

router.get('/:id', ensureCorrectUser, async (req, res, next) => {
  try {
    result = await messages.get(req.params.id);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post('/', ensureLoggedIn, async (req, res, next) => {
  try {
    const { from_username, to_username, body } = req.body;
    result = await messages.create({ from_username, to_username, body });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/read', ensureCorrectUser, async (req, res, next) => {
  try {
    result = await messages.markRead(req.params.id);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
