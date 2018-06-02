var express = require('express');
var router = express.Router();
const ensureAuthenticated = require('../auth').ensureAuthenticated;
const User = require('../models/user');

router.all('*', ensureAuthenticated);

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findById(req.user)
  .then(user => {
    res.render('users', {
      user: user
    });
  })
});

module.exports = router;