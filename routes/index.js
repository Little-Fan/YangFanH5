var express = require('express');
var router = express.Router();

router.get('/jcs/', function(req, res, next){
  res.render('jcs/index', { title: '首页'});
  next();
});

/* GET home page. */
router.get(/^\/jcs\/([^\.]+)\.html/, function(req, res, next) {
  res.render(req.params[0], { title: '首页' });
  next();
});

module.exports = router;