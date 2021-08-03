var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('qrtest2', { title : 'barcode' });
});

module.exports = router;