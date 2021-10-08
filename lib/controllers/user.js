const { Router } = require('express');
const UserService = require('../services/UserService.js');

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.verify(req.body);
      res.send(user);
    } catch (error) {
      next(error);
    }
  });
