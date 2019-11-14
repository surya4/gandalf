var express = require('express');
var router = express.Router();
var homeController = require('../controllers/index');
var serviceController = require('../controllers/sw');

/* GET home page. */
router.get('/', homeController.indexGet);


module.exports = router;