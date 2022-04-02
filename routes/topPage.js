var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('topPage', { title : 'topPage' });
});

module.exports = router;