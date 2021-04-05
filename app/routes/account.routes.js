module.exports = app => {
  const accounts = require('../controllers/account.controller.js');

  var router = require('express').Router();

  // Create a new account
  router.post("/", accounts.create);

  // Retrieve all accounts
  router.get('/', accounts.findAll);

  // Retrieve all elite
  router.get('/elite', accounts.findPremium)

  // Retrieve a single account
  router.get('/:id', accounts.findOne);

  // Update an account with id
  router.put('/:id', accounts.update);

  // Delete an account with id
  router.delete('/:id', accounts.delete)

  // Delete all accounts
  router.delete('/', accounts.deleteAll);

  app.use('/api/accounts', router);
}