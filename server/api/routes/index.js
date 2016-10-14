var express = require('express');
var router = express.Router();

var ctrlUsers = require('../controllers/users.controllers.js');
var ctrlCharacters = require('../controllers/characters.controllers.js');

/*
  add ctrlUsers.authenticate to make a secure call
 */

// USER ROUTES
router
    .route('/users/:userId')
    .get(ctrlUsers.usersGetOne);


// CHARACTERS ROUTE
router
    .route('/users/:userId/characters')
    .get(ctrlCharacters.CharactersGetAll)
    .post(ctrlCharacters.CharactersAddOne);

router
    .route('/users/:userId/characters/:characterId')
    .get(ctrlCharacters.CharactersGetOne)
    .put(ctrlCharacters.CharactersUpdateOne);


// Authentication
router
    .route('/users/register')
    .post(ctrlUsers.register);

router
    .route('/users/login')
    .post(ctrlUsers.login);


module.exports = router;
