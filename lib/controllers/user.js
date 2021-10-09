const { Router } = require('express');
const UserService = require('../services/UserService.js');
const User = require('../models/User.js');
const ensureAuth = require('../middleware/ensureAuth.js');

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.verify(req.body);
      res.send(user);
    } catch (error) {
      error.status = 400;
      next(error);
    }
  })
  .post('/login', async (req, res, next) => {
    try {
      const login = await UserService.login(req.body);
      res.cookie('userId', login.id, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
      });
      res.send(login);
    } catch (error) {
      error.status = 401;
      next(error);
    }
  })
  .get('/me', ensureAuth, async (req, res, next) => {
    try {
      const id = req.userId;
      const user = await User.getById(id);
      res.send(user);
    } catch (error) {
      next(error);
    }
  });
