var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('qrtest', { title : 'barcode' });
});

module.exports = router;