const express = require('express');
const db = require('../models/schema');

/* GET home page. */
exports.index_get = function(req, res) {
    res.render('pages/index', {
        'title': 'Title'
    });
};