const express = require('express');
const db = require('../models/sqlSchema');
const db1 = require('../models/mongoSchema');

/* GET home page. */
exports.index_get = function(req, res) {
    res.render('pages/index', {
        'title': 'Title Name'
    });
};