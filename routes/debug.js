var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('debug/index');
});

router.get('/localstrage_clear', function(req, res) {
  res.render('debug/localstrage_clear', {});
});

module.exports = router;
