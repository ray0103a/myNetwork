var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('mainMenu', { title : 'mainMenu' });
});

module.exports = router;